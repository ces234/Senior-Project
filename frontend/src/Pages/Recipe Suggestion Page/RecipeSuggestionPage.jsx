import React, { useEffect, useState } from "react";
import "./RecipeSuggestionPage.css";
import RecipeCard from "./RecipeCard";
import chicken from "../../photos/chicken.webp";

const RecipeSuggestionPage = () => {
  const [recipes, setRecipes] = useState([]); // State for storing recipes
  const [query, setQuery] = useState(""); // State for search query
  const [searchResults, setSearchResults] = useState([]); // State for search results
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [openDropdowns, setOpenDropdowns] = useState({});

  // Fetch random recipes on component load
  useEffect(() => {
    fetch("http://localhost:8000/recipes/random-recipes/")
      .then((response) => response.json())
      .then((data) => {
        setRecipes(data);
        console.log(data);
      })
      .catch((error) => console.error("Error fetching recipes:", error));

    fetch("http://localhost:8000/recipes/categories/")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  // Handle search form submission
  const handleSearch = (event) => {
    event.preventDefault();

    const categoryParams = selectedCategories
      .map((id) => `categories=${id}`)
      .join("&");
    const url = `http://localhost:8000/recipes/search/?q=${query}&${categoryParams}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => setSearchResults(data.recipes)) // Set search results based on query
      .catch((error) => console.error("Error fetching search results:", error));
  };

  const handleCategoryChange = (event) => {
    const categoryId = parseInt(event.target.value);
    if (event.target.checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    }
  };

  const categoryLists = {
    breakfast: ["cereal", "pancakes", "waffles"],
    lunch: ["sandwich", "salad", "soup"],
    dinner: ["steak", "burger", "spaghetti"],
    dessert: ["cookies", "cupcakes", "pie"],
  };

  const parentCategories = Object.keys(categoryLists);

  const toggleDropdown = (parentCategory) => {
    setOpenDropdowns((prevState) => ({
      ...prevState,
      [parentCategory]: !prevState[parentCategory], // Toggle open/close state
    }));
  };

  return (
    <div className="recipeSuggestionPageContainer">
      <div className="suggestedRecipesContainer">
        <div className="SRCHeader">
          <div className="SRCHeaderSearchBar">Search Bar</div>
          <div classNmae="SRCHeaderPagination">Paginator</div>
        </div>
        <div className="SRCSuggested">
          {recipes.map((recipe, index) => (
            <RecipeCard
              recipeId={recipe.id}
              image={chicken}
              title={recipe.name}
              cookTime={recipe.cook_time}
              prepTime={recipe.prep_time}
            ></RecipeCard>
          ))}
        </div>

        <div className="SRCFooter">Footer</div>
      </div>
      <div className="recipeFilteringContainer">
        <div className="innerFilterContainer">
          <h2 className="filterHeader">Filter By Category</h2>

          {Object.keys(categoryLists).map((parentCategory) => (
            <div key={parentCategory} className="parentCategoryContainer">
              {/* Parent category clickable element */}
              <button
                onClick={() => toggleDropdown(parentCategory)}
                className="parentCategoryButton"
              >
                <span className="arrow">
                  {openDropdowns[parentCategory] ? "▼" : "►"}{" "}
                  {/* Down arrow when open, right arrow when closed */}
                </span>
                {parentCategory}
              </button>

              {/* Conditionally render child categories based on dropdown state */}
              {openDropdowns[parentCategory] && (
                <div className="childCategoryContainer">
                  {categoryLists[parentCategory].map((category) => (
                    <div key={category} className="categoryContainer">
                      <label>
                        <input
                          type="checkbox"
                          value={category}
                          onChange={handleCategoryChange}
                        />
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* {parentCategories.map((category) => (
                        <div key={category} className="categoryContainer">
                            <button
                                onClick={() => toggleDropdown(category)}
                                className="categoryButton"
                            >
                                {category}
                            </button>


                            {openDropdowns[category] && (
                                <div className="subcategoryDropdown">
                                    {subCategories[category].map((subCategory) => (
                                        <div key={subCategory} className="subcategoryOption">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    value={subCategory}
                                                    onChange={() => {
                                                        // Handle subcategory selection
                                                    }}
                                                />
                                                {subCategory}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )} */}

      {/* <h1>Random Recipes</h1>
            <ul>
                {recipes.map((recipe, index) => (
                    <li key={index}>
                        {recipe.name} - Prep: {recipe.prep_time} mins, Cook: {recipe.cook_time} mins, Servings: {recipe.servings}
                    </li>
                ))}
            </ul>

            <h2>Search for Recipes<s/h2>

            <form onSubmit={handleSearch}>
                <input 
                    type="text" 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                    placeholder="Search by recipe or ingredient" 
                />
                <div>
                    <h3>Filter by Categories</h3>
                    {categories.map(category => (
                        <label key = {category.id}>
                            <input 
                                type="checkbox"
                                value = {category.id}
                                onChange = {handleCategoryChange} 
                            />
                            {category.name}
                        </label>
                    ))}
                </div>
                <button type="submit">Search</button>
            </form>


            {searchResults.length > 0 && (
                <div>
                    <h3>Search Results</h3>
                    <ul>
                        {searchResults.map((recipe, index) => (
                            <li key={index}>
                                {recipe.name} - Prep: {recipe.prep_time} mins, Cook: {recipe.cook_time} mins, Servings: {recipe.servings}
                            </li>
                        ))}
                    </ul>
                </div>
            )} */}
    </div>
  );
};

export default RecipeSuggestionPage;
