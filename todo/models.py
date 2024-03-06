from django.db import models
from django.contrib.auth.models import User

class TodoList(models.Model):
    user = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='todolist')
    task = models.CharField(max_length=200)
    priority = models.IntegerField()
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.task

    def save(self, *args, **kwargs):
        if not self.pk:
            existing_count = TodoList.objects.count()
            self.priority = existing_count + 1
        super().save(*args, **kwargs)
