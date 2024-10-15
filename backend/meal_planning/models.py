from django.db import models
from user_management.models import User, Household
from recipe_management.models import Recipe, RecipeIngredient
from grocery_management.models import GroceryList

class MealPlan(models.Model):
    admin = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)  # The admin user who created the plan
    household = models.ForeignKey(Household, on_delete=models.SET_NULL, default=None, null=True, related_name='meal_plans')  # Meal plans are for households
    start_date = models.DateField()
    end_date = models.DateField()
    recipes = models.ManyToManyField(Recipe, through='MealPlanRecipe')  # Plan is associated with multiple recipes

    def __str__(self):
        return f"Meal Plan from {self.start_date} to {self.end_date} for {self.household.admin.username if self.household.admin else 'Unknown Household'}"
    
    def generate_grocery_list(self):
        grocery_list, created = GroceryList.objects.get_or_create(household = self.household)

        unique_ingredients = set()

        meal_plan_recipes = MealPlanRecipe.objects.filter(meal_plan=self).select_related('recipe')
        for meal_plan_recipe in meal_plan_recipes:
            recipe = meal_plan_recipe.recipe
            recipe_ingredients = RecipeIngredient.objects.filter(recipe=recipe)

            for recipe_ingredient in recipe_ingredients:
                unique_ingredients.add(recipe_ingredient.ingredient)

        for ingredient in unique_ingredients:
            grocery_list.add_ingredient(ingredient)

        return grocery_list
    
    @classmethod 
    def get_or_create_meal_plan(cls, start_date, end_date, household, admin=None):
        meal_plan = cls.objects.filter(start_date=start_date, end_date=end_date, household=household).first()

        if not meal_plan:
            meal_plan = cls.objects.create(start_date=start_date, end_date=end_date, household=household, admin=admin)

        return meal_plan
    
    @classmethod
    def get_meal_plan_recipes(self):
        """
        Retrieve all recipes associated with this meal plan.
        Returns a list of dictionaries containing recipe details along with day and meal type.
        """
        meal_plan_recipes = (
            MealPlanRecipe.objects
            .filter(meal_plan=self)
            .select_related('recipe')
        )
        
        recipes_list = []
        for meal_plan_recipe in meal_plan_recipes:
            recipes_list.append({
                'recipe_id': meal_plan_recipe.recipe.id,
                'recipe_name': meal_plan_recipe.recipe.name,
                'day': meal_plan_recipe.day,
                'meal_type': meal_plan_recipe.meal_type,
            })

        return recipes_list  # Return a list of recipes with their details

class MealPlanRecipe(models.Model):
    MEAL_CHOICES = [
        ('breakfast', 'Breakfast'),
        ('lunch', 'Lunch'),
        ('dinner', 'Dinner'),
        ('dessert', 'Dessert'),
        ('snack', 'Snack'),
    ]

    DAY_CHOICES = [
        ('monday', 'Monday'),
        ('tuesday', 'Tuesday'),
        ('wednesday', 'Wednesday'),
        ('thursday', 'Thursday'),
        ('friday', 'Friday'),
        ('saturday', 'Saturday'),
        ('sunday', 'Sunday'),
    ]

    meal_plan = models.ForeignKey(MealPlan, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    day = models.CharField(max_length=15, choices=DAY_CHOICES, null=True)  # Added field for meal type
    meal_type = models.CharField(max_length=10, choices=MEAL_CHOICES, null=True)  # Added field for meal type

    class Meta:
        unique_together = ('meal_plan', 'recipe', 'day')

    def __str__(self):
        return f"{self.recipe.name} on {self.day} ({self.get_meal_type_display()})"
