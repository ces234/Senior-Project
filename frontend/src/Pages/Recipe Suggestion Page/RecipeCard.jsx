import "./RecipeSuggestionPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";

const RecipeCard = ({ image, title, cookTime, prepTime, recipeId }) => {
    console.log("recipe ID:", recipeId);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Function to add the recipe to recently added
  const addToRecentlyAdded = async () => {
    const token = localStorage.getItem('access_token');  // Assuming you're using JWT tokens
    const user = localStorage.getItem("user");
    console.log("sdfd", user);

    try {
      const response = await fetch(`http://localhost:8000/household/add_to_recent/${recipeId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Include token for authentication
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(data.success);
      } else {
        setError('Failed to add recipe to recently added list');
      }
    } catch (error) {
      setError('Error adding recipe to recently added list');
    }
  };

  return (
    <div className="recipeCardContainer">
      <img src={image} alt="recipe image" />
      <div className="recipeTitleContainer">{title}</div>
      <div className="recipeTimeContainer">
        <div className="cookTime">
          Cook Time: {cookTime}
        </div>
        <div className="prepTime">
          Prep Time: {prepTime}
        </div>
      </div>
      <div className="recipeButtonContainer">
        <FontAwesomeIcon icon={faStar} />
        <FontAwesomeIcon
          icon={faCirclePlus}
          onClick={addToRecentlyAdded} // Attach the click handler here
          style={{ cursor: 'pointer' }} // Add pointer style to indicate it's clickable
        />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default RecipeCard;
