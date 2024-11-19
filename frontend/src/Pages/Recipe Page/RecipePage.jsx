import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import "./RecipePage.css";

const RecipePage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [pantryIngredients, setPantryIngredients] = useState([]);
  const [groceryIngredients, setGroceryIngredients] = useState([]);
  const { user, logout, isMember } = useAuth(); // Use isMember from context
  const [submittedRating, setSubmittedRating] = useState(false);

  console.log(isMember()); // This will show true or false

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

        if (data.ratings.some((rating) => rating.username === user.username)) {
          setSubmittedRating(true);
        }
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
        setGroceryIngredients(fetchedList.ingredients || []);
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
  }, [id, token, submittedRating, user.username]);

  const handleRequestRecipe = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/recipes/request/${id}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to request recipe");

      alert("Recipe requested successfully!");
    } catch (error) {
      console.error("Error requesting recipe:", error);
    }
  };

  if (!recipe) {
    return <div>Loading...</div>;
  }

  const RecipeDetails = ({ recipe }) => {
    return (
      <div className="recipe-details">
        <div className="detail">
          <span>Prep Time:</span> {recipe.prep_time} min
        </div>
        <div className="detail">
          <span>Cook Time:</span> {recipe.cook_time} min
        </div>
        <div className="detail">
          <span>Servings:</span> {recipe.servings}
        </div>
        <div className="detail">
          {/* <span>Avg. Rating:</span> {recipe.ratings} 
        //TODO: compute avg ratings */}
        </div>
      </div>
    );
  };

  const Instructions = () => {
    // Split instructions into sentences, filtering out any empty strings
    const instructionsList = recipe.instructions
      .split(".")
      .map((sentence) => sentence.trim()) // Remove extra whitespace
      .filter((sentence) => sentence); // Remove any empty strings

    return (
      <div className="instructions">
        <ol>
          {instructionsList.map((sentence, index) => (
            <li key={index}>{sentence}.</li>
          ))}
        </ol>
      </div>
    );
  };

  const Ingredients = () => {
    return (
      <div className="ingredients">
        <ul>
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>
              {ingredient.quantity} {ingredient.unit} {ingredient.name}
              {pantryIngredients.some(
                (pantryItem) => pantryItem.ingredient_name === ingredient.name
              ) && (
                <span>
                  {" "}
                  <InPantryTag />{" "}
                </span>
              )}
              {groceryIngredients &&
                groceryIngredients.some(
                  (groceryItem) => groceryItem.name === ingredient.name
                ) && <span> (in grocery list)</span>}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderStars = (rating) => {
    return (
      <div className="stars">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`star ${index < rating ? "filled" : ""}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const Ratings = () => {
    const [hoveredStar, setHoveredStar] = useState(0);
    const [rating, setRating] = useState(null);
    const [selectedRating, setSelectedRating] = useState(0);

    const handleMouseOver = (index) => setHoveredStar(index + 1);
    const handleMouseOut = () => setHoveredStar(0);
    const handleClick = (index) => {
      setRating(index + 1);
      setSelectedRating(index + 1);
    };

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

        if (!response.ok) throw new Error("Failed to submit rating");
        setSubmittedRating(true);
      } catch (error) {
        console.error("Error submitting rating:", error);
      }
    };

    return (
      <div className="ratings">
        <ul>
          {recipe.ratings.map((ratingObj, index) => (
            <li key={index}>
              <span className="username">{ratingObj.username}:</span>
              <span className="stars">
                {renderStars(ratingObj.rating)}
              </span>{" "}
            </li>
          ))}
        </ul>
        {!submittedRating && (
          <div className="rating-section">
            <h2 className = "rateRecipeText">Rate this Recipe</h2>
            <div className="stars">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  className={`star ${
                    hoveredStar > index || selectedRating > index
                      ? "filled"
                      : ""
                  }`}
                  onMouseOver={() => handleMouseOver(index)}
                  onMouseOut={handleMouseOut}
                  onClick={() => handleClick(index)}
                >
                  ★
                </span>
              ))}
            </div>
            <button className="submitRatingButton" onClick={handleRatingSubmit}>
              Submit Rating
            </button>
          </div>
        )}
      </div>
    );
  };

  const InPantryTag = () => {
    return <span className="ingredient-tag">In Pantry</span>;
  };

  return (
    <div className="recipe-container">
      <h1>{recipe.name} Recipe</h1>

      <div>
        <RecipeDetails recipe={recipe} />
      </div>

      <div className="details-container">
        <div className="instructions-container">
          <h2>Instructions</h2>
          <Instructions />
        </div>
        <div className="ingredients-ratings-container">
          <h2>Ingredients</h2>
          <Ingredients />
          <h2>Family Ratings</h2>
          <Ratings />
        </div>
      </div>

      {isMember() && ( // Render request button only for members
        <div>
          <button onClick={handleRequestRecipe}>Request Recipe</button>
        </div>
      )}
    </div>
  );
};

export default RecipePage;
