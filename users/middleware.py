from django.utils import timezone
from .models import Profile

class UpdateLastActiveMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated:
            try:
                profile = request.user.profile
                profile.last_active = timezone.now()
                profile.save()
                print('Middleware Updated')
            except Profile.DoesNotExist:
                pass

        response = self.get_response(request)
        return response
