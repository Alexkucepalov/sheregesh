import os

from celery import Celery
from celery.schedules import crontab

# Установить модуль с настройками. Должна идти до следующей строчки
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sheregesh.settings')

app = Celery('sheregesh')

# Позволит создавать настройки для celery в settings.py
app.config_from_object('django.conf:settings', namespace='CELERY')

# Сканирует все приложения и ищет файл tasks.py
app.autodiscover_tasks()

