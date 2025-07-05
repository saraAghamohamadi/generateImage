from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import UserProfile

class APIKeyAuthentication(BaseAuthentication):
    def authenticate(self, request):
        # Look for the API key in a header named 'X-API-Key'
        api_key = request.headers.get('X-API-Key')
        if not api_key:
            return None # No API key provided, pass to the next authenticator

        try:
            user_profile = UserProfile.objects.get(api_key=api_key)
        except UserProfile.DoesNotExist:
            raise AuthenticationFailed('Invalid API Key')

        # If the key is valid, return the associated user
        return (user_profile.user, None)