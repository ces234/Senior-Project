from rest_framework import serializers
from .models import User, Household

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'status', 'preferences']  # Specify fields explicitly


class HouseholdSerializer(serializers.ModelSerializer):
    class Meta:
        model = Household
        fields = '__all__'  # Or specify fields explicitly
