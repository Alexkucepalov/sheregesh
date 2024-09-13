from django.contrib.auth import get_user_model
from django.db import models
from django.utils.safestring import mark_safe


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

    moderated = models.BooleanField(default=False)

    def image_tag(self):
        return mark_safe('<img src="%s" width="150" height="150" />' % self.image.url)

    image_tag.allow_tags = True


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    commentator = models.ForeignKey(get_user_model(), on_delete=models.SET_NULL, null=True)
    text = models.TextField()
