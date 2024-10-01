from django.http import JsonResponse
from .models import Recipe, Category
from django.db.models import Q
from django.core.paginator import Paginator



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