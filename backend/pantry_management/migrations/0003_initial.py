# Generated by Django 4.1.13 on 2024-09-16 15:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('pantry_management', '0002_initial'),
        ('user_management', '0001_initial'),
        ('recipe_management', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='pantry',
            name='household',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='pantry', to='user_management.household'),
        ),
        migrations.AddField(
            model_name='pantry',
            name='ingredients',
            field=models.ManyToManyField(through='pantry_management.PantryIngredient', to='recipe_management.ingredient'),
        ),
        migrations.AlterUniqueTogether(
            name='pantryingredient',
            unique_together={('pantry', 'ingredient')},
        ),
    ]
