# recipe_management/serializers.py
from rest_framework import serializers
from .models import Recipe, Ingredient, RecipeRating

class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = '__all__'  # Adjust this according to your model fields

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'name']

class RecipeRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeRating
        fields = ['recipe', 'user', 'rating']
        extra_kwargs = {'user': {'read_only': True}}  # User is set automatically from the request