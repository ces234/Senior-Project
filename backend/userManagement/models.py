# userManagement/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Inherits username, password, email, etc. from AbstractUser
    STATUS_CHOICES = [
        ('member', 'Member'),
        ('admin', 'Admin'),
    ]
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    preferences = models.JSONField(null=True, blank=True)  # Store user-specific preferences in JSON format

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
    saved_recipes = models.ManyToManyField('recipeManagement.Recipe', related_name='saved_by_households')  # Many-to-Many to track saved recipes

    def __str__(self):
        return f"Household of {self.admin.username if self.admin else 'Unknown Admin'}"
