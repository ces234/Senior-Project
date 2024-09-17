import React, { useEffect, useState } from 'react';

const RecipeSuggestionPage = () => {
    const [recipes, setRecipes] = useState([]);   // State for storing recipes
    const [query, setQuery] = useState('');       // State for search query
    const [searchResults, setSearchResults] = useState([]); // State for search results

    // Fetch random recipes on component load
    useEffect(() => {
        fetch('http://localhost:8000/recipes/random-recipes/')
            .then(response => response.json())
            .then(data => setRecipes(data))
            .catch(error => console.error('Error fetching recipes:', error));
    }, []);

    // Handle search form submission
    const handleSearch = (event) => {
        event.preventDefault();
        fetch(`http://localhost:8000/recipes/search/?q=${query}`)
            .then(response => response.json())
            .then(data => setSearchResults(data.recipes))  // Set search results based on query
            .catch(error => console.error('Error fetching search results:', error));
    };

    return (
        <div>
            <h1>Random Recipes</h1>
            <ul>
                {recipes.map((recipe, index) => (
                    <li key={index}>
                        {recipe.name} - Prep: {recipe.prep_time} mins, Cook: {recipe.cook_time} mins, Servings: {recipe.servings}
                    </li>
                ))}
            </ul>

            <h2>Search for Recipes</h2>
            {/* Search form */}
            <form onSubmit={handleSearch}>
                <input 
                    type="text" 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                    placeholder="Search by recipe or ingredient" 
                />
                <button type="submit">Search</button>
            </form>

            {/* Display search results */}
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
            )}
        </div>
    );
};

export default RecipeSuggestionPage;
