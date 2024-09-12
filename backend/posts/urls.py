from django.urls import path

from .views import PostView

urlpatterns = [
    path('', PostView.as_view()),
    path('<int:pk>/', PostView.as_view()),
]
