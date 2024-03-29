from rest_framework import viewsets
from django.contrib.auth.models import User
from .serializers import UserSerializer, ProfileSerializer
from rest_framework.response import Response
from rest_framework import status
from django.http.response import Http404, HttpResponseForbidden
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from datetime import timedelta
from .models import Profile
from django.http import QueryDict
from rest_framework.decorators import action

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_serializer_class(self):
        if self.action in {'list', 'retrieve', 'update', 'partial_update'}:
            return ProfileSerializer
        return UserSerializer
    
    def get_authentication_classes(self):
        if self.action != 'create':
            return [TokenAuthentication]
        return []

    def get_permissions_classes(self):
        if self.action == "create":
            return []
        return [IsAuthenticated]

    def get_queryset(self):
        if self.action in ['create', 'destroy']:
            return User.objects.all()
        return Profile.objects.all()

    def retrieve(self, request, username=None):
        try:
            profile = Profile.objects.get(user__username=username)
            serializer = ProfileSerializer(profile)
            return Response(serializer.data)
        except Profile.DoesNotExist:
            raise Http404("User does not exist")
        
    @action(detail=False, methods=['get'])
    def me(self, request):
        if not request.user.is_authenticated:
            return Response({"error": "User is not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

        profile = Profile.objects.get(user=request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def get_object(self):
        queryset = self.get_queryset()
        username = self.kwargs.get('username')
        user = queryset.filter(username=username).first()
        if not user:
            raise Http404("User does not exist")
        return user

    def update(self, request, *args, **kwargs):
        if kwargs['username'] != request.user.username:
            raise HttpResponseForbidden("You can only edit your own profile.")
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        if user.username == request.user.username or IsAdminUser().has_permission(request, self):
            return super().destroy(request, *args, **kwargs)
        return HttpResponseForbidden("You don't have permission to delete this user.")

    def create(self, request, *args, **kwargs):
        # Check if username or email already exists
        username_exists = User.objects.filter(username=request.data.get('username')).exists()
        email_exists = User.objects.filter(email=request.data.get('email')).exists()
        if username_exists or email_exists:
            return HttpResponseForbidden("Username or email already exists")
        return super().create(request, *args, **kwargs)
