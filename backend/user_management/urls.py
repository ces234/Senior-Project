# userManagement/urls.py
from django.urls import path
from .views import UserListView, HouseholdListView
from .views import LoginView


urlpatterns = [
    path('users/', UserListView.as_view(), name='user-list'),
    path('households/', HouseholdListView.as_view(), name='household-list'),
    path('login/', LoginView.as_view(), name='login'),


]
