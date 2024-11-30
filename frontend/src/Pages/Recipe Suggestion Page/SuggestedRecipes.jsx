import React, { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";
import RecipeCard from "./RecipeCard";
import chicken from "../../photos/chicken.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BarLoader } from "react-spinners";
import worldIcon from "../../photos/logo/worldIcon.png";
import RequestedRecipes from "./RequestedRecipes";
import {
  faAnglesRight,
  faChevronRight,
  faAnglesLeft,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import "./SuggestedRecipes.css";

const SuggestedRecipes = ({ query, categories, setQuery, onRefinedSearch, searchResults, setSearchResults }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 16;
  const [totalPages, setTotalPages] = useState(1);
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(true);
  
  const { user } = useAuth(); // Access user context
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchRecipes(pageNumber, query);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setCurrentPage(1);
    if (onRefinedSearch) {
      onRefinedSearch(query, 1, recipesPerPage);
    } else {
      fetchRecipes(1, query);
    }
  };

  useEffect(() => {
    fetchRecipes(currentPage);
  }, []);

  const fetchRecipes = (pageNumber, query = "") => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    };

    const url = `http://localhost:8000/recipes/suggested-recipes/?page=${pageNumber}&pageSize=${recipesPerPage}`;

    fetch(url, { headers })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        if (query) {
          setSearchResults(data.recipes);
          setNoResults(false);
          setTotalPages(data.total_pages);
        } else {
          setRecipes(data.recipes);
          setTotalPages(data.total_pages);
          setNoResults(true);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error fetching recipes:", error);
      });
  };

  const getPaginationRange = () => {
    const maxPageDisplay = 5;
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

  // Ensure that searchResults and recipes are always arrays
  const validSearchResults = Array.isArray(searchResults) ? searchResults : [];
  const validRecipes = Array.isArray(recipes) ? recipes : [];

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

      {/* Render RequestedRecipes only if the user is an admin */}
      {user && user.status === 'admin' && <RequestedRecipes />}

      {/* Loading indicator */}
      {/* {isLoading ? (
        <div className="loadingIndicator">Loading...</div>
      ) : ( */}

        {isLoading ? (
          <div className="loading">
            <img src={worldIcon} style={{ width: '450px', height: '400px', marginBottom: '-100px'}} />
            <BarLoader color="#363F26" width={200} />
          </div>
        ) : (
        <div className="SRCSuggested">
          {/* <div className="loading">
            <img src={worldIcon} style={{ width: '450px', height: '400px', marginBottom: '-100px' }} />
            <BarLoader color="#363F26" width={200} />
          </div> */}

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
