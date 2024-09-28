from rest_framework import serializers
from .models import MealPlan, MealPlanRecipe
from recipe_management.serializers import RecipeSerializer  # Assuming RecipeSerializer exists in recipe_management app


class MealPlanRecipeSerializer(serializers.ModelSerializer):
    # Use RecipeSerializer to include detailed recipe information
    recipe = RecipeSerializer()  # Nested serializer to return detailed recipe info

    class Meta:
        model = MealPlanRecipe
        fields = ['meal_plan', 'recipe', 'day', 'meal_type']


class MealPlanSerializer(serializers.ModelSerializer):
    # Nested serializer for MealPlanRecipe, which includes detailed recipe info
    mealplanrecipe_set = MealPlanRecipeSerializer(many=True)

    class Meta:
        model = MealPlan
        fields = ['id', 'start_date', 'end_date', 'mealplanrecipe_set']  # Include necessary fields for creation

    def create(self, validated_data):
        mealplan_recipes_data = validated_data.pop('mealplanrecipe_set')
        meal_plan = MealPlan.objects.create(**validated_data)

        # Create MealPlanRecipe objects
        for mealplan_recipe_data in mealplan_recipes_data:
            MealPlanRecipe.objects.create(meal_plan=meal_plan, **mealplan_recipe_data)

        return meal_plan
