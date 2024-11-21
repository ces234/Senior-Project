import "./RecipeSuggestionPage.css";
import "./RecipeCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faCirclePlus, faXmark } from "@fortawesome/free-solid-svg-icons"; // Import the trash icon
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react"; // Import useEffect
import RecipeCardImage from "./RecipeCardImage";
import chicken from "../../photos/chicken.webp";

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
  requestedBy,
  requestId,
  onUpdate, 
}) => {
  const [error, setError] = useState(null); // State for error messages
  const [success, setSuccess] = useState(null); // State for success messages
  const [categories, setCategories] = useState([]); // State for categories
  const [isSaved, setIsSaved] = useState(false); // State to track if recipe is saved

  const saveRecipeToFavorites = async (e) => {
    e.preventDefault(); // Prevent default behavior
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8000/user/saved-recipes/add/", // Adjust URL if necessary
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ recipe_id: recipeId }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add recipe to saved recipes");
      }

      const data = await response.json();
      setSuccess(data.message);
      setIsSaved(true); // Mark the recipe as saved
      setError(null);
    } catch (error) {
      console.error("Error saving recipe: ", error);
      setError(error.message);
      setSuccess(null);
    }
  };

  // Fix: Add event parameter (e) to the function and properly handle stopPropagation
  const addToRecentlyAdded = async (e, recipeId) => {
    try {
      const token = localStorage.getItem("token"); // Adjust according to where you store your token

      if (requestId) {
        const deleteResponse = await fetch(
          `http://localhost:8000/recipes/delete_request/${requestId}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!deleteResponse.ok) {
          throw new Error("Failed to delete the recipe request");
        }
      }

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
    } catch (error) {
      console.error("Error adding recipe: ", error);
    }
    if (onUpdate) {
      onUpdate();
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent the click event from bubbling up to the card
    if (onDelete) {
      await onDelete(mealPlanId, recipeId, meal, day); // Call the onDelete function passed from the parent component
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/recipes/${recipeId}/categories/`
      ); // Adjust URL as needed
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setCategories(data.categories); // Assume your response has a 'categories' field
    } catch (error) {
      console.error("Error fetching categories: ", error);
      setError(error.message); // Update error state
    }
  };

  // Use useEffect to fetch categories when the component mounts or recipeId changes
  useEffect(() => {
    fetchCategories();
  }, [recipeId]); // Dependency array ensures fetch is called when recipeId changes

  return (
    <div className="recipeCardContainer" draggable onDragStart={onDragStart}>
      <button className="deleteButton" onClick={handleDelete}>
        <FontAwesomeIcon icon={faXmark} />
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <Link to={`/recipe/${recipeId}`} className="recipeLink">
        <RecipeCardImage categories={categories} />

        <div className="recipeTitleContainer">{title}</div>
        <div className="recipeTimeContainer">
          <div className="cookTime">Cook Time: {cookTime}</div>
          <div className="prepTime">Prep Time: {prepTime}</div>
        </div>
      </Link>
      {/* Conditionally render the 'Requested by' section */}
      {requestedBy && (
        <div className="requestedBy">
          <p>Requested by: {requestedBy}</p>
        </div>
      )}
      <div className="recipeButtonContainer">
        <FontAwesomeIcon
          icon={faHeart}
          onClick={saveRecipeToFavorites}
          style={{
            cursor: "pointer",
            color: isSaved ? "red" : "grey",
          }}
        />
        <FontAwesomeIcon
          icon={faCirclePlus}
          onClick={(e) => addToRecentlyAdded(e, recipeId)}
          style={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
};
export default RecipeCard;
