from user_management.models import Household
from pantry_management.models import Pantry, Ingredient, PantryIngredient
from pantry_management.serializers import PantryIngredientSerializer, PantryIngredientWithNameSerializer
from rest_framework.exceptions import NotFound, ValidationError
from django.db.models import Q

def add_pantry_item_to_user(user, ingredient_name, quantity, unit):
    # Fetch the user's household
    household = Household.objects.filter(Q(admin=user) | Q(members=user)).first()
    if not household:
        raise NotFound("Household not found.")
    
    # Get the pantry associated with the household
    try:
        pantry = Pantry.objects.get(household=household)
    except Pantry.DoesNotExist:
        raise NotFound("Pantry not found.")

    # Retrieve the ingredient by name
    try:
        ingredient = Ingredient.objects.get(name=ingredient_name)
    except Ingredient.DoesNotExist:
        raise NotFound("Ingredient not found.")

    # Prepare data for PantryIngredient
    ingredient_data = {
        'pantry': pantry.id,
        'ingredient': ingredient.id,
        'quantity': quantity,
        'unit': unit,
    }

    # Serialize and save the pantry ingredient
    serializer = PantryIngredientSerializer(data=ingredient_data)
    if serializer.is_valid():
        serializer.save()
        return serializer.data
    else:
        raise ValidationError(serializer.errors)

def get_user_pantry_items(user):
    # Fetch the user's household
    household = Household.objects.filter(Q(admin=user) | Q(members=user)).first()
    if not household:
        raise NotFound("Household not found.")
    
    # Get the pantry associated with the household
    try:
        pantry = household.pantry
    except Pantry.DoesNotExist:
        raise NotFound("Pantry not found.")
    
    # Get all pantry ingredients for the user's pantry
    pantry_items = PantryIngredient.objects.filter(pantry=pantry)
    
    # Serialize the pantry ingredients with ingredient names
    serializer = PantryIngredientWithNameSerializer(pantry_items, many=True)
    return serializer.data