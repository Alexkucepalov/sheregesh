# views.py
from django.contrib.auth import authenticate
from django.http import HttpRequest
from rest_framework import status, permissions
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView

from posts.models import Post
from posts.serializers.post import PostSerializer
from users.serializers.user import RegisterSerializer, UserSerializer


class RegisterView(GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer
    queryset = Post.objects.all()

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'User created'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ObtainAuthTokenView(GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer
    queryset = Post.objects.all()

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(email=email, password=password)
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)


class CurrentUserApiView(GenericAPIView):
    serializer_class = RegisterSerializer
    queryset = Post.objects.all()
    def get(self, request):
        token = request.META.get('HTTP_AUTHORIZATION').split(' ')[1]
        user = Token.objects.get(key=token).user
        serializer = UserSerializer(user)
        return Response(serializer.data)

class PostsByUserIdAPIView(GenericAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.all()

    permission_classes = [permissions.AllowAny]

    def get(self, request : HttpRequest, *args, **kwargs):
        token = request.META.get('HTTP_AUTHORIZATION').split(' ')[1]
        user = Token.objects.get(key=token).user
        posts = Post.objects.filter(author=user.id)
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)
