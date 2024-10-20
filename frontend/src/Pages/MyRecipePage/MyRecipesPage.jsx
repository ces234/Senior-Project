import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import RecipeCard from "../Recipe Suggestion Page/RecipeCard";
import "../Recipe Suggestion Page/RecipeSuggestionPage.css"; // Optional: Create CSS for this page

const MyRecipesPage = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [error, setError] = useState(null);

  const fetchSavedRecipes = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token from local storage
      const response = await fetch("http://localhost:8000/user/saved-recipes/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch saved recipes");
      }
      const data = await response.json();
      setSavedRecipes(data);
    } catch (error) {
      console.error("Error fetching saved recipes:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchSavedRecipes(); // Fetch saved recipes when component mounts
  }, []);

  return (
    <div className="savedRecipesContainer">
      <h2>Saved Recipes</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {savedRecipes.length === 0 ? (
        <p>No saved recipes yet!</p>
      ) : (
        <div className="recipeGrid">
          {savedRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipeId={recipe.id}
              title={recipe.name}
              image={recipe.image_url} // Adjust field names as per your API
              cookTime={recipe.cook_time}
              prepTime={recipe.prep_time}
              // Add any other props needed for the RecipeCard component
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRecipesPage;
