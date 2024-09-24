import os
import django
from django.core.management.base import BaseCommand
from user_management.models import User
from user_management.models import Household
from recipe_management.models import Recipe
import json

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

class Command(BaseCommand):
    help = 'Populate the database with sample users'

    def handle(self, *args, **kwargs):

        # Create or get sample users
        user1, created = User.objects.get_or_create(
            username='johndoe',
            defaults={
                'first_name': 'John',
                'last_name': 'Doe',
                'email': 'johndoe@example.com',
            }
        )
        if created:
            user1.preferences = {'diet': 'vegetarian'}  # Assign preferences as a dict
            user1.status = 'member'
            user1.set_password('password123')
            user1.save()

        user2, created = User.objects.get_or_create(
            username='janedoe',
            defaults={
                'first_name': 'Jane',
                'last_name': 'Doe',
                'email': 'janedoe@example.com',
            }
        )
        if created:
            user2.preferences = {'diet': 'vegan'}
            user2.status = 'admin'
            user2.set_password('password123')
            user2.save()

        # Create or get more users if needed
        user3, created = User.objects.get_or_create(
            username='alice',
            defaults={
                'first_name': 'Alice',
                'last_name': "Doe",
                'email': 'alice@example.com',
            }
        )
        if created:
            user3.status = 'member'
            user3.set_password('password123')
            user3.save()

        user4, created = User.objects.get_or_create(
            username='bob',
            defaults={
                'first_name': 'Bob',
                'last_name': "Doe",
                'email': 'bob@example.com',
            }
        )
        if created:
            user4.status = 'member'
            user4.set_password('password123')
            user4.save()

        self.stdout.write(self.style.SUCCESS('Users created successfully!'))

        # Get sample recipes
        recipe1 = Recipe.objects.get(id=92)
        print(recipe1)
        recipe2 = Recipe.objects.get(id=14084)
        print(recipe2)

        # Create a household and associate users and recipes
        household1, created = Household.objects.get_or_create(admin=user2)  # Admin is janedoe
        if created:
            household1.members.add(user1, user3)  # Add johndoe and alice as members
            household1.saved_recipes.add(recipe1, recipe2)

        household2, created = Household.objects.get_or_create(admin=user4)  # Admin is bob
        if created:
            household2.members.add(user3)  # Add alice as member
            household2.saved_recipes.add(recipe2)

        self.stdout.write(self.style.SUCCESS('Households and saved recipes created successfully!'))

