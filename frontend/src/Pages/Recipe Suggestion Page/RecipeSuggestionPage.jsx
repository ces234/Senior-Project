import "./RecipeSuggestionPage.css";
import React from "react";

import SuggestedRecipes from "./SuggestedRecipes";
import RecipeFiltering from "./RecipeFiltering";


const RecipeSuggestionPage = () => {

  return (
    <div className="recipeSuggestionPageContainer">
      <SuggestedRecipes/> 
      <RecipeFiltering />
    </div>

  )

 
};

export default RecipeSuggestionPage;
