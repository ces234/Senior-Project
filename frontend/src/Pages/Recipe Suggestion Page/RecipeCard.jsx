import "./RecipeSuggestionPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";

const RecipeCard = ({ image, title, cookTime, prepTime, recipeId, onDragStart }) => {

  console.log("SLDKFJSDLKFJ", recipeId);

  const [error, setError] = useState(null); // State for error messages
  const [success, setSuccess] = useState(null); // State for success messages

  const addToRecentlyAdded = async (recipeId) => {
    try {
        const token = localStorage.getItem('token'); // Adjust according to where you store your token
        console.log("TOKEN: ", token);
        console.log("RECIPE ID: ", recipeId);
        const response = await fetch('http://localhost:8000/user/add-recently-added-recipe/', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`, // Use 'Token' followed by the token value
            },
            body: JSON.stringify({ recipe_id: recipeId }),
        });
      if (!response.ok) {
        throw new Error('Failed to add recipe to recently added');
      }

      const data = await response.json();
      setSuccess(data.message); // Update success state
      setError(null); // Clear error state
    } catch (error) {
      console.error("Error adding recipe: ", error);
      setError(error.message); // Update error state
      setSuccess(null); // Clear success state
    }
  }

  return (
    <div className="recipeCardContainer" draggable onDragStart = {onDragStart}>
      <img src={image} alt="recipe" />
      <div className="recipeTitleContainer">{title}</div>
      <div className="recipeTimeContainer">
        <div className="cookTime">Cook Time: {cookTime}</div>
        <div className="prepTime">Prep Time: {prepTime}</div>
      </div>
      <div className="recipeButtonContainer">
        <FontAwesomeIcon icon={faStar} />
        <FontAwesomeIcon
          icon={faCirclePlus}
          onClick={() => addToRecentlyAdded(recipeId)} // Pass a function reference
          style={{ cursor: "pointer" }} // Add pointer style to indicate it's clickable
        />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default RecipeCard;
