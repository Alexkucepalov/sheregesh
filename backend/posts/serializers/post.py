from rest_framework import serializers

from posts.models import Post
from users.serializers.user import UserSerializer


class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(many=False, read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'author', 'image', 'likes', 'views', 'latitude', 'longitude']
