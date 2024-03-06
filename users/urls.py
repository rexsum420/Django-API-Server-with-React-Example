from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet
from rest_framework.authtoken.views import obtain_auth_token

router = DefaultRouter()
router.register(r'profile', UserViewSet, basename='profile')

urlpatterns = [
    path('token/', obtain_auth_token, name='token_obtain_pair'),  # Use obtain_auth_token view
    # Remove the token refresh view since authtoken does not require refresh tokens

    path('profile/me/', UserViewSet.as_view({'get': 'me'}), name='profile-me'), 
    path('profile/<str:username>/', UserViewSet.as_view({'get': 'retrieve'}), name='profile-detail'),
    path('', include(router.urls)),
]
