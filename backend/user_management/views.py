from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST
from pantry_management.models import Pantry
from user_management.models import Household  # Adjust based on your actual model locations
from recipe_management.models import Recipe
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializers import UserRegistrationSerializer
from django.contrib.auth.hashers import make_password
from django.db import transaction  # Import transaction for atomic operations
from grocery_management.models import GroceryList
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny
from user_management.utils import get_user_saved_recipes


# userManagement/views.py
from rest_framework import generics
from .models import User, Household
from .serializers import UserSerializer, HouseholdSerializer

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # Allow access to everyone


class HouseholdListView(generics.ListAPIView):
    queryset = Household.objects.all()
    serializer_class = HouseholdSerializer
    permission_classes = [AllowAny]  # Allow access to everyone



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
            household = request.user.households.first()
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


@api_view(["POST"])
def add_recently_added_recipe(request):
    recipe_id = request.data.get('recipe_id')
    try:
        user = request.user
        household = request.user.households.first()
        recipe = Recipe.objects.get(id=recipe_id)
        household.addRecentlyAddedRecipe(recipe)
        return Response({'message': 'Recipe added to recently added successfully.'}, status=201)
    except Recipe.DoesNotExist:
        return Response({'error': 'Recipe not found.'}, status=403)
    except User.DoesNotExist:
        return Response({'error:' 'User not found'}, status = 404)
    except Household.DoesNotExist:
        return Response({'error': 'Household not found.'}, status=402)

    

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    username = request.data.get('username')
    password = request.data.get('password')
    household_option = request.data.get('householdOption')
    join_code = request.data.get('joinCode')


    if not all([username, password, household_option]):
        return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        with transaction.atomic():

            if household_option == 'new':
                user = User.objects.create(username=username, password = make_password(password), status = "admin")
                household = Household.objects.create(admin=user)
                user.households.add(household)
                GroceryList.objects.create(household=household)  # Creating the grocery list

                print(f"Created grocery list for household ID: {household.id}")  # Debugging statement

                pantry = Pantry.objects.create(household=household)

            elif household_option == 'existing' and join_code:
                user = User.objects.create(username=username, password = make_password(password), status = "member")
                # Attempt to find an existing household with the provided join code
                household = get_object_or_404(Household, join_code=join_code)
                household.members.add(user)  # Add user to the existing household
            else:
                return Response({'error': 'Invalid household option or missing join code.'}, status=status.HTTP_400_BAD_REQUEST)

                
            user_data = UserSerializer(user).data
            return Response({'message': 'User created successfully', 'user': user_data}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_saved_recipes(request):
    print("get_sasved_recipes called")
    user = request.user
    serialized_recipes = get_user_saved_recipes(user)
    return Response(serialized_recipes, status=200)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_join_code(request):
    user = request.user
    household = request.user.households.first()
    joinCode = household.join_code
    return Response({'join_code': joinCode}, status=status.HTTP_200_OK)



# Add a recipe to favorites
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_saved_recipe(request):
    user = request.user
    recipe_id = request.data.get('recipe_id')
    
    if not recipe_id:
        return Response({'error': 'Recipe ID is required'}, status=400)

    recipe = get_object_or_404(Recipe, id=recipe_id)
    user.saved_recipes.add(recipe)
    
    return Response({'message': f'{recipe.name} added to favorites'}, status=201)

# Remove a recipe from favorites
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def remove_saved_recipe(request, recipe_id):
    user = request.user
    recipe = get_object_or_404(Recipe, id=recipe_id)
    user.saved_recipes.remove(recipe)
    
    return Response({'message': f'{recipe.name} removed from favorites'}, status=200)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_household_members(request):
    """
    Returns all members of the household the requesting user belongs to.
    """
    try:
        user = request.user
        # Assuming the User model has a relationship to Household via `households`
        household = user.households.first()

        if not household:
            return Response({"error": "User is not part of any household"}, status=404)

        # Get all members of the household
        members = household.members.all()  # Assuming Household has a `members` relationship
        serialized_members = UserSerializer(members, many=True).data

        return Response(serialized_members, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_recently_added_recipe(request, recipe_id):
    """
    Deletes a recipe from the user's household's recently added list.
    """
    try:
        user = request.user
        household = user.households.first()

        if not household:
            return Response({'error': 'No household found for this user.'}, status=404)

        recipe = get_object_or_404(Recipe, id=recipe_id)

        # Assuming `recently_added` is a ManyToManyField or similar relationship
        if recipe in household.recently_added.all():
            household.recently_added.remove(recipe)
            return Response({'message': f'Recipe {recipe.name} removed from recently added.'}, status=200)
        else:
            return Response({'error': 'Recipe not found in recently added list.'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=400)
