from rest_framework.exceptions import NotFound
from .models import GroceryList

def get_grocery_list(user):
    household = user.households.first()

    if not household:
        raise NotFound(detail="No household found for this user.")
    
    grocery_list = GroceryList.objects.filter(household=household).first()
    if not grocery_list:
        raise NotFound(detail="No grocery list found for this household.")
    
    ingredients = grocery_list.ingredients.all()
    ingredients_data = [{'id': ingredient.id, 'name': ingredient.name} for ingredient in ingredients]

    return {
        'id': grocery_list.id,
        'household': household.id,
        'ingredients': ingredients_data
    }
