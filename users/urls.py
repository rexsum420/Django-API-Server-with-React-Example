from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'profile', UserViewSet, basename='profile')

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/me/', UserViewSet.as_view({'get': 'me'}), name='profile-me'), 
    path('profile/<str:username>/', UserViewSet.as_view({'get': 'retrieve'}), name='profile-detail'),
    path('', include(router.urls)),
]
