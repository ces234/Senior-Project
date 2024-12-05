import React, { useEffect, useState } from "react";
import "./MealPlanPage.css";
import Calendar from "./Calendar";
import RecentlyAddedRecipes from "./RecentlyAddedRecipes";
import { useLocation } from "react-router-dom";
import DateDisplay from "./DateDispaly";
import { useAuth } from "../../AuthContext";

const MealPlanPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [newMealPlan, setNewMealPlan] = useState({
    startDate: "",
    endDate: "",
    selectedRecipes: [],
  });
  const [error, setError] = useState(""); // Add state for error handling
  const [loading, setLoading] = useState(false); // Add state for loading indication
  const [currentPlan, setCurrentPlan] = useState(null);
  const location = useLocation();
  const { user, logout } = useAuth();
  const [currentRecipes, setCurrentRecipes] = useState([]);
  const token = localStorage.getItem("token");

  const handleDragStart = (e, recipeId) => {
    e.dataTransfer.setData("recipeId", recipeId);
  };


  useEffect(() => {
    if (location.state?.mealPlan) {
      setCurrentPlan(location.state.mealPlan);
    } else {
      setCurrentPlan({ start_date: "N/A", end_date: "N/A" });
    }
  }, [location.state]);

  useEffect(() => {
    const fetchRecentlyAddedRecipes = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          "http://localhost:8000/user/recently-added-recipes/",
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch recipes");
        const fetchedRecipes = await response.json();
        setRecipes(fetchedRecipes);
      } catch (error) {
        console.error("Error fetching recipes: ", error);
        alert("Failed to fetch recipes. Please try again.");
      }
    };

    const fetchMealPlans = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/meal-plan/view-meal-plans/",
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch meal plans");
        const fetchedMealPlans = await response.json();
        setMealPlans(fetchedMealPlans);
      } catch (error) {
        console.error("Error fetching meal plans: ", error);
        alert("Failed to fetch meal plans. Please try again.");
      }
    };



   
    fetchRecentlyAddedRecipes();
    fetchMealPlans();


  }, []);


  const handleDeleteRecipeRecentlyAdded = async (recipeId) => {
    try {
      const response = await fetch(`http://localhost:8000/user/recently_added/delete/${recipeId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete recipe with ID ${recipeId}: ${response.statusText}`);
      }

      // Update the state to remove the recipe
      setRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe.id !== recipeId)
      );
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };
  

  useEffect(() => {
    if (currentPlan) {
      fetchMealPlanRecipes();
    }
  }, [currentPlan]);
  
  // Move this function outside of useEffect so it can be reused
  const fetchMealPlanRecipes = async () => {
    if (!currentPlan || currentPlan.start_date === "N/A" || currentPlan.end_date === "N/A") {
      console.log("Invalid current plan. Skipping recipe fetch.");
      return;
    }
  
    try {
      const url = `http://localhost:8000/meal-plan/get-meal-plan-recipes?start_date=${currentPlan.start_date}&end_date=${currentPlan.end_date}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
        },
      });
  
      if (!response.ok) throw new Error("Failed to fetch meal plan recipes");
  
      const fetchedMealPlanRecipes = await response.json();
      setCurrentRecipes(fetchedMealPlanRecipes);
    } catch (error) {
      console.log("Error fetching meal plan recipes:", error);
    }
  };
  


  const onRecipeDrop = async (recipeId, day, mealType) => {
    try {
      const token = localStorage.getItem("token");

      console.log("recipe id: ", recipeId);
      console.log("day: ", day);
      console.log("meal_ type: ", mealType);

      const response = await fetch(
        `http://localhost:8000/meal-plan/add-recipe/${currentPlan.id}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipe_id: recipeId,
            day,
            meal_type: mealType,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to add recipe");
      console.log("recipe added successfully");
      fetchMealPlanRecipes();
    } catch (error) {
      console.error("Errror adding recipe: ", error);
    }
  };

  const handleNext = async () => {
    try {
      const currentStart = new Date(currentPlan.start_date);
      const currentEnd = new Date(currentPlan.end_date);

      // Calculate the next week's start and end dates
      const nextStart = new Date(currentStart);
      nextStart.setDate(currentStart.getDate() + 7); // Add 7 days for next start date

      const nextEnd = new Date(currentEnd);
      nextEnd.setDate(currentEnd.getDate() + 7); // Add 7 days for next end date

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
            start_date: nextStart.toISOString().split("T")[0], // Format the date to YYYY-MM-DD
            end_date: nextEnd.toISOString().split("T")[0],
            user: user, // Assuming user object has an id
          }),
        }
      );

      let mealPlanData = {};
      if (response.ok) {
        mealPlanData = await response.json();
        setCurrentPlan(mealPlanData);
      } else if (response.status === 400) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create meal plan");
      }
    } catch (error) {
      console.error("Error handling meal plan: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = async () => {
    try {
      const currentStart = new Date(currentPlan.start_date);
      const currentEnd = new Date(currentPlan.end_date);

      // Calculate the previous week's start and end dates
      const previousStart = new Date(currentStart);
      previousStart.setDate(currentStart.getDate() - 7); // Subtract 7 days for previous start date

      const previousEnd = new Date(currentEnd);
      previousEnd.setDate(currentEnd.getDate() - 7); // Subtract 7 days for previous end date

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
            start_date: previousStart.toISOString().split("T")[0], // Format the date to YYYY-MM-DD
            end_date: previousEnd.toISOString().split("T")[0],
            user: user, // Assuming user object has an id
          }),
        }
      );

      let mealPlanData = {};
      if (response.ok) {
        mealPlanData = await response.json();
        setCurrentPlan(mealPlanData);
      } else if (response.status === 400) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create meal plan");
      }
    } catch (error) {
      console.error("Error handling meal plan: ", error);
    } finally {
      setLoading(false);
    }
  };

  const updateGroceries = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/meal-plan/generate-grocery-list/`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            meal_plan_id: currentPlan.id,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to generate grocyer list.");
      
    } catch (error) {
      console.error("Errror adding grocery list: ", error);
    }
  };

  const removeRecipeFromMealPlan = async (mealPlanId, recipeId, meal, day) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8000/meal-plan/${mealPlanId}/remove-recipe/${recipeId}/`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ 
          "meal_type":meal, 
          "day": day }), // Send meal and day in the body
      });
  
      if (!response.ok) {
        throw new Error("Failed to remove recipe from meal plan");
      }
  
      const data = await response.json();
      fetchMealPlanRecipes(); // Call the function to refresh the recipes

    } catch (error) {
      console.error("Error removing recipe: ", error);
    }
  };
  
  

  return (
    <div className="mealPlanPageContainer">
  <div className="header">
    <h1>Meal Plan</h1>
    <DateDisplay
      currentPlan={currentPlan}
      handleNext={handleNext}
      handlePrevious={handlePrevious}
    />
  </div>
  <div className="mealPlanPageContent">
    {/* Only render Calendar if currentPlan and currentPlan.id exist */}
    {currentPlan && currentPlan.id ? (
      <Calendar
        onRecipeDrop={onRecipeDrop}
        currentRecipes={currentRecipes}
        onDragStart={handleDragStart}
        handleRemoveRecipe={removeRecipeFromMealPlan}
        mealPlanId={currentPlan.id}
      />
    ) : (
      <p>Loading meal plan...</p>
    )}
    <RecentlyAddedRecipes recipes={recipes} onDragStart={handleDragStart} onDelete = {handleDeleteRecipeRecentlyAdded} />
  </div>
  <button className="updateGroceriesButton" onClick={updateGroceries}>
    Update Grocery List
  </button>
</div>

  );
};

export default MealPlanPage;