from django.contrib.auth import get_user_model
from rest_framework import serializers

from users.models import CustomUser

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class UserSerializer(serializers.ModelSerializer):
    """
    Для возврата автора поста
    Пока что только email
    """

    class Meta:
        model = CustomUser
        fields = ('email',)
