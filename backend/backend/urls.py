"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    
    path('admin/', admin.site.urls),
    path('recipes/', include('recipe_management.urls')),  # Include recipe_management URLs
    path('user/', include('user_management.urls')),  # Ensure your API paths are included
    path('meal-plan/', include('meal_planning.urls')),  # Ensure your API paths are included
    path('pantry/', include('pantry_management.urls')),  # Include your app's URLs
    path('grocery/', include('grocery_management.urls'))
]

