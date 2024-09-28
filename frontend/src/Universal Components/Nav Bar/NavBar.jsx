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

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to the home page after logout
  };

  const handleMealPlanClick = async () => {
    try {
      // Calculate start and end dates for the current week
      const today = new Date();
      const firstDayOfWeek = new Date(
        today.setDate(today.getDate() - today.getDay() + 1)
      ); // Monday
      const lastDayOfWeek = new Date(
        today.setDate(today.getDate() - today.getDay() + 7)
      ); // Sunday

      const startDate = firstDayOfWeek.toISOString().split("T")[0]; // Format to YYYY-MM-DD
      const endDate = lastDayOfWeek.toISOString().split("T")[0]; // Format to YYYY-MM-DD

      // Create meal plan if it doesn't exist
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8000/meal-plan/create-meal-plan/",
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ startDate, endDate }),
        }
      );

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          if (
            errorData.error !==
            "A meal plan with the same start and end dates already exists."
          ) {
            throw new Error("Failed to create meal plan");
          }
        }
      }

      navigate("/meal-plan");
    } catch (error) {
      console.error("Error handling meal plan: ", error);
      alert("Failed to navigate to meal plan page. Please try again.");
    }
  };

  const NavButton = ({ icon, text, onClick }) => {
    return (
      <div className="navButton" onClick={onClick}>
        {" "}
        {/* Trigger onClick instead of direct path navigation */}
        <FontAwesomeIcon className="navIcon" icon={icon} />
        <h3>{text}</h3>
      </div>
    );
  };

  return (
    <div className="navBar">
      {/* Calendar icon */}
      <div className="firstIconContainer">
        <NavButton
          icon={faCircleUser}
          text="Profile"
          onClick={() => navigate("/profile")}
        />{" "}
        {/* Add a path for the Profile page */}
      </div>
      <div className="otherIcons">
        <NavButton
          icon={faCalendar}
          text="Meal Plan"
          onClick={handleMealPlanClick}
        />{" "}
        {/* Handle meal plan click */}
        <NavButton
          icon={faBookOpen}
          text="Recipes"
          onClick={() => navigate("/recipes")}
        />{" "}
        {/* Path for Recipes */}
        <NavButton
          icon={faCarrot}
          text="Pantry"
          onClick={() => navigate("/pantry")}
        />{" "}
        {/* Path for Pantry */}
        <button onClick={handleLogout}>Logout</button> {/* Logout button */}
      </div>
    </div>
  );
};

export default NavBar;
