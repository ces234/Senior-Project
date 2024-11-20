from django.http import JsonResponse
from .models import Recipe, Category, Ingredient, RecipeRating, RecipeRequest
from pantry_management.models import Pantry
from user_management.models import Household
from django.db.models import Q
from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .serializers import IngredientSerializer, RecipeRatingSerializer, RecipeRequestSerializer
from django.db.models import Q
from django.contrib.auth.decorators import login_required
from user_management.utils import get_user_saved_recipes
from pantry_management.utils import get_user_pantry_items

def get_random_recipes(num_recipes=100):  # Allow fetching more than 16
    total_recipes = Recipe.objects.count()
    if total_recipes >= num_recipes:
        random_recipes = Recipe.objects.order_by('?')[:num_recipes]
    else:
        random_recipes = Recipe.objects.all()
    return random_recipes

def random_recipes_view(request):
    page_number = request.GET.get('page', 1)  # Get the current page number from the request (default is 1)
    random_recipes = get_random_recipes()

    # Use Django's Paginator to paginate the random recipes
    paginator = Paginator(random_recipes, 16)  # Show 16 recipes per page
    page_obj = paginator.get_page(page_number)

    # Serialize the recipe data
    recipes_list = [{
        'id': recipe.id,
        'name': recipe.name,
        'prep_time': recipe.prep_time,
        'cook_time': recipe.cook_time,
        'servings': recipe.servings,
    } for recipe in page_obj]

    return JsonResponse({
        'recipes': recipes_list,
        'current_page': page_obj.number,
        'total_pages': paginator.num_pages,
    })

# suggest recipes based on items in pantry
def get_suggested_recipes(pantry, num_recipes=100):

    pantry_ingredients = pantry.ingredients.all()

    # Get recipes that use those pantry ingredients
    pantry_recipes = Recipe.objects.filter(ingredients__in=pantry_ingredients).distinct()

    total_suggested = pantry_recipes.count()

    if total_suggested >= num_recipes:
        # Return a random subset of the suggested recipes
        suggested_recipes = pantry_recipes.order_by('?')[:num_recipes]
    else:
        # Fetch additional random recipes not already in the suggestions
        remaining_recipes = num_recipes - total_suggested
        suggested_recipes = list(pantry_recipes.order_by('?'))
        additional_recipes = Recipe.objects.exclude(id__in=[recipe.id for recipe in suggested_recipes]).order_by('?')[:remaining_recipes]
        suggested_recipes.extend(additional_recipes)
    
    return suggested_recipes

@api_view(['GET'])
def suggested_recipes_view(request):
    
    user = request.user

    if not user.is_authenticated:
        return JsonResponse({'error': 'You must be logged in to view suggested recipes'}, status=401)
    
    userHousehold = Household.objects.filter(
        Q(admin=user) | Q(members=user)
    ).first()

    pantry = Pantry.objects.get(household=userHousehold)

    page_number = request.GET.get('page', 1)
    
    # Fetch suggested recipes based on the pantry
    suggested_recipes = get_suggested_recipes(pantry)

    # Use Django's Paginator to paginate the recipes
    paginator = Paginator(suggested_recipes, 16)  # Show 16 recipes per page
    page_obj = paginator.get_page(page_number)

    recipes_list = [{
        'id': recipe.id,
        'name': recipe.name,
        'prep_time': recipe.prep_time,
        'cook_time': recipe.cook_time,
        'servings': recipe.servings,
    } for recipe in page_obj]

    print(calculate_recipe_points(recipes_list[0], user))

    return JsonResponse({
        'recipes': recipes_list,
        'current_page': page_obj.number,
        'total_pages': paginator.num_pages,
    })

def calculate_recipe_points(recipe, user):
    points = 0

    saved_recipes = get_user_saved_recipes(user)
    if recipe in saved_recipes:
        points += 100

    ingredient_points = 0

    pantry_list = get_user_pantry_items(user)

    for ingredient in recipe.ingredients:
        if ingredient in pantry_list:
            ingredient_points += 10
    
    # Add 10 points * the percentage of ingredients they have in the pantry
    points += 10 * (ingredient_points/recipe.ingredients.length)

    return points


def search_recipes(request):
    query = request.GET.get('q', '')
    category_ids = request.GET.getlist('categories', [])
    page = int(request.GET.get('page', 1))
    recipes_per_page = 16

    recipes = Recipe.objects.all()
    
    if query:
        recipes = recipes.filter(
            Q(name__icontains=query) | 
            Q(ingredients__name__icontains=query)
        )

    if category_ids:
        categories = Category.objects.filter(id__in=category_ids)
        recipes = recipes.filter(categories__in=categories)

    recipes = recipes.distinct()

    # Paginate the results
    paginator = Paginator(recipes, recipes_per_page)
    paginated_recipes = paginator.get_page(page)
    
    # Serialize the recipe data
    recipe_list = [{
        'id': recipe.id,
        'name': recipe.name,
        'prep_time': recipe.prep_time,
        'cook_time': recipe.cook_time,
        'servings': recipe.servings,
    } for recipe in paginated_recipes]

    return JsonResponse({
        'recipes': recipe_list,
        'total_pages': paginator.num_pages,  # Return the total number of pages
        'current_page': paginated_recipes.number,  # Return current page number for frontend use
    })


def categories_view(request):
    categories = Category.objects.all()
    categories_list = [{'id': cat.id, 'name': cat.name} for cat in categories]
    return JsonResponse(categories_list, safe = False)

