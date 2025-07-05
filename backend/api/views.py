from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from .models import UserProfile, ImageGenerationRequest
from .serializers import UserProfileSerializer, ImageGenerationRequestSerializer
import requests
import os
from dotenv import load_dotenv

load_dotenv()

DREAMSTUDIO_API_KEY = os.getenv("DREAMSTUDIO_API_KEY")

class UserLoginView(TokenObtainPairView):
    pass

class DashboardView(generics.RetrieveAPIView):
    print("sep")
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    print(serializer_class)
    print(permission_classes)
    def get_object(self):
        return UserProfile.objects.get(user=self.request.user)

class ImageGenerationHistoryView(generics.ListAPIView):
    serializer_class = ImageGenerationRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ImageGenerationRequest.objects.filter(user=self.request.user).order_by('-timestamp')

import io
from huggingface_hub import InferenceClient

# ... other existing imports
# from rest_framework.views import APIView (should already be there)
from django.core.files.base import ContentFile 
import os, uuid, base64

# ...

# Load the new environment variable
HF_TOKEN = os.getenv("HF_TOKEN")
from .authentication import APIKeyAuthentication
# Import the JWT authentication class if it's not already globally set
from rest_framework_simplejwt.authentication import JWTAuthentication
class GenerateImageView(APIView):
    authentication_classes = [JWTAuthentication, APIKeyAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # The rest of this view's code remains exactly the same...
        user_profile = UserProfile.objects.get(user=request.user)

        if user_profile.credits <= 0:
            return Response({'error': 'Insufficient credits'}, status=status.HTTP_402_PAYMENT_REQUIRED)
        prompt = request.data.get('prompt')
        if not prompt:
            return Response({'error': 'Prompt is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # 1. Initialize the Hugging Face client
            client = InferenceClient(token=HF_TOKEN)

            # 2. Call the Hugging Face text-to-image API
            # The output is a raw PIL.Image object
            image_obj = client.text_to_image(
                prompt,
                model="stabilityai/stable-diffusion-xl-base-1.0", # A popular, general-purpose model
            )

            # 3. Convert the PIL.Image object into a file Django can save
            buffer = io.BytesIO()
            image_obj.save(buffer, format='PNG')
            image_file = ContentFile(buffer.getvalue())

            # 4. Save the image and update user credits
            file_name = f'{request.user.id}_{uuid.uuid4()}.png'
            generation_request = ImageGenerationRequest(
                user=request.user,
                prompt=prompt,
            )
            generation_request.image.save(file_name, image_file, save=True)

            user_profile.credits -= 1
            user_profile.save()

            return Response({
                'image_url': generation_request.image.url,
                'credits': user_profile.credits
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            # Catch potential API errors or other exceptions
            print(f"Error generating image: {e}")
            return Response({'error': 'Failed to generate image.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
from django.db import IntegrityError
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny # Add this import
from .models import UserProfile # Add this import

# ... existing views

class SignUpView(APIView):
    permission_classes = [AllowAny] # Allow anyone to access this view

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {'error': 'Username and password are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.create_user(username=username, password=password)
            # Create a corresponding UserProfile
            UserProfile.objects.create(user=user)
            return Response(
                {'message': f'User {username} created successfully.'},
                status=status.HTTP_201_CREATED
            )
        except IntegrityError:
            return Response(
                {'error': 'This username is already taken.'},
                status=status.HTTP_400_BAD_REQUEST
            )

class ImageRequestDetailView(generics.RetrieveAPIView):
    serializer_class = ImageGenerationRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Ensure users can only access their own history objects
        return ImageGenerationRequest.objects.filter(user=self.request.user)