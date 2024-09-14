from drf_yasg.utils import swagger_auto_schema
from rest_framework import status, permissions
from rest_framework.exceptions import NotFound, AuthenticationFailed
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from utils import get_header_params
from .models import Post, Tag
from .serializers.post import PostSerializer
from .serializers.tag import TagSerializer
from .tasks import set_tag_for_post, set_description_for_post
from .utils.get_metadata_from_photo import get_gps_info


@swagger_auto_schema(manual_parameters=get_header_params())
class PostView(GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk=None):
        if pk is not None:
            # Получаем конкретную запись по первичному ключу
            try:
                post = Post.objects.get(pk=pk)
            except Post.DoesNotExist:
                raise NotFound(detail="Post not found")
            serializer = PostSerializer(post)
            return Response(serializer.data)
        else:
            # Получаем список всех записей с координатами
            posts = Post.objects.filter(latitude__isnull=False, longitude__isnull=False, status='published')
            serializer = PostSerializer(posts, many=True)
            return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        user = request.user

        # Проверяем аутентификацию
        if not user.is_authenticated:
            raise AuthenticationFailed("User is not authenticated")

        # Проверяем наличие изображения в запросе
        image_file = request.FILES.get('image')
        if not image_file:
            return Response({'error': 'Image file is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            post = Post.objects.create(author=user, image=image_file)
            lat, lon = get_gps_info(post.image.path)

            # Проверка на None (либо где-то должно происходить исключение)
            if lat is not None and lon is not None:
                post.latitude = lat
                post.longitude = lon

            post.save()

            set_tag_for_post.delay(post.id)
            set_description_for_post.delay(post.id)

            serializer = PostSerializer(post)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            # Логирование ошибки может быть полезным для отладки
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            obj = Post.objects.get(pk=pk)
            obj.delete()
            return Response({"message": "deleted"}, 200)
        except Post.DoesNotExist:
            raise NotFound(detail="Post not found")


class TagsAPIView(GenericAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        tags = Tag.objects.all()
        serializer = TagSerializer(tags, many=True)
        return Response(serializer.data)


class TagsByPostIdAPIView(GenericAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    permission_classes = [permissions.AllowAny]

    def get(self, request, tagId, *args, **kwargs):
        tag = Tag.objects.get(id=tagId)
        posts = Post.objects.filter(tags=tag)

        if not posts.exists():
            return Response({"error": "No posts found for the provided tags"}, status=404)

        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)
