# Generated by Django 5.0.3 on 2024-03-09 02:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0004_rename_completed_todolist_iscompleted'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='todolist',
            name='isCompleted',
        ),
    ]