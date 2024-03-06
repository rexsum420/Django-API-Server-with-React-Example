from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import TodoList
from .serializers import TodoListSerializer, CreateTodoSerializer

class TodoListViewSet(viewsets.ModelViewSet):
    queryset = TodoList.objects.all()
    serializer_class = TodoListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateTodoSerializer
        return TodoListSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def check_permission(self, instance):
        if instance.user != self.request.user:
            return Response({'error':'You do not have permission to this To Do List'}, status=status.HTTP_403_FORBIDDEN)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        response = self.check_permission(instance)
        if response is not None:
            return response
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        response = self.check_permission(instance)
        if response is not None:
            return response
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        response = self.check_permission(instance)
        if response is not None:
            return response
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        response = self.check_permission(instance)
        if response is not None:
            return response
        instance.delete()
        return Response({'detail': 'Task has been deleted'}, status=status.HTTP_204_NO_CONTENT)
