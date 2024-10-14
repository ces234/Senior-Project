import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RecipePage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/recipes/recipe/${id}/`
        );
        const data = await response.json();
        console.log("recipe data: ", data);
        setRecipe(data);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    };

    fetchRecipe();
  }, [id]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div className="recipe-container">
      <h1>{recipe.name}</h1>

      <div>
        <p>
          <strong>Prep Time:</strong> {recipe.prep_time} minutes
        </p>
        <p>
          <strong>Cook Time:</strong> {recipe.cook_time} minutes
        </p>
        <p>
          <strong>Servings:</strong> {recipe.servings}
        </p>
      </div>

      <div>
        <h2>Ingredients</h2>
        <ul>
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient.name}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Instructions</h2>
        <p>{recipe.instructions}</p>
      </div>
    </div>
  );
};

export default RecipePage;
