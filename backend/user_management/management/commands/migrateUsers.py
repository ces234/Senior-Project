import os
import django
from django.core.management.base import BaseCommand
from pantry_management.models import Pantry, PantryIngredient
from user_management.models import User
from user_management.models import Household
from recipe_management.models import Ingredient, Recipe

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

class Command(BaseCommand):
    help = 'Populate the database with sample users'

    def handle(self, *args, **kwargs):
        # Create or get sample users
        users_data = [
            {
                'username': 'johndoe',
                'first_name': 'John',
                'last_name': 'Doe',
                'email': 'johndoe@example.com',
                'preferences': {'diet': 'vegetarian'},
                'status': 'member',
                'password': 'password123',
            },
            {
                'username': 'janedoe',
                'first_name': 'Jane',
                'last_name': 'Doe',
                'email': 'janedoe@example.com',
                'preferences': {'diet': 'vegan'},
                'status': 'admin',
                'password': 'password123',
            },
            {
                'username': 'alice',
                'first_name': 'Alice',
                'last_name': 'Doe',
                'email': 'alice@example.com',
                'status': 'member',
                'password': 'password123',
            },
            {
                'username': 'bob',
                'first_name': 'Bob',
                'last_name': 'Doe',
                'email': 'bob@example.com',
                'status': 'member',
                'password': 'password123',
            },
        ]

        # Dictionary to hold created users
        created_users = {}

        for user_data in users_data:
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults={
                    'first_name': user_data['first_name'],
                    'last_name': user_data['last_name'],
                    'email': user_data['email'],
                }
            )
            if created:
                user.preferences = user_data.get('preferences', {})
                user.status = user_data['status']
                user.set_password(user_data['password'])  # Set the password
                user.save()
                self.stdout.write(self.style.SUCCESS(f'Successfully created user {user.username}'))
            else:
                self.stdout.write(self.style.WARNING(f'User {user.username} already exists'))
            
            # Store the user in the dictionary
            created_users[user_data['username']] = user

        # Create households and associate users
        household1, created = Household.objects.get_or_create(admin=created_users['janedoe'])  # Admin is janedoe
        if created:
            household1.members.add(created_users['johndoe'], created_users['alice'])  # Add johndoe and alice as members

        household2, created = Household.objects.get_or_create(admin=created_users['bob'])  # Admin is bob
        if created:
            household2.members.add(created_users['alice'])  # Add alice as member

        self.stdout.write(self.style.SUCCESS('Households created successfully!'))

        # Optional: Further implementation for pantries, recipes, etc.
        self.stdout.write(self.style.SUCCESS('Pantry and PantryIngredients created successfully!'))
