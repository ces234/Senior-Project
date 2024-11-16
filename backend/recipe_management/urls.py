from django.urls import path
from . import views  # Import views from the current app

urlpatterns = [
    path('random-recipes/', views.random_recipes_view, name='random_recipes'),
    path('suggested-recipes/', views.suggested_recipes_view, name='suggested_recipes'),
    path('search/', views.search_recipes, name='search_recipes'),
    path('categories/', views.categories_view, name='get_categories'),
    path('recipe/<int:recipe_id>/', views.get_recipe_by_id, name='get_recipe_by_id'),
    path('ingredients/', views.get_all_ingredients, name='get_all_ingredients'),
    path('search-ingredient/', views.search_ingredient, name='search_ingredient'),
    path('<int:recipe_id>/categories/', views.recipe_categories_view, name='recipe-categories'),
    path('recipe/<int:recipe_id>/rate/', views.rate_recipe, name='rate_recipe'),
    path('request/<int:recipe_id>/', views.request_recipe_view, name='request_recipe'),
    path('requests/', views.allRequests, name='allRequests'),
    path('household_requests/', views.household_requests, name='household_requests'),  # Corrected line
    path('delete_request/<int:request_id>/', views.delete_recipe_request, name='delete_recipe_request'),
]
