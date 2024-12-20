import "./MealPlanPage.css";
import RecipeCard from "../Recipe Suggestion Page/RecipeCard";
import chicken from "../../photos/chicken.webp";

const RecentlyAddedRecipes = ({ recipes, onRecipeDrop, onDragStart, onDelete}) => {

  
  return (
    <div className="mealPlanRight">
      <h3>Recently Added Recipes</h3>
      <div className="recentlyAddedRecipesContainer">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipeId={recipe.id}
              image={chicken}
              title={recipe.name}
              cookTime={recipe.cook_time}
              prepTime={recipe.prep_time}
              draggable
              onDragStart={(e) => onDragStart(e, recipe.id)} // Ensure the correct ID is passed
              onDeleteRecentlyAdded  = {onDelete}
            />
          ))
        ) : (
          <p>No recently added recipes available.</p>
        )}
      </div>
    </div>
  );
};

export default RecentlyAddedRecipes;
