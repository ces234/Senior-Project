from django.urls import path
from . import views  # Import views from the current app


urlpatterns = [
    path('add_pantry_item/', views.add_pantry_item, name='add_pantry_item'),
]
