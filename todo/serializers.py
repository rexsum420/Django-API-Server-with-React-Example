from rest_framework import serializers
from .models import TodoList
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST

# serializer for reading and writing to the database.
class TodoListSerializer(serializers.ModelSerializer):
    class Meta:
        model = TodoList
        fields = ['id','user', 'task', 'priority']

class CreateTodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TodoList
        fields = ['task']

    def create(self, validated_data):
        try:
            user = self.context['request'].user
            task = validated_data.get('task')
            obj = TodoList.objects.create(user=user, task=task)
            return Response({"message": "Task created successfully", "task": obj}, status=HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": "Error creating task"}, status=HTTP_400_BAD_REQUEST)
