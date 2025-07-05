# api/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, ImageGenerationRequest

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = UserProfile
        fields = ('user', 'credits', 'api_key')

class ImageGenerationRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageGenerationRequest
        fields = ('id', 'prompt', 'image', 'timestamp')