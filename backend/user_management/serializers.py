from rest_framework import serializers
from .models import User, Household
from django.contrib.auth.password_validation import validate_password


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'status', 'preferences']  # Specify fields explicitly


class HouseholdSerializer(serializers.ModelSerializer):
    class Meta:
        model = Household
        fields = '__all__'  # Or specify fields explicitly

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    household_option = serializers.ChoiceField(choices=[('new', 'Start a new household'), ('existing', 'Join an existing household')], write_only=True)
    existing_household_id = serializers.IntegerField(write_only=True, required=False)  # For joining an existing household

    class Meta:
        model = User
        fields = ['username', 'password', 'status', 'household_option', 'existing_household_id']

    def create(self, validated_data):
        # Create the user with the validated data
        password = validated_data.pop('password')
        household_option = validated_data.pop('household_option')
        existing_household_id = validated_data.pop('existing_household_id', None)

        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()

        # Handle household assignment
        if household_option == 'new':
            # Create a new household with the user as the admin
            household = Household.objects.create(admin=user)
            household.members.add(user)
        elif household_option == 'existing' and existing_household_id:
            # Add the user to the existing household
            try:
                household = Household.objects.get(id=existing_household_id)
                household.members.add(user)
            except Household.DoesNotExist:
                raise serializers.ValidationError("The specified household does not exist.")
        
        return user
