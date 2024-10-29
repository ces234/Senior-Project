import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';

const RecipePage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [pantryIngredients, setPantryIngredients] = useState([]);
  const [groceryIngredients, setGroceryIngredients] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/recipes/recipe/${id}/`
        );
        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    };

    const fetchPantryIngredients = async () => {
      const token = localStorage.getItem('token'); // Get the user's token
      try {
        const response = await axios.get('http://localhost:8000/pantry/items/', {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setPantryIngredients(response.data); // Set the pantry items from the response
      } catch (error) {
        console.error('Error fetching pantry items:', error.response.data);
      }
    };

    const fetchGroceryList = async () => {
      const token = localStorage.getItem("token");
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
        console.log(fetchedList);
        setGroceryIngredients(fetchedList.ingredients);
      } catch (error) {
        console.error("Error fetching grocery list: ", error);
        alert("Failed to fetch list. Please try again.");
      }
    };
  
    fetchPantryIngredients();
    fetchGroceryList();
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
            <li key={index}>
              {ingredient.name}
              {pantryIngredients.some(pantryItem => pantryItem.ingredient_name === ingredient.name) && (
                <span> (in pantry)</span>
              )}
              {groceryIngredients.some(groceryItem => groceryItem.name === ingredient.name) && (
                <span> (in grocery list)</span>
              )}
            </li>
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
