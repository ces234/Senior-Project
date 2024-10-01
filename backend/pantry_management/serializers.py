# pantry_management/serializers.py

from rest_framework import serializers
from .models import PantryIngredient

class PantryIngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = PantryIngredient
        fields = ['ingredient', 'quantity', 'unit']
