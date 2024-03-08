from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TodoListViewSet

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'todolists', TodoListViewSet, basename='todolist')

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
]

