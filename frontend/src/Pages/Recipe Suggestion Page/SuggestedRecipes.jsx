import "./RecipeSuggestionPage.css";
import React, { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard";
import chicken from "../../photos/chicken.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RequestedRecipes from "./RequestedRecipes";
import {
  faAnglesRight,
  faChevronRight,
  faAnglesLeft,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

const SuggestedRecipes = ({ query, categories, setQuery, onRefinedSearch, searchResults, setSearchResults}) => {
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const recipesPerPage = 16; // Set how many recipes per page
  const [totalPages, setTotalPages] = useState(1); // Track total pages
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [noResults, setNoResults] = useState(true); 

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchRecipes(pageNumber, query); // Pass the query along with the page number
  };

  // Handle search form submission
  const handleSearch = (event) => {
    event.preventDefault();
    setCurrentPage(1); // Reset to first page on search
    if (onRefinedSearch) {
      onRefinedSearch(query, 1, recipesPerPage); // Use refined search function with the query
    } else {
      fetchRecipes(1, query); // Fall back to regular fetch if refined search isn't available
    }
  };

  useEffect(() => {
    fetchRecipes(currentPage); // Fetch random recipes on mount
  }, []);

  const fetchRecipes = (pageNumber, query = "") => {
    setIsLoading(true); // Set loading to true before making the request
    const token = localStorage.getItem('token'); // Get the user's token
    const headers = {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
    };

    const url = `http://localhost:8000/recipes/suggested-recipes/?page=${pageNumber}&pageSize=${recipesPerPage}`;

    fetch(url, { headers })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false); // Set loading to false after data is fetched
        if (query) {
          setSearchResults(data.recipes);
          setNoResults(false);
          setTotalPages(data.total_pages); // Make sure to set total pages here
        } else {
          setRecipes(data.recipes);
          setTotalPages(data.total_pages); // Set total pages for random recipes too
          setNoResults(true);
        }
      })
      .catch((error) => {
        setIsLoading(false); // Set loading to false in case of error
        console.error("Error fetching recipes:", error);
      });
  };

  const getPaginationRange = () => {
    const maxPageDisplay = 5; // Maximum number of pagination bubbles to display
    let startPage = Math.max(1, currentPage - Math.floor(maxPageDisplay / 2));
    let endPage = Math.min(totalPages, currentPage + Math.floor(maxPageDisplay / 2));

    if (currentPage <= Math.floor(maxPageDisplay / 2)) {
      endPage = Math.min(totalPages, maxPageDisplay);
      startPage = 1;
    }

    if (currentPage > totalPages - Math.floor(maxPageDisplay / 2)) {
      startPage = Math.max(1, totalPages - maxPageDisplay + 1);
      endPage = totalPages;
    }

    const pageRange = [];
    for (let i = startPage; i <= endPage; i++) {
      pageRange.push(i);
    }

    return pageRange;
  };

  console.log("SEARCH RESULTS: ", searchResults);

  // Ensure that searchResults and recipes are always arrays
  const validSearchResults = Array.isArray(searchResults) ? searchResults : [];
  console.log("valid search results? ", validSearchResults);
  const validRecipes = Array.isArray(recipes) ? recipes : [];

  return (
    <div className="suggestedRecipesContainer">
      <RequestedRecipes />
      <div className="SRCHeader">
        <div className="SRCHeaderSearchBar">
          <form className="SRCHeaderSearchBar" onSubmit={handleSearch}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search recipes or ingredients..."
            />
          </form>
        </div>
        {/* Pagination */}
        <div className="SRCHeaderPagination">
          <button
            className="leftMultipleButton"
            onClick={() => handlePageChange(Math.max(currentPage - 5, 1))}
            disabled={currentPage <= 5}
          >
            <FontAwesomeIcon icon={faAnglesLeft} />
          </button>
          <button
            className="leftOnceButton"
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          {getPaginationRange().map((page) => (
            <button
              key={page}
              className={`paginationBubble ${page === currentPage ? "active" : ""}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="rightOnceButton"
            onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
          <button
            className="rightMultipleButton"
            onClick={() => handlePageChange(Math.min(currentPage + 5, totalPages))}
            disabled={currentPage > totalPages - 5}
          >
            <FontAwesomeIcon icon={faAnglesRight} />
          </button>
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading ? (
        <div className="loadingIndicator">Loading...</div> // Add your loading indicator here
      ) : (
        <div className="SRCSuggested">
          {validSearchResults.length > 0
            ? validSearchResults.map((recipe, index) => (
                <RecipeCard
                  key={index}
                  image={chicken}
                  title={recipe.name}
                  cookTime={recipe.cook_time}
                  prepTime={recipe.prep_time}
                  recipeId={recipe.id}
                />
              ))
            : validRecipes.map((recipe, index) => (
                <RecipeCard
                  key={index}
                  image={chicken}
                  title={recipe.name}
                  cookTime={recipe.cook_time}
                  prepTime={recipe.prep_time}
                  recipeId={recipe.id}
                />
              ))}
        </div>
      )}
      
      <div className="SRCFooter">
        <button
          className="leftMultipleButton"
          onClick={() => handlePageChange(Math.max(currentPage - 5, 1))}
          disabled={currentPage <= 5}
        >
          <FontAwesomeIcon icon={faAnglesLeft} />
        </button>
        <button
          className="leftOnceButton"
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        {getPaginationRange().map((page) => (
          <button
            key={page}
            className={`paginationBubble ${page === currentPage ? "active" : ""}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
        <button
          className="rightOnceButton"
          onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
        <button
          className="rightMultipleButton"
          onClick={() => handlePageChange(Math.min(currentPage + 5, totalPages))}
          disabled={currentPage > totalPages - 5}
        >
          <FontAwesomeIcon icon={faAnglesRight} />
        </button>
      </div>
    </div>
  );
};

export default SuggestedRecipes;
