from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST
from user_management.models import Household  # Adjust based on your actual model locations
from recipe_management.models import Recipe
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated



# userManagement/views.py
from rest_framework import generics
from .models import User, Household
from .serializers import UserSerializer, HouseholdSerializer

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class HouseholdListView(generics.ListAPIView):
    queryset = Household.objects.all()
    serializer_class = HouseholdSerializer


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny
from .serializers import UserSerializer  # Make sure to create a serializer for your User model

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            user_data = UserSerializer(user).data  # Serialize user data
            return Response({'token': token.key, 'user': user_data}, status=status.HTTP_200_OK)
        
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(["GET"])
def recently_added_recipes(request):
    if request.user.is_authenticated:
        try:
            household = request.user.household
            recipes = household.recently_added.all()
            # Serialize the recipes here (make sure to have a serializer)
            serialized_recipes = [{
                'id': recipe.id,
                'name': recipe.name,
                'prep_time': recipe.prep_time,
                'cook_time': recipe.cook_time,
                'servings': recipe.servings,
            } for recipe in recipes]  # Adjust according to your Recipe model
            return JsonResponse(serialized_recipes, safe = False)
        except Household.DoesNotExist:
            return Response([])
    return Response([])


@permission_classes([IsAuthenticated])  # Ensure user is authenticated
@api_view(["POST"])
def add_recently_added_recipe(request):
    recipe_id = request.data.get('recipe_id')
    try:
        household = request.user.household
        recipe = Recipe.objects.get(id=recipe_id)
        household.addRecentlyAddedRecipe(recipe)
        return Response({'message': 'Recipe added to recently added successfully.'}, status=201)
    except Recipe.DoesNotExist:
        return Response({'error': 'Recipe not found.'}, status=404)
    except Household.DoesNotExist:
        return Response({'error': 'Household not found.'}, status=404)

    