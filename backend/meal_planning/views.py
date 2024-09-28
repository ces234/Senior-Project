# views.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import MealPlan, MealPlanRecipe
from .serializers import MealPlanSerializer
import datetime
from recipe_management.models import Recipe


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_meal_plan(request):
    try:
        start_date = request.data.get('startDate')
        end_date = request.data.get('endDate')
        
        if not start_date or not end_date: 
            return Response({"error": "Start date and end date are required."}, status=status.HTTP_400_BAD_REQUEST)
        
        household = request.user.households.first()  # Get the first household the user is a member of

        if not household: 
            return Response({"error": "User does not belong to any household."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if a meal plan with the given start and end date already exists for the user's household
        existing_meal_plan = MealPlan.objects.filter(
            household=household,
            start_date=start_date,
            end_date=end_date
        ).exists()

        if existing_meal_plan:
            return Response({"error": "A meal plan with the same start and end dates already exists."}, status=status.HTTP_400_BAD_REQUEST)

        # Create a new meal plan
        meal_plan = MealPlan.objects.create(
            admin=request.user,
            start_date=start_date,
            end_date=end_date, 
            household=household
        )

        serializer = MealPlanSerializer(meal_plan)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
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

        if request.user != meal_plan.admin:
            return Response({"error": "You do not have permission to modify this meal plan."}, status = status.HTTP_403_FORBIDDEN)
        
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