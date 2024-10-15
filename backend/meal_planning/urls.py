# urls.py
from django.urls import path
from .views import *

urlpatterns = [
    path('create-meal-plan/', create_meal_plan, name='create_meal_plan'),
    path('view-meal-plans/', view_meal_plans, name='view_meal_plans'),
    path('add-recipe/<int:meal_plan_id>/', add_recipe_to_meal, name='add-recipe-to-meal'),
    path('get-meal-plan-recipes', get_meal_plan_recipes, name = 'get_meal_plan_recipes'),
    path('generate-grocery-list/', generate_grocery_list, name = 'generate_grocery_list'),
    path('<int:meal_plan_id>/remove-recipe/<int:recipe_id>/', remove_recipe_from_meal, name='remove-recipe-from-meal'),

]
