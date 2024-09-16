import os
import django
import requests
from bs4 import BeautifulSoup
from django.core.management.base import BaseCommand
from recipe_management.models import Ingredient, Recipe, RecipeIngredient
from fractions import Fraction
import re

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

class Command(BaseCommand):
    help = 'Populate the database with recipes'

    def handle(self, *args, **options):
        def scrapeRecipe(recipeURL):
            response = requests.get(recipeURL)
            singleRecipeSoup = BeautifulSoup(response.text, 'html.parser')

            def scrapeRecipeTitle(singleRecipeSoup):
                title = singleRecipeSoup.find("h1", class_="article-heading type--lion")
                return title.text.strip() if title else 'Unknown'

            def convert_fraction_to_float(fraction_str):
                # Normalize fraction representation
                normalized_str = normalize_fraction(fraction_str)
                try:
                    # Handle mixed fractions like "1 1/4"
                    parts = normalized_str.split()
                    if len(parts) == 2:
                        whole_number = float(parts[0])
                        fractional_part = float(Fraction(parts[1]))
                        return whole_number + fractional_part
                    else:
                        return float(Fraction(parts[0]))
                except (ValueError, ZeroDivisionError):
                    return None

            def normalize_fraction(text):
                replacements = {
                    '¼': '1/4',
                    '½': '1/2',
                    '¾': '3/4',
                    '⅐': '1/7',
                    '⅑': '1/9',
                    '⅒': '1/10',
                    '⅓': '1/3',
                    '⅔': '2/3',
                    '⅕': '1/5',
                    '⅖': '2/5',
                    '⅗': '3/5',
                    '⅘': '4/5',
                    '⅙': '1/6',
                    '⅚': '5/6',
                    '⅛': '1/8',
                    '⅜': '3/8',
                    '⅝': '5/8',
                    '⅞': '7/8'
                    # Add more replacements as needed
                }
                for special_char, replacement in replacements.items():
                    text = text.replace(special_char, replacement)
                return text

            def scrapeIngredients(singleRecipeSoup):
                ingredients_list = singleRecipeSoup.find_all('li', class_='mm-recipes-structured-ingredients__list-item')
                ingredients = []

                for li in ingredients_list:
                    quantity = li.find("span", {"data-ingredient-quantity": "true"})
                    unit = li.find("span", {"data-ingredient-unit": "true"})
                    name = li.find("span", {"data-ingredient-name": "true"})

                    quantity_text = quantity.text.strip() if quantity else None
                    unit_text = unit.text.strip() if unit else None
                    name_text = name.text.strip() if name else None

                    # Convert fraction string to float
                    if quantity_text:
                        quantity_float = convert_fraction_to_float(quantity_text)
                    else:
                        quantity_float = None

                    ingredients.append({
                        'quantity': quantity_float,
                        'unit': unit_text,
                        'ingredient': name_text
                    })

                return ingredients

            def scrapeDetails(singleRecipeSoup):
                details = singleRecipeSoup.find_all("div", class_="mm-recipes-details__item")
                recipe_details = {}
                for detail in details:
                    label = detail.find("div", class_ = "mm-recipes-details__label").text.strip()
                    value = detail.find("div", class_="mm-recipes-details__value").text.strip()
                    value = value.replace('mins', '').strip()  # Removing 'mins' if present
                    recipe_details[label] = value
                #print(recipe_details)
                return recipe_details

            def scrapeSteps(singleRecipeSoup):
                directions_html = singleRecipeSoup.find_all("p", class_ = "comp mntl-sc-block mntl-sc-block-html")
                return [direction.text.strip() for direction in directions_html]

            def handle_numeric_value(value):
                if value:
                    match = re.search(r'\d+', value)
                    if match:
                        return int(match.group())
                return 0

            # Save to Django models
            title = scrapeRecipeTitle(singleRecipeSoup)
            ingredients = scrapeIngredients(singleRecipeSoup)
            details = scrapeDetails(singleRecipeSoup)
            steps = scrapeSteps(singleRecipeSoup)

            prep_time = handle_numeric_value(details.get('Prep Time:', '0') or 0)
            cook_time = handle_numeric_value(details.get('Cook Time:', '0') or 0)
            servings = handle_numeric_value(details.get('Servings:', '0') or 0)

            # Check if the recipe already exists
            recipe, created = Recipe.objects.get_or_create(
                name=title,
                defaults={
                    'prep_time': prep_time,
                    'cook_time': cook_time, 
                    'servings': servings,
                    'instructions': ' '.join(steps)
                }
            )

            # print("prep time:", details.get('Prep Time:'))
            # print("cook time:", details.get('Cook Time:'))
            # print("servings:", details.get('Servings:'))

            if not created:
                self.stdout.write(f"Recipe already exists: '{title}'")
                return


            for ingredient_data in ingredients:
                ingredient_name = ingredient_data.get("ingredient")
                quantity = ingredient_data.get("quantity")
                unit = ingredient_data.get("unit")

                # Check if the ingredient already exists
                ingredient, _ = Ingredient.objects.get_or_create(name=ingredient_name)
                
                RecipeIngredient.objects.get_or_create(
                    recipe=recipe,
                    ingredient=ingredient,
                    defaults={
                        'quantity': quantity,
                        'unit': unit
                    }
                )

                #self.stdout.write(f"Added ingredient '{ingredient_data}' to recipe '{title}'")

        def scrapeAllRecipes(topicPage):
            topicsResponse = requests.get(topicPage)
            topicsSoup = BeautifulSoup(topicsResponse.text, 'html.parser')

            topicLinks = topicsSoup.find_all("a", class_ = "mntl-link-list__link type--dog-link type--dog-link")
            numRecipes = 0
            for link in topicLinks:
                topicUrl = link['href']
                singleTopicResponse = requests.get(topicUrl)
                singleTopicSoup = BeautifulSoup(singleTopicResponse.text, "html.parser")
                topicHtml = singleTopicSoup.find("h1", class_ = "comp mntl-taxonomysc-heading mntl-text-block").text.strip()
                self.stdout.write(topicHtml)
                recipeLinks = singleTopicSoup.find_all("a", class_ = "comp mntl-card-list-items mntl-document-card mntl-card card card--no-image")
                for recipeLink in recipeLinks:
                    cardContent = recipeLink.find("div", class_ = "card__content")
                    dataTag = cardContent.get("data-tag")
                    if dataTag == "In the Kitchen":
                        continue
                    recipeUrl = recipeLink['href']
                    scrapeRecipe(recipeUrl)  
                    numRecipes += 1
                    self.stdout.write(f"Recipes: {numRecipes}")

        # Call the scraping function
        scrapeAllRecipes("https://www.allrecipes.com/recipes-a-z-6735880")
