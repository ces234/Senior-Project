from django.http import JsonResponse
from .models import Recipe, Ingredient
from django.db.models import Q
from django.shortcuts import render

def get_random_recipes():
    total_recipes = Recipe.objects.count()
    if total_recipes >= 16:
        random_recipes = Recipe.objects.order_by('?')[:16]
    else:
        random_recipes = Recipe.objects.all()

    return random_recipes

def random_recipes_view(request):
    random_recipes = get_random_recipes()
    recipes_list = [{
        'name': recipe.name,
        'prep_time': recipe.prep_time,
        'cook_time': recipe.cook_time,
        'servings': recipe.servings,
    } for recipe in random_recipes]
    return JsonResponse(recipes_list, safe=False)

def search_recipes(request):
    query = request.GET.get('q')

    if query:
        recipes = Recipe.objects.filter(
            Q(name__icontains=query) |
            Q(ingredients__name__icontains=query)
        ).distinct()
    
        recipeList = []
        for recipe in recipes: 
            recipeList.append ({
                'name': recipe.name,
                'prep_time': recipe.prep_time,
                'cook_time': recipe.cook_time,
                'servings': recipe.servings,
            })

        return JsonResponse({'recipes': recipeList})
    
    return JsonResponse({'recipes': []})