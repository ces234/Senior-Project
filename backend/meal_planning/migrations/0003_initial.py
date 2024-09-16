# Generated by Django 4.1.13 on 2024-09-16 15:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('meal_planning', '0002_initial'),
        ('user_management', '0001_initial'),
        ('recipe_management', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='mealplan',
            name='admin',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='user_management.user'),
        ),
        migrations.AddField(
            model_name='mealplan',
            name='household',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='meal_plans', to='user_management.household'),
        ),
        migrations.AddField(
            model_name='mealplan',
            name='recipes',
            field=models.ManyToManyField(through='meal_planning.MealPlanRecipe', to='recipe_management.recipe'),
        ),
        migrations.AlterUniqueTogether(
            name='mealplanrecipe',
            unique_together={('meal_plan', 'recipe', 'day')},
        ),
    ]
