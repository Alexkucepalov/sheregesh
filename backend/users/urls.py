from django.urls import path
from .views import RegisterView, ObtainAuthTokenView, CurrentUserApiView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', ObtainAuthTokenView.as_view(), name='api_token_auth'),
    path('current/', CurrentUserApiView.as_view(), name='current_user')
]
