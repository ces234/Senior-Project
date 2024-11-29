from django.db import migrations
import random

def populate_join_codes(apps, schema_editor):
    Household = apps.get_model('user_management', 'Household')
    for household in Household.objects.filter(join_code=''):
        household.join_code = ''.join(random.choices('0123456789', k=6))
        household.save()

class Migration(migrations.Migration):
    dependencies = [
        ('user_management', '0005_household_join_code'),  # Replace with the correct dependency
    ]

    operations = [
        migrations.RunPython(populate_join_codes),
    ]