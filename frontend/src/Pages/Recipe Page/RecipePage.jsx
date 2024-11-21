import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import './RecipePage.css';
import { BsCart4, BsPlusCircle } from "react-icons/bs";

const RecipePage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [pantryIngredients, setPantryIngredients] = useState([]);
  const [groceryIngredients, setGroceryIngredients] = useState([]);
  const { user, logout, isMember } = useAuth(); // Use isMember from context
  const [submittedRating, setSubmittedRating] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

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

  const addToGroceryList = async (ingredient) => {
    const token = localStorage.getItem("token");
    try {
      // First, search for the ingredient by name to get the id
      const searchResponse = await fetch(
        `http://localhost:8000/recipes/search-exact-ingredient/?q=${ingredient.name}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
  
      if (!searchResponse.ok) throw new Error("Failed to fetch ingredient.");
  
      const ingredientData = await searchResponse.json();
  
      // Ensure ingredientData is not empty
      if (ingredientData.length === 0) {
        throw new Error("Ingredient not found in database.");
      }
  
      // Use the first matching ingredient (or handle cases if multiple matches)
      const ingredientId = ingredientData[0].id;
  
      // Now, proceed to add the ingredient to the grocery list with the obtained id
      const response = await fetch("http://localhost:8000/grocery/add-ingredient/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          ingredient_id: ingredientId,
        }),
      });
  
      if (!response.ok) throw new Error("Failed to add ingredient to grocery list.");
      console.log("Ingredient successfully added to grocery list.");
    } catch (error) {
      console.error("Error adding ingredient to grocery list:", error);
    }
  };  

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

      setAlertMessage("Recipe requested successfully!");
    } catch (error) {
      setAlertMessage("Failed to request recipe. Please try again.");
      console.error("Error requesting recipe:", error);
    }
  };

  if (!recipe) {
    return <div>Loading...</div>;
  }

  const RecipeDetails = ({ recipe }) => {
    const totalRatings = recipe.ratings.length;
    const averageRating = totalRatings
      ? recipe.ratings.reduce((sum, rating) => sum + rating.rating, 0) / totalRatings
      : 0;

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
          <span>Avg. Rating:</span> {averageRating} {averageRating === 1 ? "star" : "stars"}
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
                {ingredient.quantity}{' '}
                {ingredient.unit}{' '}
                {ingredient.name}
                <button onClick={() => addToGroceryList(ingredient)}><BsPlusCircle /></button>
                {pantryIngredients.some(
                  (pantryItem) => pantryItem.ingredient_name === ingredient.name
                ) && <span> <InPantryTag/> </span>}
                {groceryIngredients &&
                  groceryIngredients.some(
                    (groceryItem) => groceryItem.name === ingredient.name
                  ) && <span><InCartTag /></span>}
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
            <h2 className="rateRecipeText">Rate this Recipe</h2>
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

  const InCartTag = () => {
    return (
      <span className="ingredient-tag"><BsCart4 />In Cart</span>
    )
  };
  
  return (
    <div className="recipe-container">
      {alertMessage && (
        <div className="custom-alert">
          <span>{alertMessage}</span>
          <button onClick={() => setAlertMessage(null)} className="close-btn">
            &times;
          </button>
        </div>
      )}
      <div className="recipeHeaderContainer">
        <h1>{recipe.name} Recipe</h1>
        {isMember() && ( // Render request button only for members
        <div>
          <button className = "requestRecipeButton" onClick={handleRequestRecipe}>Request Recipe</button>
        </div>
      )}
      </div>

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

      
      
    </div>
  );
};

export default RecipePage;
