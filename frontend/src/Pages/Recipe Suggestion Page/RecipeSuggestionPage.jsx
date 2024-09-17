// Example of a React component that fetches random recipes
import React, { useEffect, useState } from 'react';

const RecipeSuggestionPage = () => {
    const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/recipes/random-recipes/')
      .then(response => response.json())
      .then(data => setRecipes(data))
      .catch(error => console.error('Error fetching recipes:', error));
  }, []);

  return (
    <div>
      <h1>Random Recipes</h1>
      <ul>
        {recipes.map((recipe, index) => (
          <li key={index}>
            {recipe.name} - Prep: {recipe.prep_time} mins, Cook: {recipe.cook_time} mins, Servings: {recipe.servings}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecipeSuggestionPage;
