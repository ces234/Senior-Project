from django.urls import path
from . import views  # Import views from the current app

urlpatterns = [
    path('household/add_to_recent/<int:recipe_id>/', views.add_to_recently_added, name='add_to_recently_added'),

]
