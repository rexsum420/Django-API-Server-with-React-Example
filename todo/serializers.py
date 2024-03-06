from rest_framework import serializers
from .models import TodoList
from rest_framework.response import Response
from rest_framework.status import is_success

# serializer for reading and writing to the database.
class TodoListSerializer(serializers.ModelSerializer):
    class Meta:
        model = TodoList
        fields = ['id','user', 'task', 'priority', 'isCompleted']

class CreateTodoSerializer(serializers.ModelSerializer):
    class Meta:
        model =TodoList
        fields = ['user', 'task']

        def create(self, validated_data):
            try:
                obj = TodoList.objects.create(task=validated_data)
                return  Response({"message": "Task created successfully", "task":obj}, status=201)
            except:
                return Response({"error":"Error creating task"}, status=400)

