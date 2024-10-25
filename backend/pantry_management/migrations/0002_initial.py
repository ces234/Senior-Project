# Generated by Django 4.1.13 on 2024-09-16 15:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('pantry_management', '0001_initial'),
        ('recipe_management', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='pantryingredient',
            name='ingredient',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='recipe_management.ingredient'),
        ),
        migrations.AddField(
            model_name='pantryingredient',
            name='pantry',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pantry_management.pantry'),
        ),
    ]
