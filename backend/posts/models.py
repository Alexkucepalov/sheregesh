from django.contrib.auth import get_user_model
from django.db import models


class Tag(models.Model):
    name = models.CharField(max_length=128)


class Post(models.Model):
    author = models.ForeignKey(get_user_model(), on_delete=models.SET_NULL, null=True)
    time_created = models.DateTimeField(auto_now=True)
    tags = models.ManyToManyField(Tag)
    description = models.TextField()
    image = models.ImageField(upload_to='images/')
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    likes = models.PositiveIntegerField(default=0)
    views = models.PositiveIntegerField(default=0)


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    commentator = models.ForeignKey(get_user_model(), on_delete=models.SET_NULL, null=True)
    text = models.TextField()
