from django.db import models
from user_management.models import User  # Import your custom User model
from django.core.exceptions import ValidationError

class Ingredient(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=200, unique=True)

    def __str__(self):
        return self.name

class Recipe(models.Model):
    name = models.CharField(max_length=200, unique=True)
    prep_time = models.IntegerField()  # in minutes
    cook_time = models.IntegerField()  # in minutes
    servings = models.IntegerField()
    instructions = models.TextField()
    ingredients = models.ManyToManyField(Ingredient, through='RecipeIngredient')  # Many-to-Many through RecipeIngredient
    categories = models.ManyToManyField(Category)  # Many-to-Many with Category

    def __str__(self):
        return self.name
    
    def get_categories(self):
        return self.categories.all()  # Returns all categories related to this recipe

class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.FloatField(null=True, blank=True)  # Quantity of the ingredient (e.g., 1.5)
    unit = models.CharField(max_length=200, null=True, blank=True)  # Unit of measurement (e.g., grams, cups, tablespoons)

    class Meta:
        unique_together = ('recipe', 'ingredient')  # Ensure that a recipe can't have duplicate ingredients

    def __str__(self):
        return f"{self.quantity} {self.unit} of {self.ingredient.name} in {self.recipe.name}"

class RecipeRating(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Referencing your custom User model
    rating = models.IntegerField()  # Rating can be a value from 1-5

    class Meta:
        unique_together = ('recipe', 'user')  # Ensure a user can only rate a recipe once

    def __str__(self):
        return f"Rating of {self.rating} for {self.recipe.name} by {self.user.username}"

class RecipeRequest(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='requests')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recipe_requests')
    request_date = models.DateTimeField(auto_now_add=True)  # Date and time when the request was made
    message = models.TextField(null=True, blank=True)  # Optional message from the user

    class Meta:
        unique_together = ('recipe', 'user')  # Ensure a user can only request a specific recipe once

    def clean(self):
        # Ensure the user has "member" status and belongs to a household
        if self.user.status != 'member':
            raise ValidationError("Only household members (not admins) can request a recipe.")
        
        # Check if the user is part of a household
        if not self.user.households.exists():
            raise ValidationError("User must be a member of a household to request a recipe.")

    def save(self, *args, **kwargs):
        # Call clean() to apply validations before saving
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} requested {self.recipe.name} on {self.request_date.strftime('%Y-%m-%d')}"