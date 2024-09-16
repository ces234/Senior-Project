# backend/dbPopulator/management/commands/populateDb.py

import os
import django
import requests
from bs4 import BeautifulSoup
from django.core.management.base import BaseCommand
from recipeManagement.models import Ingredient, Recipe, RecipeIngredient
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
            

            def scrapeIngredients(singleRecipeSoup):
                ingredients_list = singleRecipeSoup.find('ul', class_='mm-recipes-structured-ingredients__list')
                ingredients = []
                if ingredients_list:
                    for li in ingredients_list.find_all("li"):
                        # Extract the full text of the ingredient
                        full_text = li.text.strip()

                        # Split the ingredient text into parts (quantity, unit, and ingredient name)
                        quantity = unit = ingredient_name = None

                        # Extract quantity (if it starts with numbers/fractions)
                        quantity_match = re.match(r"^([\d\/\s]+)", full_text)
                        if quantity_match:
                            quantity = quantity_match.group(1).strip()
                            remaining_text = full_text[len(quantity):].strip()
                        else:
                            remaining_text = full_text

                        # Try to separate unit from ingredient name
                        unit_match = re.match(r"(\w+)", remaining_text)
                        if unit_match:
                            unit = unit_match.group(1)
                            ingredient_name = remaining_text[len(unit):].strip()
                        else:
                            ingredient_name = remaining_text

                        ingredients.append({
                            'quantity': quantity,
                            'unit': unit,
                            'ingredient': ingredient_name
                        })

                return ingredients

            def scrapeDetails(singleRecipeSoup):
                details = singleRecipeSoup.find_all("div", class_="mm-recipes-details__item")
                recipe_details = {}
                for detail in details:
                    label = detail.find("div", class_ = "mm-recipes-details__label").text.strip()
                    value = detail.find("div", class_="mm-recipes-details__value").text.strip()
                    recipe_details[label] = value
                return recipe_details

            def scrapeSteps(singleRecipeSoup):
                directions_html = singleRecipeSoup.find_all("p", class_ = "comp mntl-sc-block mntl-sc-block-html")
                return [direction.text.strip() for direction in directions_html]

            # Save to Django models
            title = scrapeRecipeTitle(singleRecipeSoup)
            ingredients = scrapeIngredients(singleRecipeSoup)
            details = scrapeDetails(singleRecipeSoup)
            steps = scrapeSteps(singleRecipeSoup)

            # Check if the recipe already exists
            recipe, created = Recipe.objects.get_or_create(
                name=title,
                defaults={
                    'prep_time': details.get('Prep Time', '0'),
                    'cook_time': details.get('Cook Time', '0'),
                    'servings': details.get('Servings', '0'),
                    'instructions': ' '.join(steps)
                }
            )

            if created:
                self.stdout.write(f"Created new recipe: '{title}'")
            else:
                self.stdout.write(f"Recipe already exists: '{title}'")
                return  # Skip adding ingredients if the recipe already exists

            for ingredient_name in ingredients:
                # Check if the ingredient already exists
                ingredient, _ = Ingredient.objects.get_or_create(name=ingredient_name)
                
                # Check if RecipeIngredient already exists to avoid duplicates
                recipe_ingredient_exists = RecipeIngredient.objects.filter(
                    recipe=recipe,
                    ingredient=ingredient
                ).exists()

                if not recipe_ingredient_exists:
                    RecipeIngredient.objects.create(recipe=recipe, ingredient=ingredient, quantity='')
                    self.stdout.write(f"Added ingredient '{ingredient_name}' to recipe '{title}'")
                else:
                    self.stdout.write(f"Ingredient '{ingredient_name}' already exists in recipe '{title}'")

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


 