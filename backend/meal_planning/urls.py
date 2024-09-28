# urls.py
from django.urls import path
from .views import *

urlpatterns = [
    path('create-meal-plan/', create_meal_plan, name='create_meal_plan'),
    path('view-meal-plans/', view_meal_plans, name='view_meal_plans'),
    path('add-recipe/<int:meal_plan_id>/', add_recipe_to_meal, name='add-recipe-to-meal'),

]
