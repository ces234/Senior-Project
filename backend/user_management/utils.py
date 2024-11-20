def get_user_saved_recipes(user):
    saved_recipes = user.saved_recipes.all()
    serialized_recipes = [{
        'id': recipe.id,
        'name': recipe.name,
        'prep_time': recipe.prep_time,
        'cook_time': recipe.cook_time,
        'servings': recipe.servings,
    } for recipe in saved_recipes]

    return serialized_recipes