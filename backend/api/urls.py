from django.urls import path
from .views import UserLoginView, DashboardView, ImageGenerationHistoryView, GenerateImageView, SignUpView, ImageRequestDetailView

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('history/', ImageGenerationHistoryView.as_view(), name='history'),
    path('history/<int:pk>/', ImageRequestDetailView.as_view(), name='history-detail'),
    path('generate/', GenerateImageView.as_view(), name='generate'),
]