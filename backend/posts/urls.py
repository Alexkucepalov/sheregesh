from django.urls import path

from .views import PostView, TagsAPIView, TagsByPostIdAPIView

urlpatterns = [
    path('', PostView.as_view()),
    path('<int:pk>/', PostView.as_view()),
    path('tags/', TagsAPIView.as_view()),
    path('by_tags/<int:tagId>/', TagsByPostIdAPIView.as_view())

]
