from django.core.exceptions import ObjectDoesNotExist
from rest_framework.exceptions import ValidationError
from meal_planning.models import MealPlan, MealPlanRecipe

def get_meal_plan_recipes_utility(user, start_date, end_date):
    if not start_date or not end_date:
        raise ValidationError("Start date and end date are required.")

    # Get the household associated with the user
    household = user.households.first()
    if not household:
        raise ObjectDoesNotExist("User does not belong to any household.")

    # Retrieve or create the meal plan
    meal_plan = MealPlan.get_or_create_meal_plan(
        start_date=start_date,
        end_date=end_date,
        household=household
    )

    # Retrieve the meal plan recipes
    meal_plan_recipes = MealPlanRecipe.objects.filter(meal_plan=meal_plan)
    return meal_plan_recipes
