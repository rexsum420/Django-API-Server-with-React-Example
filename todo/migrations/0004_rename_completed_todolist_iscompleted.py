# Generated by Django 5.0.3 on 2024-03-08 23:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0003_alter_todolist_user'),
    ]

    operations = [
        migrations.RenameField(
            model_name='todolist',
            old_name='completed',
            new_name='isCompleted',
        ),
    ]
