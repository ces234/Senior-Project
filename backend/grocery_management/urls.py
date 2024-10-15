from django.urls import path
from . import views  # Import views from the current app

urlpatterns = [
    path('grocery-list/', views.get_grocery_list_by_user, name = 'get_grocery_list_by_user'),
    path('add-ingredient/', views.add_ingredient_to_grocery_list, name = "add_ingredient_to_grocery_list"),
    path('remove-ingredient/', views.remove_ingredient_from_grocery_list, name = "remove-ingredient"),
]
