from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from user_management.models import User, Household
from recipe_management.models import Recipe  # Assuming you have a Recipe model

class Command(BaseCommand):
    help = 'Populate the database with a test user and household'

    def handle(self, *args, **kwargs):
        # Create a test user
        user, created = User.objects.get_or_create(
            username='testuser',
            defaults={
                'password': make_password('password123'),  # Ensure the password is hashed
                'email': 'testuser@example.com',
                'status': 'member'
            }
        )
        
        if created:
            self.stdout.write(self.style.SUCCESS('Test user created: {}'.format(user.username)))
        else:
            self.stdout.write(self.style.WARNING('Test user already exists: {}'.format(user.username)))

        # Create a household and add the user as admin
        household, created = Household.objects.get_or_create(admin=user)

        # Add the user to the household members if not already added
        if user not in household.members.all():
            household.members.add(user)  # Add the user to the household
            self.stdout.write(self.style.SUCCESS('User added to household: {}'.format(user.username)))

        household.save()  # Save the household

        self.stdout.write(self.style.SUCCESS('Household created for user: {}'.format(user.username)))
