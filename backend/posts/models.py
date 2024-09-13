from django.contrib.auth import get_user_model
from django.db import models
from django.utils.safestring import mark_safe


class Tag(models.Model):
    name = models.CharField(max_length=128, verbose_name='Наименование')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Тег'
        verbose_name_plural = 'Теги'


class Post(models.Model):
    """
    image to model
        comment
        image

    """
    author = models.ForeignKey(get_user_model(), on_delete=models.SET_NULL, null=True, verbose_name='Автор')
    time_created = models.DateTimeField(auto_now=True, verbose_name='Время создания')
    tags = models.ManyToManyField(Tag, verbose_name='Теги', blank=True, null=True)
    description = models.TextField(verbose_name='Описание', blank=True, null=True)
    image = models.ImageField(upload_to='images/')
    latitude = models.FloatField(null=True, blank=True, verbose_name='Широта')
    longitude = models.FloatField(null=True, blank=True, verbose_name='Долгота')

    likes = models.PositiveIntegerField(default=0, verbose_name='Лайки')
    views = models.PositiveIntegerField(default=0, verbose_name='Просмотры')

    STATUS_CHOICES = [
        ('analyze', 'Анализирует нейросеть'),
        ('moderation', 'На модерации'),
        ('published', 'Опубликован'),
    ]
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='analyze',  # Значение по умолчанию
    )

    def __str__(self):
        return f'{self.time_created} {self.status}'

    def image_tag(self):
        return mark_safe('<img src="%s" width="150" height="150" />' % self.image.url)

    image_tag.allow_tags = True

    class Meta:
        verbose_name = 'Пост'
        verbose_name_plural = 'Посты'


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, verbose_name='Пост')
    commentator = models.ForeignKey(get_user_model(), on_delete=models.SET_NULL, null=True, verbose_name='Комментатор')
    text = models.TextField(verbose_name='Текст комментария')

    class Meta:
        verbose_name = 'Комментарий'
        verbose_name_plural = 'Комментарии'
