from django.db import models
from user_management.models import Household  # Import your Household model
from recipe_management.models import Ingredient  # Import your Ingredient model

class Pantry(models.Model):
    household = models.OneToOneField(Household, on_delete=models.SET_NULL, related_name='pantry', null=True)
    ingredients = models.ManyToManyField(Ingredient, through='PantryIngredient', related_name='pantries', blank=True)

    def __str__(self):
        return f"Pantry for {self.household}"

    def add_ingredient(self, ingredient, quantity, unit=None):
        """
        Adds or updates an ingredient in the pantry with a specified quantity and unit.
        """
        pantry_ingredient, created = PantryIngredient.objects.get_or_create(
            pantry=self,
            ingredient=ingredient,
            defaults={'quantity': quantity, 'unit': unit}
        )
        if not created:
            pantry_ingredient.quantity += quantity
            if unit:  # Update unit if provided
                pantry_ingredient.unit = unit
            pantry_ingredient.save()

    def remove_ingredient(self, ingredient):
        """
        Removes an ingredient from the pantry if it exists.
        """
        PantryIngredient.objects.filter(pantry=self, ingredient=ingredient).delete()


class PantryIngredient(models.Model):
    pantry = models.ForeignKey(Pantry, on_delete=models.CASCADE, related_name='pantry_ingredients')
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE, related_name='pantry_ingredients')
    quantity = models.FloatField()  # Using FloatField for more flexibility with quantities
    unit = models.CharField(max_length=50, null=True, blank=True)  # Optional unit (e.g., grams, cups)

    def __str__(self):
        return f"{self.quantity} {self.unit or ''} of {self.ingredient.name} in {self.pantry}"

    class Meta:
        unique_together = ('pantry', 'ingredient')
