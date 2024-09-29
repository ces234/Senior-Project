import React, { useEffect, useState } from "react";

import "./MealPlanPage.css";
import Calendar from "./Calendar";
import RecentlyAddedRecipes from "./RecentlyAddedRecipes";

const MealPlanPage = () => {
  const [recipes, setRecipes] = useState([]); // To store recently added recipes
  const [mealPlans, setMealPlans] = useState([]); // To store meal plans
  const [newMealPlan, setNewMealPlan] = useState({
    startDate: "",
    endDate: "",
    selectedRecipes: [],
  });

  useEffect(() => {
    // Fetch recently added recipes
    const fetchRecentlyAddedRecipes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:8000/user/recently-added-recipes/",
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch recently added recipes");
        }

        const fetchedRecipes = await response.json();
        setRecipes(fetchedRecipes);
      } catch (error) {
        console.error("Error fetching recipes: ", error);
        alert("Failed to fetch recipes. Please try again.");
      }
    };

    fetchRecentlyAddedRecipes();

    // Fetch meal plans on mount
    const fetchMealPlans = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:8000/meal-plan/view-meal-plans/",
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch meal plans");
        }

        const fetchedMealPlans = await response.json();
        setMealPlans(fetchedMealPlans);
      } catch (error) {
        console.error("Error fetching meal plans: ", error);
        alert("Failed to fetch meal plans. Please try again.");
      }
    };

    fetchMealPlans();
  }, []); // Fetch data once on mount




  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMealPlan((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission to create a new meal plan
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8000/meal-plan/create-meal-plan/",
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMealPlan),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create meal plan");
      }

      const newMealPlanResponse = await response.json();
      setMealPlans((prevPlans) => [...prevPlans, newMealPlanResponse]);
      alert("Meal plan created successfully!");
      setNewMealPlan({ startDate: "", endDate: "", selectedRecipes: [] });
    } catch (error) {
      console.error("Error creating meal plan: ", error);
      alert("Failed to create meal plan. Please try again.");
    }
  };

  // Render meal plan for each day, showing breakfast, lunch, and dinner
  const renderMealPlanForDay = (day, meals, mealPlanId) => {
    const mealTypes = ["breakfast", "lunch", "dinner"];

    return mealTypes.map((mealType) => {
      const meal = meals.find((m) => m.meal_type === mealType);
      return (
        <div key={mealType}>
          <strong>
            {mealType.charAt(0).toUpperCase() + mealType.slice(1)}:{" "}
          </strong>
          {meal ? (
            <>
              {meal.recipe_name}
              <button onClick={() => alert(`Edit ${mealType} for ${day}`)}>
                Edit
              </button>
            </>
          ) : (
            <>
              <span>No meal selected</span>
              <button
                onClick={() => {
                  const recipeId = newMealPlan.selectedRecipes[0]; // Assuming you want to add the first selected recipe
                  handleAddRecipe(mealPlanId, recipeId, day, mealType);
                }}
              >
                Add
              </button>
            </>
          )}
        </div>
      );
    });
  };

  const handleAddRecipe = async (mealPlanId, recipeId, day, mealType) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/meal-plan/add-recipe/${mealPlanId}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ recipe_id: 1, day, meal_type: mealType }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add recipe");
      }

      const data = await response.json();
      alert("Recipe added successfully!");
      // Optionally refresh the meal plans or update the state
    } catch (error) {
      console.error("Error adding recipe:", error);
      alert("Failed to add recipe. Please try again.");
    }
  };

  const onRecipeDrop = (recipeId, day, mealType) => {
    console.log(`Dropped recipeId ${recipeId} on ${day} for ${mealType}`);
  }

  

  return (
    <div className="mealPlanPageContainer">
      <div className="header">
        <h1>Meal Plan</h1>
      </div>
      <div className="mealPlanPageContent">
        <Calendar onRecipeDrop={onRecipeDrop}/>
        <RecentlyAddedRecipes 
        recipes = {recipes}/> 
      </div>
    </div>
  );

  // return (
  //     <div>
  //         <h2>Meal Plan Page</h2>
  //         <h3>Recently Added Recipes</h3>
  //         {recipes.length > 0 ? (
  //             recipes.map((recipe) => (
  //                 <div key={recipe.id} onClick={() => handleRecipeSelection(recipe.id)}>
  //                     <RecipeCard
  //                         recipeId={recipe.id}
  //                         image={chicken}
  //                         title={recipe.name}
  //                         cookTime={recipe.cook_time}
  //                         prepTime={recipe.prep_time}
  //                     />
  //                     {newMealPlan.selectedRecipes.includes(recipe.id) && <span>Selected</span>}
  //                 </div>
  //             ))
  //         ) : (
  //             <p>No recently added recipes available.</p>
  //         )}

  //         <h3>Create New Meal Plan</h3>
  //         <form onSubmit={handleSubmit}>
  //             <label>
  //                 Start Date:
  //                 <input
  //                     type="date"
  //                     name="startDate"
  //                     value={newMealPlan.startDate}
  //                     onChange={handleInputChange}
  //                     required
  //                 />
  //             </label>
  //             <br />
  //             <label>
  //                 End Date:
  //                 <input
  //                     type="date"
  //                     name="endDate"
  //                     value={newMealPlan.endDate}
  //                     onChange={handleInputChange}
  //                     required
  //                 />
  //             </label>
  //             <br />
  //             <button type="submit">Create Meal Plan</button>
  //         </form>

  //         <h3>Existing Meal Plans</h3>
  //         {mealPlans.length > 0 ? (
  //             mealPlans.map((plan) => {
  //                 const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  //                 return (
  //                     <div key={plan.id}>
  //                         <h4>Meal Plan from {plan.start_date} to {plan.end_date}</h4>
  //                         {daysOfWeek.map((day) => (
  //                             <div key={day}>
  //                                 <h5>{day}</h5>
  //                                 {renderMealPlanForDay(day, plan.mealplanrecipe_set.filter(m => m.day === day))}
  //                             </div>
  //                         ))}
  //                     </div>
  //                 );
  //             })
  //         ) : (
  //             <p>No meal plans available.</p>
  //         )}
  //     </div>
  // );
};

export default MealPlanPage;
