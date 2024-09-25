from django.http import JsonResponse
from django.views.decorators.http import require_POST
from user_management.models import Household  # Adjust based on your actual model locations
from recipe_management.models import Recipe


# userManagement/views.py
from rest_framework import generics
from .models import User, Household
from .serializers import UserSerializer, HouseholdSerializer

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class HouseholdListView(generics.ListAPIView):
    queryset = Household.objects.all()
    serializer_class = HouseholdSerializer


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny
from .serializers import UserSerializer  # Make sure to create a serializer for your User model

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            user_data = UserSerializer(user).data  # Serialize user data
            return Response({'token': token.key, 'user': user_data}, status=status.HTTP_200_OK)
        
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)
