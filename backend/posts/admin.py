from django.contrib import admin

from posts.models import Comment, Post, Tag


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    pass


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    """Класс админки"""
    list_display = ('author', 'time_created', 'status', 'image_tag')
    fields = ('author', 'status', 'image_tag', 'tags', 'description', 'latitude', 'longitude')
    readonly_fields = ('image_tag',)
    list_editable = ('status',)
    list_filter = ('status',)


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    pass
