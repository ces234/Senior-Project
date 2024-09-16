# mealPlanning/models.py
from django.db import models
from user_management.models import User, Household
from recipe_management.models import Recipe

class MealPlan(models.Model):
    admin = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)  # The admin user who created the plan
    household = models.ForeignKey(Household, on_delete=models.SET_NULL, default = None, null=True, related_name='meal_plans')  # Meal plans are for households
    start_date = models.DateField()
    end_date = models.DateField()
    recipes = models.ManyToManyField(Recipe, through='MealPlanRecipe')  # Plan is associated with multiple recipes

    def __str__(self):
        return f"Meal Plan from {self.start_date} to {self.end_date} for {self.household.admin.username if self.household.admin else 'Unknown Household'}"

class MealPlanRecipe(models.Model):
    meal_plan = models.ForeignKey(MealPlan, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    day = models.DateField()

    class Meta:
        unique_together = ('meal_plan', 'recipe', 'day')

    def __str__(self):
        return f"{self.recipe.name} on {self.day}"
