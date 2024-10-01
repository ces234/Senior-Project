from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Pantry, PantryIngredient
from recipe_management.models import Ingredient
from .serializers import PantryIngredientSerializer

@api_view(['POST'])
def add_pantry_item(request):
    # Ensure that the user has a household
    if not request.user.is_authenticated or not hasattr(request.user, 'household'):
        return Response({'error': 'User does not have an associated household.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Fetch the pantry by household
        pantry = Pantry.objects.get(household=request.user.household)

        # Add pantry info to the incoming data
        data = request.data
        data['pantry'] = pantry.id  # Add pantry ID to the data for the serializer

        # Use the serializer for validation and creation
        serializer = PantryIngredientSerializer(data=data)
        
        if serializer.is_valid():
            serializer.save()  # This will create the PantryIngredient instance
            return Response({'message': 'Pantry item added successfully!'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Pantry.DoesNotExist:
        return Response({'error': 'Pantry does not exist for this household.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
