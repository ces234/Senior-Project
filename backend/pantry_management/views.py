# pantry_management/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Pantry, PantryIngredient
from user_management.models import Household
from recipe_management.models import Ingredient
from .serializers import PantryIngredientSerializer, PantryIngredientWithNameSerializer

@api_view(['POST'])
def add_pantry_item(request):
    # Get the user from the request
    user = request.user
    
    try:
        # Fetch the user's household
        household = Household.objects.get(admin=user)  # TODO: need to handle if user is not admin of household
        pantry = Pantry.objects.get(household=household)  # Get the pantry associated with the household

        # Get the ingredient name from the request data
        ingredient_name = request.data.get('name')

        # Retrieve the ingredient by name (assuming the name is unique)
        ingredient = Ingredient.objects.get(name=ingredient_name)

        # Prepare the data for the PantryIngredient
        ingredient_data = {
            'pantry': pantry.id,  
            'ingredient': ingredient.id,
            'quantity': request.data.get('quantity'),
            'unit': request.data.get('unit'),
            #TODO: need to edit PantryIngredient table to have expiration_date
        }

        # Serialize and save the pantry ingredient
        serializer = PantryIngredientSerializer(data=ingredient_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Household.DoesNotExist:
        return Response({'error': 'Household not found'}, status=status.HTTP_404_NOT_FOUND)
    except Pantry.DoesNotExist:
        return Response({'error': 'Pantry not found'}, status=status.HTTP_404_NOT_FOUND)
    except Ingredient.DoesNotExist:
        return Response({'error': 'Ingredient not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:  # Catch all for any unexpected errors
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_pantry_items(request):
    user = request.user
    
    try:
        # Fetch the user's household
        household = Household.objects.get(admin=user)  # TODO: only works if user is admin rn
        pantry = household.pantry  # Get the pantry associated with the household
        
        # Get all pantry ingredients for the user's pantry
        pantry_items = PantryIngredient.objects.filter(pantry=pantry)
        
        # Serialize the pantry ingredients with ingredient names
        serializer = PantryIngredientWithNameSerializer(pantry_items, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Household.DoesNotExist:
        return Response({'error': 'Household not found'}, status=status.HTTP_404_NOT_FOUND)
    except Pantry.DoesNotExist:
        return Response({'error': 'Pantry not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
def delete_pantry_item(request, item_id):
    try:
        # Get the user from the request
        user = request.user
        
        # Fetch the user's household
        household = Household.objects.get(admin=user)  # Assuming the user is an admin
        pantry = household.pantry  # Get the pantry associated with the household
        
        # Fetch the pantry ingredient to be deleted
        pantry_item = PantryIngredient.objects.get(ingredient_id=item_id, pantry=pantry)

        # Delete the pantry ingredient
        pantry_item.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)  # Return a 204 No Content response

    except Household.DoesNotExist:
        return Response({'error': 'Household not found'}, status=status.HTTP_404_NOT_FOUND)
    except PantryIngredient.DoesNotExist:
        return Response({'error': 'Pantry item not found'}, status=status.HTTP_404_NOT_FOUND)