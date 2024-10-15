import string
from django.core.management.base import BaseCommand
from recipe_management.models import Ingredient, RecipeIngredient

# Words/phrases to remove from ingredients
UNNECESSARY_WORDS = [
    'melted', 'softened', 'thawed', 'drained', 'chopped', 'squeezed dry', 'broken into florets',
    'optional', 'to taste', 'each cut into 3 short pieces', 'for garnish', 'or as needed', 
    'plus more for garnish', 'plus more for dusting cake pan', 'or more to taste', 'more for dusting', 
    '(optional)', '(such as Frank\'s)', '(such as Lawry\'s)', 'or to taste', 'or to', 'diced', 
    'shredded', 'grated', 'minced', 'cubed', 'sliced', 'boneless', 'skinless', 'fresh', 'cooked', 'large', 'small', 'medium',
    'confectioner\'s', 'Dutch process', 'dark', 'light',
    'minced', 'thawed if frozen', 'skinned if desired', 'for serving', 'for garnish', 'crushed',
    'plus more', 'divided', 'grated', 'halved', 'quartered if large', 'about', 'chopped', 'cut into', 
    'divided', 'drained', 'unsalted', 'garlic', 'extra-virgin', 'wedges', 'zest', 'juice', 
    'whole-milk', 'Greek-style', 'thawed', 'fruit spread', 'freshly squeezed', 'grated', 'cut into 1/4-inch wedges',
    'divided', 'ground', 'drained'
]

class Command(BaseCommand):
    help = 'Clean up ingredient names by removing unnecessary words and punctuation and combining duplicates.'

    def handle(self, *args, **kwargs):
        # Get all ingredients
        ingredients = Ingredient.objects.all()
        cleaned_names = {}

        for ingredient in ingredients:
            # Clean the name
            cleaned_name = self.clean_ingredient_name(ingredient.name)

            # If the cleaned name already exists in cleaned_names, use the existing ingredient
            if cleaned_name in cleaned_names:
                existing_ingredient = cleaned_names[cleaned_name]
                self.combine_ingredients(existing_ingredient, ingredient)
            else:
                cleaned_names[cleaned_name] = ingredient
                # Update the ingredient name in the database
                ingredient.name = cleaned_name
                ingredient.save()

            # Provide feedback to the console
            self.stdout.write(self.style.SUCCESS(f'Updated ingredient: {ingredient.name}'))

    def clean_ingredient_name(self, name):
        # Convert to lowercase
        name = name.lower()

        # Remove text after "such as", including "such as"
        if 'such as' in name:
            name = name.split('such as')[0].strip()

        # Remove punctuation (except hyphens and apostrophes)
        name = name.translate(str.maketrans('', '', string.punctuation.replace('-', '').replace("'", '')))

        # Remove unnecessary words/phrases
        for word in UNNECESSARY_WORDS:
            name = name.replace(word, '')

        # Strip extra whitespace
        name = ' '.join(name.split())

        return name

    def combine_ingredients(self, existing_ingredient, new_ingredient):
        """Combine RecipeIngredient entries for the new ingredient with the existing ingredient."""
        # Get all RecipeIngredient entries for the new ingredient
        recipe_ingredients = RecipeIngredient.objects.filter(ingredient=new_ingredient)

        for recipe_ingredient in recipe_ingredients:
            # Check if the RecipeIngredient already exists with the existing ingredient
            if not RecipeIngredient.objects.filter(recipe=recipe_ingredient.recipe, ingredient=existing_ingredient).exists():
                # Update the ingredient reference to the existing ingredient
                recipe_ingredient.ingredient = existing_ingredient
                recipe_ingredient.save()

        # Optionally delete the new ingredient if it's no longer needed
        new_ingredient.delete()
