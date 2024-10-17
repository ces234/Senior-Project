# userManagement/urls.py
from django.urls import path
from .views import UserListView, HouseholdListView
from .views import LoginView
from .views import recently_added_recipes
from .views import add_recently_added_recipe
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import signup
from .views import *



urlpatterns = [
    path('users/', UserListView.as_view(), name='user-list'),
    path('households/', HouseholdListView.as_view(), name='household-list'),
    path('login/', LoginView.as_view(), name='login'),
    path('recently-added-recipes/', recently_added_recipes, name='recently_added_recipes'),
    path('add-recently-added-recipe/', add_recently_added_recipe, name='add_recently_added_recipe'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # JWT token view
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # JWT token refresh view
    path('signup/', signup, name = "signup"),
    path('saved-recipes/', get_saved_recipes, name = 'get_saved_recipes'),
    path('saved-recipes/add/', add_saved_recipe, name = 'add_saved_recipes'),
    path('saved_recipes/remove/<int:recipe_id>/', remove_saved_recipe, name = 'remove_saved_recipes'),
]
