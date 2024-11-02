import React, { useEffect, useState } from 'react';
import "./RecipeSuggestionPage.css";
import RecipeCard from './RecipeCard';

const RequestedRecipes = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token'); // Get the user's token


    useEffect(() => {
        // Fetch requested recipes for the user's household
        const fetchRequestedRecipes = async () => {
            try {
                const response = await fetch('http://localhost:8000/recipes/household_requests/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch requested recipes');
                }

                const data = await response.json();
                setRequests(data);  // Assuming data is an array of recipe requests
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRequestedRecipes();
    }, []);


    console.log(requests);  

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

   
    return (
        <div className = "requestedRecipes">
            <h2>Requested Recipes</h2>
            {requests.length > 0 ? (
                <ul>
                    {requests.map((request) => (
                        <RecipeCard 
                            title = {request.recipe.name}
                            cookTime = {request.recipe.cook_time}
                            prepTime = {request.recipe.prep_time}
                            recipeId = {request.recipe.id}
                            requestedBy={request.user.username}
                        />
                    ))}
                </ul>
            ) : (
                <p>No requested recipes found for your household.</p>
            )}
        </div>
    );
};

export default RequestedRecipes;
