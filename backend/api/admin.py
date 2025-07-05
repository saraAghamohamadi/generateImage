from django.contrib import admin
from .models import UserProfile, ImageGenerationRequest

admin.site.register(UserProfile)
admin.site.register(ImageGenerationRequest)