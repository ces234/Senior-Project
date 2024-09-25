from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Household
from recipe_management.models import Recipe

@api_view(['POST'])
@login_required
def add_to_recently_added(request, recipe_id):
    # Get the user's household
    household = get_object_or_404(Household, members=request.user)

    # Get the recipe they want to add
    recipe = get_object_or_404(Recipe, id=recipe_id)

    # Add the recipe to the recently added list
    household.add_recently_added_recipe(recipe)

    return Response({"success": "Recipe added to recently added list"}, status=200)
