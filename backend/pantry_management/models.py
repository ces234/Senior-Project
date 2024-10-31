# pantryManagement/models.py
from django.db import models
from user_management.models import Household
from recipe_management.models import Ingredient

class Pantry(models.Model):
    household = models.OneToOneField(Household, on_delete=models.SET_NULL, related_name='pantry', null=True)
    ingredients = models.ManyToManyField(Ingredient, through='PantryIngredient')  # Many-to-Many relationship via PantryIngredient

    def __str__(self):
        return f"Pantry of {self.household.admin.username if self.household and self.household.admin else 'Unknown Household'}"

    @classmethod
    def delete_all_pantries(cls):
        """
        Deletes all Pantry records and their related PantryIngredient records.
        """
        cls.objects.all().delete()

class PantryIngredient(models.Model):
    pantry = models.ForeignKey(Pantry, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    unit = models.CharField(max_length=50, null = True, blank = True)  # Unit of measurement (e.g., grams, cups, tablespoons)

    class Meta:
        unique_together = ('pantry', 'ingredient')

    def __str__(self):
        return f"{self.ingredient.name}: {self.quantity}"
