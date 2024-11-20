# pantry_management/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Pantry, PantryIngredient
from user_management.models import Household
from recipe_management.models import Ingredient
from .serializers import PantryIngredientSerializer, PantryIngredientWithNameSerializer
from django.db.models import Q
from rest_framework import status
from pantry_management.utils import add_pantry_item_to_user, get_user_pantry_items
from rest_framework.exceptions import NotFound, ValidationError

@api_view(['POST'])
def add_pantry_item(request):
    user = request.user
    ingredient_name = request.data.get('name')
    quantity = request.data.get('quantity')
    unit = request.data.get('unit')

    try:
        pantry_item_data = add_pantry_item_to_user(user, ingredient_name, quantity, unit)
        return Response(pantry_item_data, status=status.HTTP_201_CREATED)
    except NotFound as e:
        return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
    except ValidationError as e:
        return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:  # Catch-all for unexpected errors
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_pantry_items(request):
    user = request.user

    try:
        pantry_items = get_user_pantry_items(user)
        return Response(pantry_items, status=status.HTTP_200_OK)
    except NotFound as e:
        return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:  # Catch-all for unexpected errors
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
def delete_pantry_item(request, item_id):
    try:
        # Get the user from the request
        user = request.user
        
        # Fetch the user's household
        household = Household.objects.filter(
            Q(admin=user) | Q(members=user)
        ).first()

        pantry = household.pantry  # Get the pantry associated with the household
        
        # Fetch the pantry ingredient to be deleted
        pantry_item = PantryIngredient.objects.get(ingredient_id=item_id, pantry=pantry)

        # Delete the pantry ingredient
        pantry_item.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)

    except Household.DoesNotExist:
        return Response({'error': 'Household not found'}, status=status.HTTP_404_NOT_FOUND)
    except PantryIngredient.DoesNotExist:
        return Response({'error': 'Pantry item not found'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['PUT'])
def edit_pantry_item(request, item_id):
    user = request.user

    try:
        # Fetch the user's household
        household = Household.objects.filter(
            Q(admin=user) | Q(members=user)
        ).first()

        pantry = Pantry.objects.get(household=household)  # Get the pantry associated with the household

        # Retrieve the PantryIngredient instance to update
        pantry_item = PantryIngredient.objects.get(ingredient=item_id, pantry=pantry.id)

        print(pantry_item)

        # Ensure the pantry item belongs to the user's household
        if pantry_item.pantry != pantry:
            return Response({'error': 'Pantry item does not belong to your pantry'}, status=status.HTTP_403_FORBIDDEN)

        # Get the ingredient name from the request data
        ingredient_name = request.data.get('name')

        # Retrieve the ingredient by name (assuming the name is unique)
        ingredient = Ingredient.objects.get(name=ingredient_name)

        # Prepare the updated data for the PantryIngredient
        pantry_item.ingredient = ingredient
        pantry_item.quantity = request.data.get('quantity')
        pantry_item.unit = request.data.get('unit')

        # Serialize and save the updated pantry ingredient
        serializer = PantryIngredientSerializer(pantry_item, data=request.data, partial=True)  # partial=True allows partial updates
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Household.DoesNotExist:
        return Response({'error': 'Household not found'}, status=status.HTTP_404_NOT_FOUND)
    except Pantry.DoesNotExist:
        return Response({'error': 'Pantry not found'}, status=status.HTTP_404_NOT_FOUND)
    except Ingredient.DoesNotExist:
        return Response({'error': 'Ingredient not found'}, status=status.HTTP_404_NOT_FOUND)
    except PantryIngredient.DoesNotExist:
        return Response({'error': 'Pantry item not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:  # Catch all for any unexpected errors
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
