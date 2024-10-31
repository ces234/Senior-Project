# userManagement/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
import random


class User(AbstractUser):
    # Inherits username, password, email, etc. from AbstractUser
    STATUS_CHOICES = [
        ('member', 'Member'),
        ('admin', 'Admin'),
    ]
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    preferences = models.JSONField(null=True, blank=True)  # Store user-specific preferences in JSON format
    saved_recipes = models.ManyToManyField('recipe_management.Recipe', related_name='saved_by_users', blank=True)  # New field to track saved recipes

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_management_user_set',  # Updated related_name
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_management_user_permissions_set',  # Updated related_name
        blank=True
    )

    def __str__(self):
        return self.username

class Household(models.Model):
    admin = models.OneToOneField(User, on_delete=models.SET_NULL, related_name='household', null=True)
    members = models.ManyToManyField(User, related_name='households')
    saved_recipes = models.ManyToManyField('recipe_management.Recipe', related_name='saved_by_households')  # Many-to-Many to track saved recipes
    recently_added = models.ManyToManyField('recipe_management.Recipe', related_name = "receadntly_added_by_households")
    join_code = models.CharField(max_length = 6, unique = True, blank = True)

    def addRecentlyAddedRecipe(self, recipe):
        if recipe not in self.recently_added.all():
            self.recently_added.add(recipe)
            self.save()
    
    def save(self, *args, **kwargs):
        if not self.join_code:
            self.join_code = ''.join(random.choices('0123456789', k = 6))
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Household of {self.admin.username if self.admin else 'Unknown Admin'}"
