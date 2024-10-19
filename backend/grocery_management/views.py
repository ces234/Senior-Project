from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import GroceryList
from rest_framework import status
from django.shortcuts import get_object_or_404
from recipe_management.models import Ingredient


# Create your views here.
@api_view(['GET'])
def get_grocery_list_by_user(request):
    household = request.user.households.first()  

    if not household:
        return Response({"error": "No household found for this user."})
    
    grocery_list = GroceryList.objects.filter(household=household).first()
    if not grocery_list:
        return Response({"error": "No grocery list found for this household"})
    
    ingredients = grocery_list.ingredients.all()
    ingredients_data = [{'id': ingredient.id, 'name': ingredient.name} for ingredient in ingredients]

    grocery_list_data = {
        'id': grocery_list.id,
        'household': household.id,
        'ingredients': ingredients_data
    }

    return Response(grocery_list_data, status = status.HTTP_200_OK)


@api_view(['POST'])
def add_ingredient_to_grocery_list(request):
    household = request.user.households.first()

    if not household:
        return Response({"error": "No household found for this user."})
    
    grocery_list = GroceryList.objects.filter(household=household).first()
    if not grocery_list:
        return Response({"error": "No grocery list found for this household."})
    
    ingredient_id = request.data.get('ingredient_id')
    ingredient = get_object_or_404(Ingredient, id = ingredient_id)

    grocery_list.add_ingredient(ingredient)

    return Response({"message": "Ingredient added successfull!"}, status = status.HTTP_201_CREATED)

@api_view(['POST'])  # You could also use DELETE method if needed
def remove_ingredient_from_grocery_list(request):
    household = request.user.households.first()

    if not household:
        return Response({"error": "No household found for this user."})
    
    grocery_list = GroceryList.objects.filter(household=household).first()
    if not grocery_list:
        return Response({"error": "No grocery list found for this household."})
    
    ingredient_id = request.data.get('ingredient_id')
    ingredient = get_object_or_404(Ingredient, id=ingredient_id)

    grocery_list.remove_ingredient(ingredient)

    return Response({"message": "Ingredient removed successfully!"}, status=status.HTTP_200_OK)