import "./RecipeSuggestionPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import { faCirclePlus, faTrash } from "@fortawesome/free-solid-svg-icons"; // Import the trash icon
import React, { useState } from "react";
import { Link } from "react-router-dom";

const RecipeCard = ({
  image,
  title,
  cookTime,
  prepTime,
  recipeId,
  onDragStart,
  onDelete, // Add onDelete prop
  mealPlanId,
  meal,
  day,
}) => {
  const [error, setError] = useState(null); // State for error messages
  const [success, setSuccess] = useState(null); // State for success messages

  // Fix: Add event parameter (e) to the function and properly handle stopPropagation
  const addToRecentlyAdded = async (e, recipeId) => {
    try {
      const token = localStorage.getItem("token"); // Adjust according to where you store your token

      const response = await fetch(
        "http://localhost:8000/user/add-recently-added-recipe/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`, // Use 'Token' followed by the token value
          },
          body: JSON.stringify({ recipe_id: recipeId }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add recipe to recently added");
      }

      const data = await response.json();
      setSuccess(data.message); // Update success state
      setError(null); // Clear error state
    } catch (error) {
      console.error("Error adding recipe: ", error);
      setError(error.message); // Update error state
      setSuccess(null); // Clear success state
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent the click event from bubbling up to the card
    if (onDelete) {
      await onDelete(mealPlanId,recipeId, meal, day); // Call the onDelete function passed from the parent component
    }
  };

  return (
    <div className="recipeCardContainer" draggable onDragStart={onDragStart}>
            <FontAwesomeIcon
        icon={faTrash} // Trash icon for deleting
        onClick={handleDelete} // Call handleDelete on click
        style={{ cursor: "pointer", color: "red" }} // Style for the delete icon
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <Link to={`/recipe/${recipeId}`} className="recipeLink">
        <img src={image} alt="recipe" />

        <div className="recipeTitleContainer">{title}</div>
        <div className="recipeTimeContainer">
          <div className="cookTime">Cook Time: {cookTime}</div>
          <div className="prepTime">Prep Time: {prepTime}</div>
        </div>
      </Link>
      <div className="recipeButtonContainer">
        <FontAwesomeIcon icon={faStar} />
        <FontAwesomeIcon
          icon={faCirclePlus}
          onClick={(e) => addToRecentlyAdded(e, recipeId)} // Pass the event and recipeId
          style={{ cursor: "pointer" }} // Add pointer style to indicate it's clickable
        />
      </div>


    </div>
  );
};

export default RecipeCard;
