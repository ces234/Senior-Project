import "./MealPlanPage.css";
import { useNavigate } from "react-router-dom"; // Ensure you have this import for navigation
import React, { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";



const DateDisplay = ({ currentPlan, handleNext, handlePrevious }) => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [error, setError] = useState(""); // Add state for error handling
  const [loading, setLoading] = useState(false); // Add state for loading indication
  const { user, logout } = useAuth();


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "long", day: "numeric" };
    const daySuffixes = ["th", "st", "nd", "rd"];

    const day = date.getDate();
    const suffix =
      daySuffixes[
        day % 10 <= 3 && Math.floor((day % 100) / 10) !== 1 ? day % 10 : 0
      ];

    return `${date.toLocaleString("default", options)}${suffix}`;
  };

  

  return (
    <div>
      <button onClick = {handlePrevious}>previous</button>
      {formatDate(currentPlan?.start_date)} - {formatDate(currentPlan?.end_date)}
      <button onClick={handleNext}>next</button>
      {error && <p className="error">{error}</p>} {/* Display error message */}
      {loading && <p>Loading...</p>} {/* Display loading message */}
    </div>
  );
};

export default DateDisplay;
