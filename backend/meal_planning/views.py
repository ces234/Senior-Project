# views.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import MealPlan, MealPlanRecipe
from .serializers import MealPlanSerializer, MealPlanRecipeSerializer
from recipe_management.models import Recipe
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.exceptions import ValidationError
from .utils import get_meal_plan_recipes_utility


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_meal_plan(request):
    try:
        start_date = request.data.get("start_date")
        end_date = request.data.get("end_date")

        if not start_date or not end_date:
            return Response({"error": "Start date and end date are required."}, status=status.HTTP_400_BAD_REQUEST)

        household = request.user.households.first()

        if not household:
            return Response({"error": "User does not belong to any household."}, status=status.HTTP_400_BAD_REQUEST)
        
        meal_plan = MealPlan.get_or_create_meal_plan(start_date = start_date, end_date=end_date, household=household, admin = request.user)

        serializer = MealPlanSerializer(meal_plan)
        return Response(serializer.data, status=status.HTTP_200_OK if meal_plan.pk else status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


 
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_meal_plans(request):
    try:
        # Get all households the user is a member of
        households = request.user.households.all()  # Get all households the user belongs to

        if not households.exists():
            return Response({"error": "User does not belong to any households."}, status=status.HTTP_404_NOT_FOUND)

        # Get all meal plans for all households the user is a member of
        meal_plans = MealPlan.objects.filter(household__in=households)  # This will fetch meal plans for the user's households
        
        # Serialize meal plans along with recipes using nested serializers
        serializer = MealPlanSerializer(meal_plans, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_recipe_to_meal(request, meal_plan_id):
    try:
        meal_plan = MealPlan.objects.get(id=meal_plan_id)

        
        recipe_id = request.data.get('recipe_id')
        day = request.data.get('day')
        meal_type = request.data.get('meal_type')

        if not recipe_id or not day or not meal_type:
            return Response({"error": "Recipe ID, day, and meal type are required."}, status=status.HTTP_400_BAD_REQUEST)
        
        recipe = Recipe.objects.get(id = recipe_id)

        meal_plan_recipe, created = MealPlanRecipe.objects.get_or_create(
            meal_plan = meal_plan, 
            recipe = recipe,
            day = day, 
            meal_type = meal_type
        )

        if created:
            return Response({"message": "Recipe added to meal plan successfully."}, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": "Recipe already exists for this meal."}, status=status.HTTP_200_OK)
        
    except MealPlan.DoesNotExist:
        return Response({"error": "Meal plan does not exist."}, status=status.HTTP_404_NOT_FOUND)
    except Recipe.DoesNotExist:
        return Response({"error": "Recipe does not exist."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_meal_plan_recipes(request):
    try:
        # Get the start and end dates from the query parameters
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')

        # Use the utility function to get the meal plan recipes
        meal_plan_recipes = get_meal_plan_recipes_utility(request.user, start_date, end_date)

        # Serialize the meal plan recipes
        serializer = MealPlanRecipeSerializer(meal_plan_recipes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except ValidationError as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except ObjectDoesNotExist as e:
        return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_grocery_list(request):
    try:
        # Retrieve the meal plan ID from the POST request body
        meal_plan_id = request.data.get('meal_plan_id')

        if not meal_plan_id:
            return Response({"error": "Meal plan ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch the meal plan based on the ID
        meal_plan = MealPlan.objects.get(id=meal_plan_id)
        
        # Generate the grocery list
        grocery_list = meal_plan.generate_grocery_list()

        # Prepare the response with the ingredients
        ingredients = [ingredient.name for ingredient in grocery_list.ingredients.all()]

        return Response({"grocery_list": ingredients}, status=status.HTTP_201_CREATED)

    except MealPlan.DoesNotExist:
        return Response({"error": "Meal plan does not exist."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['DELETE'])  # Use DELETE method for removing items
@permission_classes([IsAuthenticated])
def remove_recipe_from_meal(request, meal_plan_id, recipe_id):
    day = request.data.get('day')
    meal_type = request.data.get('meal_type')
    
    print(f"Attempting to remove recipe {recipe_id} from meal plan {meal_plan_id} on {day} for {meal_type}")
    
    try:
        # Get the meal plan
        meal_plan = MealPlan.objects.get(id=meal_plan_id)
        print(f"Meal plan found: {meal_plan}")

        # Find the recipe in the meal plan for the specified day and meal type
        meal_plan_recipe = MealPlanRecipe.objects.get(
            meal_plan=meal_plan,
            recipe_id=recipe_id,
            day=day,
            meal_type=meal_type
        )
        print(f"Recipe found in meal plan: {meal_plan_recipe}")

        # Delete the recipe from the meal plan
        meal_plan_recipe.delete()
        print("Recipe deleted successfully.")

        return Response({"message": "Recipe removed from meal plan successfully."}, status=status.HTTP_200_OK)

    except MealPlan.DoesNotExist:
        print("Meal plan does not exist.")
        return Response({"error": "Meal plan does not exist."}, status=status.HTTP_404_NOT_FOUND)
    except MealPlanRecipe.DoesNotExist:
        print("Recipe is not associated with this meal plan for the specified day and meal type.")
        return Response({"error": "Recipe is not associated with this meal plan for the specified day and meal type."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Unexpected error: {e}")
        return Response({"error": "An unexpected error occurred."}, status=status.HTTP_400_BAD_REQUEST)

