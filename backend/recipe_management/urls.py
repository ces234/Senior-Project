from django.urls import path
from . import views  # Import views from the current app

urlpatterns = [
    path('random-recipes/', views.random_recipes_view, name='random_recipes'),
    path('search/', views.search_recipes, name='search_recipes'),
    path('categories/', views.categories_view, name = 'get_categories'),
    path('recipe/<int:recipe_id>/', views.get_recipe_by_id, name = 'get_recipe_by_id')
]
