# Generated by Django 5.1.1 on 2024-12-04 23:42

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pantry_management', '0003_initial'),
        ('recipe_management', '0006_reciperequest'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pantry',
            name='ingredients',
            field=models.ManyToManyField(blank=True, related_name='pantries', through='pantry_management.PantryIngredient', to='recipe_management.ingredient'),
        ),
        migrations.AlterField(
            model_name='pantryingredient',
            name='ingredient',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pantry_ingredients', to='recipe_management.ingredient'),
        ),
        migrations.AlterField(
            model_name='pantryingredient',
            name='pantry',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pantry_ingredients', to='pantry_management.pantry'),
        ),
        migrations.AlterField(
            model_name='pantryingredient',
            name='quantity',
            field=models.FloatField(),
        ),
    ]
