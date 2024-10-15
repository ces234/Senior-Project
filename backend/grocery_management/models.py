# grocery_management/models.py
from django.db import models
from user_management.models import Household  # Import your Household model
from recipe_management.models import Ingredient  # Import your Ingredient model

class GroceryList(models.Model):
    household = models.OneToOneField(Household, on_delete=models.CASCADE, related_name='grocery_list')
    ingredients = models.ManyToManyField(Ingredient, related_name='grocery_lists', blank=True)  # Many-to-Many with Ingredient

    def __str__(self):
        return f"Grocery List for {self.household}"

    def add_ingredient(self, ingredient):
        if ingredient not in self.ingredients.all():
            self.ingredients.add(ingredient)
            self.save()

    def remove_ingredient(self, ingredient):
        if ingredient in self.ingredients.all():
            self.ingredients.remove(ingredient)
            self.save()
