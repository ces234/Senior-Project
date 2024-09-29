import "./MealPlanPage.css";
import React, { useEffect, useState } from "react";

const Calendar = ({ onRecipeDrop }) => {
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const meals = ["Breakfast", "Lunch", "Dinner"];

  const handleDrop = (e, day, mealType) => {
    e.preventDefault();
    const recipeId = e.dataTransfer.getData("recipeId");
    onRecipeDrop(recipeId, day, mealType);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
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

        {/* Render the meal types as rows */}
        {meals.map((meal, mealIndex) => (
          <React.Fragment key={mealIndex}>
            <div className="mealRowHeader">{meal}</div>
            {daysOfWeek.map((day, dayIndex) => (
              <div
                key={`${mealIndex}-${dayIndex}`}
                className="mealSlot"
                onDrop={(e) => handleDrop(e, day, meal)} // Handle the drop event
                onDragOver={handleDragOver} // Handle drag over to allow dropping
              >
                {/* You can add content here, like selected recipes or empty slots */}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
