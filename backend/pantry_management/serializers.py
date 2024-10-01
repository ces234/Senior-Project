# pantry_management/serializers.py


from rest_framework import serializers
from .models import PantryIngredient

class PantryIngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = PantryIngredient
        fields = ['pantry', 'ingredient', 'quantity', 'unit']  # Include the 'pantry' field

    def create(self, validated_data):
        # Here, you can handle any additional logic if necessary
        return super().create(validated_data)
