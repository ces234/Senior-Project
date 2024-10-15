from django.http import JsonResponse
from .models import Recipe, Category, Ingredient
from django.db.models import Q
from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from .serializers import IngredientSerializer



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

def get_recipe_by_id(request, recipe_id):
    recipe = get_object_or_404(Recipe, id = recipe_id)

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
        'categories': [category.name for category in recipe.categories.all()]
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
    

def get_recipe_categories(recipe_id):
    recipe = get_object_or_404(Recipe, id=recipe_id)  # Fetch the recipe or return a 404 if not found
    return recipe.categories.all()  # Return all categories related to this recipe


def recipe_categories_view(request, recipe_id):
    categories = get_recipe_categories(recipe_id)
    categories_list = [category.name for category in categories]  # Extract category names
    return JsonResponse({'categories': categories_list})
