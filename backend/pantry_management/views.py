# pantry_management/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Pantry, PantryIngredient
from user_management.models import Household
from recipe_management.models import Ingredient  # Import your Ingredient model
from .serializers import PantryIngredientSerializer  # Ensure you have a serializer for PantryIngredient

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
