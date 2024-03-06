from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

class Command(BaseCommand):
    help = 'Migrates existing users\' tokens from JWT to TokenAuthentication'

    def handle(self, *args, **options):
        # Iterate over all existing users
        for user in User.objects.all():
            # Generate a token for each user using Token.objects.create()
            token, created = Token.objects.get_or_create(user=user)
            if created:
                self.stdout.write(self.style.SUCCESS(f"Token generated for user '{user.username}'"))
            else:
                self.stdout.write(self.style.NOTICE(f"Token already exists for user '{user.username}'"))
