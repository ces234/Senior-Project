# Generated by Django 5.1.2 on 2024-11-21 21:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_management', '0005_household_join_code'),
    ]

    operations = [
        migrations.AlterField(
            model_name='household',
            name='join_code',
            field=models.CharField(blank=True, max_length=6, null=True),
        ),
    ]