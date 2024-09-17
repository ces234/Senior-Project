from django.urls import path
from . import views  # Import views from the current app

urlpatterns = [
    path('random-recipes/', views.random_recipes_view, name='random_recipes'),
]
