import React from "react";
import "./MealPlanPage.css";
import RecipeCard from "../Recipe Suggestion Page/RecipeCard";
import chicken from "../../photos/chicken.webp";
import { Link } from 'react-router-dom';

const Calendar = ({ onRecipeDrop, currentRecipes, onDragStart, handleRemoveRecipe, mealPlanId}) => {
  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
  ];
  const meals = ["Breakfast", "Lunch", "Dinner"];

  console.log("meal plan id: ", mealPlanId);

  const handleDrop = (e, day, mealType) => {
    e.preventDefault();
    const recipeId = e.dataTransfer.getData("recipeId");
    onRecipeDrop(recipeId, day, mealType);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const getRecipeForSlot = (day, mealType) => {
    return currentRecipes.find(
      (recipe) => recipe.day === day && recipe.meal_type === mealType
    );
  };

  return (
    <div className="calendarContainer">
      <div className="mealGrid">
        <div className="mealGridPlaceholder"></div>
        {daysOfWeek.map((day, index) => (
          <div key={index} className="mealDayHeader">
            {day}
          </div>
        ))}
        {meals.map((meal, mealIndex) => (
          <React.Fragment key={mealIndex}>
            <div className="mealRowHeader">{meal}</div>
            {daysOfWeek.map((day, dayIndex) => (
              <div
                key={`${mealIndex}-${dayIndex}`}
                className="mealSlot"
                onDrop={(e) => handleDrop(e, day, meal)}
                onDragOver={handleDragOver}
              >
                {(() => {
                  const recipeData = getRecipeForSlot(day, meal);
                  return recipeData ? (
                    <Link to={`/recipe/${recipeData.recipe.id}`} className="recipeLink">
                      <RecipeCard
                        image={chicken}
                        title={recipeData.recipe.name}
                        cookTime={recipeData.recipe.cook_time}
                        prepTime={recipeData.recipe.prep_time}
                        recipeId={recipeData.recipe.id}
                        mealPlanId={mealPlanId} // Passing the mealPlanId prop
                        draggable
                        onDragStart={(e) => onDragStart(e, recipeData.recipe.id)} // Ensure the correct ID is passed
                        onDelete={handleRemoveRecipe}
                        meal = {meal}
                        day = {day}
                        />
                    </Link>
                  ) : (
                    <div className="addMealPrompt">Add a meal!</div> // Consider making this clickable
                  );
                })()}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
