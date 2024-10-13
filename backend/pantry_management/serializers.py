# pantry_management/serializers.py


from rest_framework import serializers

from recipe_management.models import Ingredient
from .models import PantryIngredient

class PantryIngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = PantryIngredient
        fields = ['pantry', 'ingredient', 'quantity', 'unit']  # 'ingredient' corresponds to ingredient_id

    def create(self, validated_data):
        # Here, you can handle any additional logic if necessary
        return super().create(validated_data)
    
# class PantryIngredientWithNameSerializer(serializers.ModelSerializer):
#     ingredient_name = serializers.SerializerMethodField()

#     class Meta:
#         model = PantryIngredient
#         fields = ['ingredient_name', 'quantity', 'unit']

#     def get_ingredient_name(self, obj):
#         # Retrieve the ingredient name using the ingredient ID
#         try:
#             ingredient = Ingredient.objects.get(id=obj.ingredient.id)  # Get the ingredient using its ID
#             return ingredient.name  # Return the name of the ingredient
#         except Ingredient.DoesNotExist:
#             return None  # Return None if the ingredient does not exist


class PantryIngredientWithNameSerializer(serializers.ModelSerializer):
    ingredient_name = serializers.SerializerMethodField()
    ingredient_id = serializers.IntegerField(source='ingredient.id', read_only=True)

    class Meta:
        model = PantryIngredient
        fields = ['ingredient_id', 'ingredient_name', 'quantity', 'unit']

    def get_ingredient_name(self, obj):
        # Retrieve the ingredient name using the ingredient ID
        return obj.ingredient.name if obj.ingredient else None
