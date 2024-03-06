from django.utils import timezone
from django.contrib.auth.models import AnonymousUser
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed

class UpdateLastActiveMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if not isinstance(request.user, AnonymousUser):
            profile = request.user.profile
            profile.last_active = timezone.now()
            profile.save()
        else:
            try:
                auth = request.headers.get('Authorization')
                if auth and auth.startswith('Token '):
                    key = auth.split(' ')[1]
                    user, _ = TokenAuthentication().authenticate_credentials(key)  # Extract user from tuple
                    request.user = user
                    profile = request.user.profile
                    profile.last_active = timezone.now()
                    profile.save()

                else:
                    raise AuthenticationFailed('Invalid token')
            except (Token.DoesNotExist, AuthenticationFailed):
                pass

        response = self.get_response(request)
        return response
