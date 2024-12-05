from django.urls import path
from . import views  # Import views from the current app


urlpatterns = [
    path('add_pantry_item/', views.add_pantry_item2, name='add_pantry_item'),
    path('items/', views.get_pantry_items, name='get_pantry_items'),
    path('delete_pantry_item/<int:item_id>/', views.delete_pantry_item, name='delete_pantry_item'),
    path('edit_pantry_item/<int:item_id>/', views.edit_pantry_item, name='edit_pantry_item'),
]
