import os
import django
from django.core.management.base import BaseCommand
from user_management.models import User, Household  # Adjust the import to your actual model names
from pantry_management.models import Pantry  # Import the Pantry model

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

class Command(BaseCommand):
    help = 'Delete all users, households, and pantries from the database'

    def handle(self, *args, **options):
        # Delete all users
        user_count = User.objects.count()  # Count users before deletion
        User.objects.all().delete()
        self.stdout.write(self.style.SUCCESS(f'Deleted {user_count} users.'))

        # Delete all households
        household_count = Household.objects.count()  # Count households before deletion
        Household.objects.all().delete()
        self.stdout.write(self.style.SUCCESS(f'Deleted {household_count} households.'))

        # Delete all pantries
        pantry_count = Pantry.objects.count()  # Count pantries before deletion
        Pantry.objects.all().delete()
        self.stdout.write(self.style.SUCCESS(f'Deleted {pantry_count} pantries.'))

        self.stdout.write(self.style.SUCCESS('All users, households, and pantries have been deleted.'))
