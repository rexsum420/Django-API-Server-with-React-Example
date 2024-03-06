from rest_framework import viewsets
from django.contrib.auth.models import User
from .serializers import UserSerializer, ProfileSerializer, ProfileListSerializer
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


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_serializer_class(self):
        if self.action in {'retrieve', 'update', 'partial_update'}:
            return ProfileSerializer
        elif self.action == 'list':
            return ProfileListSerializer
        return UserSerializer
    
    def get_authentication_classes(self):
        if self.action != 'create':
            return [TokenAuthentication]
        return []

    def get_permissions_classes(self):
        if self.action == "create":
            return []
        return [IsAuthenticated]

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

class TokenObtainPairView(APIView):
    permission_classes = []

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        # Check for missing username or password
        if not username or not password:
            return Response({"error": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Attempt authentication
        user = authenticate(username=username, password=password)

        # Handle authentication failure
        if user is None:
            return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

        # Generate JWT token pair
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        })

def refresh_jwt_token(refresh_token):
    refresh = RefreshToken(refresh_token)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)
    return access_token, refresh_token