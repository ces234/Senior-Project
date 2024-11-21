import "./RecipeSuggestionPage.css";
import React, { useState } from "react";

import SuggestedRecipes from "./SuggestedRecipes";
import RecipeFiltering from "./RecipeFiltering";


const RecipeSuggestionPage = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]); // State for search results
  const [selectedCategories, setSelectedCategories] = useState([]);



  const fetchRefinedRecipes = () => {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    };

    const categoryParams = selectedCategories.length
      ? `&categories=${selectedCategories.join(",")}`
      : "";
    const searchParam = query ? `q=${query}` : "";
    const url = `http://localhost:8000/recipes/refined-search/?${searchParam}${categoryParams}`;

    fetch(url, { headers })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setSearchResults(data.recipes);
      })
      .catch((error) => console.error("Error fetching recipes:", error));

  }



  return (
    <div className="recipeSuggestionPageContainer">
      <SuggestedRecipes
        query = {query}
        setQuery = {setQuery}
        onRefinedSearch = {fetchRefinedRecipes}
        setSearchResults = {setSearchResults}
        searchResults={searchResults}
      /> 
      <RecipeFiltering
        onRefinedSearch = {fetchRefinedRecipes}
        query = {query}
        searchResults = {searchResults}
        setSearchResults = {setSearchResults}
        selectedCategories = {selectedCategories}
        setSelectedCategories = {setSelectedCategories}
      />
    </div>

  )

 
};

export default RecipeSuggestionPage;
