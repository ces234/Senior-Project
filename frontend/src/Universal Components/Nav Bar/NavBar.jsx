import "./NavBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import {
  faBookOpen,
  faCarrot,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleMealPlanClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const today = new Date();
      const firstDayOfWeek = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - today.getDay() + 1
      ); // Monday
      const lastDayOfWeek = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - today.getDay() + 7
      ); // Sunday

      const start_date = firstDayOfWeek.toISOString().split("T")[0]; // Format to YYYY-MM-DD
      const end_date = lastDayOfWeek.toISOString().split("T")[0]; // Format to YYYY-MM-DD

      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated.");
        return;
      }

      const response = await fetch(
        "http://localhost:8000/meal-plan/create-meal-plan/",
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            start_date,
            end_date,
            user: user.id, // Assuming user object has an id
          }),
        }
      );

      let mealPlanData = {};
      if (response.ok) {
        mealPlanData = await response.json();
      } else if (response.status === 400) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create meal plan");
      }

      navigate("/meal-plan", { state: { mealPlan: mealPlanData } });
    } catch (error) {
      console.error("Error handling meal plan: ", error);
      setError("Failed to navigate to meal plan page. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const NavButton = ({ icon, text, onClick }) => (
    <div className="navButton" onClick={onClick}>
      <FontAwesomeIcon className="navIcon" icon={icon} />
      <h3>{text}</h3>
    </div>
  );

  return (
    <div className="navBar">
      <div className="firstIconContainer">
        <NavButton
          icon={faCircleUser}
          text="Profile"
          onClick={() => navigate("/profile")}
        />
      </div>
      <div className="otherIcons">
        <NavButton
          icon={faCalendar}
          text="Meal Plan"
          onClick={handleMealPlanClick}
        />
        <NavButton
          icon={faBookOpen}
          text="Recipes"
          onClick={() => navigate("/recipes")}
        />
        <NavButton
          icon={faCarrot}
          text="Pantry"
          onClick={() => navigate("/pantry")}
        />
        <NavButton
          icon={faCarrot}
          text="Grocery List"
          onClick={() => navigate("/grocery-list")}
        />
        <button onClick={handleLogout}>Logout</button>
      </div>
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default NavBar;