@api_view(['GET'])
# @permission_classes([AllowAny])  # Allow access without requiring authentication
def get_recipe_by_id(request, recipe_id):
    recipe = get_object_or_404(Recipe, id=recipe_id)
    user = request.user

    if not user.is_authenticated:
        return JsonResponse({'error': 'You must be logged in to view recipe details'}, status=401)

    # Fetch user's household, if it exists
    user_household = Household.objects.filter(members=user).first()

    if not user_household:
        return JsonResponse({'error': 'User is not part of a household'}, status=400)

    # Fetch ratings only for members in the household
    ratings_data = [
        {
            'username': rating.user.username,
            'rating': rating.rating
        } for rating in RecipeRating.objects.filter(recipe=recipe, user__in=user_household.members.all())
    ]

    recipe_data = {
        'name': recipe.name,
        'prep_time': recipe.prep_time,
        'cook_time': recipe.cook_time,
        'servings': recipe.servings,
        'instructions': recipe.instructions,
        'ingredients': [
            {
                'name': ri.ingredient.name,
                'quantity': ri.quantity,
                'unit': ri.unit
            } for ri in recipe.recipeingredient_set.all()
        ],
        'categories': [category.name for category in recipe.categories.all()],
        'ratings': ratings_data
    }

    # Return the recipe data as a JSON response
    return JsonResponse(recipe_data)


@api_view(['GET'])
@permission_classes([AllowAny])  # Allow access without requiring authentication
def get_all_ingredients(request):
    try:
        ingredients = Ingredient.objects.all()

        ingredient_data = [{'id': ingredient.id, 'name': ingredient.name} for ingredient in ingredients]

        return Response(ingredient_data, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['GET'])
@permission_classes([AllowAny])  # Allow access without requiring authentication
def search_ingredient(request): 
    query = request.query_params.get('q', None)
    if query: 
        ingredients = Ingredient.objects.filter(Q(name__icontains=query))
        serializer = IngredientSerializer(ingredients, many = True)
        return Response(serializer.data)
    else:
        return Response({"message": "No query provided"}, status = 400)

@api_view(['GET'])
@permission_classes([AllowAny])  # Allow access without requiring authentication
def search_exact_ingredient(request): 
    query = request.query_params.get('q', None)
    if query:
        ingredients = Ingredient.objects.filter(Q(name__iexact=query))
        serializer = IngredientSerializer(ingredients, many = True)
        return Response(serializer.data)
    else:
        return Response({"message": "No query provided"}, status = 400)
    

def get_recipe_categories(recipe_id):
    recipe = get_object_or_404(Recipe, id=recipe_id)  # Fetch the recipe or return a 404 if not found
    return recipe.categories.all()  # Return all categories related to this recipe


def recipe_categories_view(request, recipe_id):
    categories = get_recipe_categories(recipe_id)
    categories_list = [category.name for category in categories]  # Extract category names
    return JsonResponse({'categories': categories_list})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def rate_recipe(request, recipe_id):
    user = request.user
    recipe = get_object_or_404(Recipe, id=recipe_id)

    rating_value = request.data.get("rating")

    # Check if the user has already rated the recipe
    rating_instance, created = RecipeRating.objects.get_or_create(recipe=recipe, user=user, defaults={'rating': rating_value})

    # Deserialize and validate data
    serializer = RecipeRatingSerializer(rating_instance, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save(user=user)  # Ensure the user is the request user
        return Response(serializer.data, status=status.HTTP_200_OK if not created else status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def allRequests(request):  # Add 'request' parameter
    requests = RecipeRequest.objects.all()  # Get all RecipeRequest instances
    serializer = RecipeRequestSerializer(requests, many=True)  # Serialize the data
    return Response(serializer.data)  # Return the serialized data in the response

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def request_recipe_view(request, recipe_id):
    user = request.user

    # Check that the user is a member and not an admin
    if user.status != 'member':
        return Response({"error": "Only household members can request recipes"}, status=status.HTTP_403_FORBIDDEN)

    # Fetch the household the user belongs to
    household = Household.objects.filter(members=user).first()
    if not household:
        return Response({"error": "User is not part of a household"}, status=status.HTTP_400_BAD_REQUEST)

    # Get the recipe requested
    recipe = get_object_or_404(Recipe, id=recipe_id)

    # Create and save the recipe request
    recipe_request, created = RecipeRequest.objects.get_or_create(
        recipe=recipe,
        user=user
    )

    if not created:
        return Response({"message": "This recipe has already been requested by this household"}, status=status.HTTP_200_OK)

    return Response({"message": "Recipe request successfully created"}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([AllowAny])  # Ensure only authenticated users can access this endpoint
def household_requests(request):
    user = request.user

    # Get the household to which the user belongs
    user_household = Household.objects.filter(members=user).first()
    if not user_household:
        return JsonResponse({'error': 'User is not part of a household'}, status=400)

    # Filter requests to only those made by members of the user's household
    household_requests = RecipeRequest.objects.filter(user__in=user_household.members.all())

    # Serialize the requests data
    serializer = RecipeRequestSerializer(household_requests, many=True)
    return JsonResponse(serializer.data, safe=False, status=200)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_recipe_request(request, request_id):
    """View to delete a recipe request by its ID"""
    # Get the recipe request object or return a 404 if not found
    recipe_request = get_object_or_404(RecipeRequest, id=request_id)

    # Ensure the user is authorized to delete the request (e.g., owner check)
    if recipe_request.user != request.user:
        return Response({'error': 'You do not have permission to delete this request.'}, status=status.HTTP_403_FORBIDDEN)

    # Delete the recipe request
    recipe_request.delete()

    return Response({'message': 'Recipe request deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
