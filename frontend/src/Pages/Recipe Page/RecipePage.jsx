import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../AuthContext";

const RecipePage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [pantryIngredients, setPantryIngredients] = useState([]);
  const [groceryIngredients, setGroceryIngredients] = useState([]);
  const { user, logout } = useAuth();
  const [rating, setRating] = useState(null); // State for rating input
  const [submittedRating, setSubmittedRating] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/recipes/recipe/${id}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    };

    const fetchPantryIngredients = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/pantry/items/",
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setPantryIngredients(response.data);
      } catch (error) {
        console.error("Error fetching pantry items:", error.response.data);
      }
    };

    const fetchGroceryList = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/grocery/grocery-list/",
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch grocery list");
        const fetchedList = await response.json();
        setGroceryIngredients(fetchedList.ingredients || []); // Set to an empty array if undefined
      } catch (error) {
        console.error("Error fetching grocery list: ", error);
        alert("Failed to fetch list. Please try again.");
      }
    };

    if (token) {
      fetchRecipe();
      fetchPantryIngredients();
      fetchGroceryList();
    }
  }, [id, token, submittedRating]);

  console.log(recipe);

  const handleRatingSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/recipes/recipe/${id}/rate/`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rating }),
        }
      );

      if (!response.ok) throw new Error("failed to submit rating");

      setSubmittedRating(true);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

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
            <li key={index}>
              {ingredient.name}
              {pantryIngredients.some(
                (pantryItem) => pantryItem.ingredient_name === ingredient.name
              ) && <span> (in pantry)</span>}
              {groceryIngredients &&
                groceryIngredients.some(
                  (groceryItem) => groceryItem.name === ingredient.name
                ) && <span> (in grocery list)</span>}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Instructions</h2>
        <p>{recipe.instructions}</p>
      </div>
      <div className="rating-section">
        <h2>Rate this Recipe</h2>
        {!submittedRating ? (
          <>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              <option value="">Select rating</option>
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>
                  {value} {value === 1 ? "star" : "stars"}
                </option>
              ))}
            </select>
            <button onClick={handleRatingSubmit}>Submit Rating</button>
          </>
        ) : (
          <p>Thank you for rating!</p>
        )}
      </div>

      <div className="existing-ratings">
        <h2>Ratings</h2>
        <ul>
          {recipe.ratings.map((rating, index) => (
            <li key={index}>
              {rating.username}: {rating.rating}{" "}
              {rating.rating === 1 ? "star" : "stars"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecipePage;
