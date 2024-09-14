from celery import shared_task
from posts.models import Post, Tag


@shared_task
def set_tag_for_post(post_id: int):
    try:
        post = Post.objects.get(id=post_id)
        # Вместо закомментированного кода с get_tag используем простое значение
        tag_name = 'Природа'  # Здесь вы могли бы получить тег с помощью get_tag поста

        # Получаем или создаём тег
        tag_obj, created = Tag.objects.get_or_create(name=tag_name)  # Название поля должно соответствовать
        post.tags.add(tag_obj)  # Добавляем тег к посту
        post.save()
        return f'Tag set for post {post_id}: {tag_name}'

    except Post.DoesNotExist:
        return f'Post with id {post_id} does not exist.'
    except Exception as e:
        return f'An error occurred: {str(e)}'


@shared_task
def set_description_for_post(post_id: int):
    try:
        post = Post.objects.get(id=post_id)
        # Вместо закомментированного кода с get_description используем простое значение
        desc = 'Описание фотографии с природой'  # Здесь вы могли бы получить описание с помощью get_description поста

        post.description = desc
        post.save()
        return f'Description set for post {post_id}.'

    except Post.DoesNotExist:
        return f'Post with id {post_id} does not exist.'
    except Exception as e:
        return f'An error occurred: {str(e)}'