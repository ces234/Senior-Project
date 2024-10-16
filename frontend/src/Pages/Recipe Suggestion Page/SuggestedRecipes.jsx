import "./RecipeSuggestionPage.css";
import React, { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard";
import chicken from "../../photos/chicken.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesRight,
  faChevronRight,
  faAnglesLeft,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

const SuggestedRecipes = () => {
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const recipesPerPage = 16; // Set how many recipes per page
  const [searchResults, setSearchResults] = useState([]); // State for search results
  const [totalPages, setTotalPages] = useState(1); // Track total pages
  const [recipes, setRecipes] = useState([]); // State for storing random recipes
  const [query, setQuery] = useState(""); // State for search query


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchRecipes(pageNumber, query); // Pass the query along with the page number
  };

  // Handle search form submission
  const handleSearch = (event) => {
    event.preventDefault();
    setCurrentPage(1); // Reset to first page on search
    fetchRecipes(1, query); // Fetch results for the first page of the search
  };

  useEffect(() => {
    fetchRecipes(currentPage); // Fetch random recipes on mount
  }, []);

  const fetchRecipes = (pageNumber, query = "") => {
    const url = query
      ? `http://localhost:8000/recipes/search/?q=${query}&page=${pageNumber}&pageSize=${recipesPerPage}`
      : `http://localhost:8000/recipes/random-recipes/?page=${pageNumber}&pageSize=${recipesPerPage}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (query) {
          setSearchResults(data.recipes);
          setTotalPages(data.total_pages); // Make sure to set total pages here
        } else {
          setRecipes(data.recipes);
          setTotalPages(data.total_pages); // Set total pages for random recipes too
        }
      })
      .catch((error) => console.error("Error fetching recipes:", error));
  };


  const getPaginationRange = () => {
    const maxPageDisplay = 5; // Maximum number of pagination bubbles to display

    let startPage = Math.max(1, currentPage - Math.floor(maxPageDisplay / 2));
    let endPage = Math.min(
      totalPages,
      currentPage + Math.floor(maxPageDisplay / 2)
    );

    // Adjust start and end page when at the beginning of the pagination
    if (currentPage <= Math.floor(maxPageDisplay / 2)) {
      endPage = Math.min(totalPages, maxPageDisplay);
      startPage = 1;
    }

    // Adjust start and end page when at the end of the pagination
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

  return (
    <div className="suggestedRecipesContainer">
        <div className="SRCHeader">
          <div className="SRCHeaderSearchBar">
            <form className="SRCHeaderSearchBar" onSubmit={handleSearch}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search recipes or ingredients..."
              />
              {/* <button type="submit" onClick={handleSearch}>
                                    Search
                              </button> */}
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
                className={`paginationBubble ${
                  page === currentPage ? "active" : ""
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="rightOnceButton"
              onClick={() =>
                handlePageChange(Math.min(currentPage + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
            <button
              className="rightMultipleButton"
              onClick={() =>
                handlePageChange(Math.min(currentPage + 5, totalPages))
              }
              disabled={currentPage > totalPages - 5}
            >
              <FontAwesomeIcon icon={faAnglesRight} />
            </button>
          </div>
        </div>
        <div className="SRCSuggested">
          {searchResults.length > 0
            ? // Display search results if they exist
              searchResults.map((recipe, index) => (

                  <RecipeCard
                    key={index}
                    image={chicken}
                    title={recipe.name}
                    cookTime={recipe.cook_time}
                    prepTime={recipe.prep_time}
                    recipeId={recipe.id}
                  />
              ))
            : // Otherwise, display random recipes
              recipes.map((recipe, index) => (
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
              className={`paginationBubble ${
                page === currentPage ? "active" : ""
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="rightOnceButton"
            onClick={() =>
              handlePageChange(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
          <button
            className="rightMultipleButton"
            onClick={() =>
              handlePageChange(Math.min(currentPage + 5, totalPages))
            }
            disabled={currentPage > totalPages - 5}
          >
            <FontAwesomeIcon icon={faAnglesRight} />
          </button>
        </div>
      </div>
  );
};

export default SuggestedRecipes;
