from django.http import JsonResponse
from .models import Recipe, Category
from django.db.models import Q


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
        'id': recipe.id,
        'name': recipe.name,
        'prep_time': recipe.prep_time,
        'cook_time': recipe.cook_time,
        'servings': recipe.servings,
    } for recipe in random_recipes]
    return JsonResponse(recipes_list, safe=False)

def search_recipes(request):
    query = request.GET.get('q', '')
    categoryIds = request.GET.getlist('categories', [])

    recipes = Recipe.objects.all()
    
    if query:
        # Search recipes by name or ingredients
        recipes = Recipe.objects.filter(
            Q(name__icontains=query) | 
            Q(ingredients__name__icontains=query)
        )

        if categoryIds:
            categories = Category.objects.filter(id__in=categoryIds)
            recipes = recipes.filter(categories__in=categories)

        recipes = recipes.distinct()
        
        # Serialize the recipe data
        recipe_list = []
        for recipe in recipes:
            recipe_list.append({
                'name': recipe.name,
                'prep_time': recipe.prep_time,
                'cook_time': recipe.cook_time,
                'servings': recipe.servings,
            })

        return JsonResponse({'recipes': recipe_list})
    
    # If no query, return empty result
    return JsonResponse({'recipes': []})


def categories_view(request):
    categories = Category.objects.all()
    categories_list = [{'id': cat.id, 'name': cat.name} for cat in categories]
    return JsonResponse(categories_list, safe = False)