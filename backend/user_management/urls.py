# userManagement/urls.py
from django.urls import path
from .views import UserListView, HouseholdListView
from .views import LoginView
from .views import recently_added_recipes
from .views import add_recently_added_recipe
from .views import signup




urlpatterns = [
    path('users/', UserListView.as_view(), name='user-list'),
    path('households/', HouseholdListView.as_view(), name='household-list'),
    path('login/', LoginView.as_view(), name='login'),
    path('recently-added-recipes/', recently_added_recipes, name='recently_added_recipes'),
    path('add-recently-added-recipe/', add_recently_added_recipe, name='add_recently_added_recipe'),
    path('signup/', signup, name = "signup"),
]
