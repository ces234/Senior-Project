import React, { useEffect, useState } from 'react';
import "./RecipeSuggestionPage.css";
import RecipeCard from './RecipeCard';

const RequestedRecipes = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    const fetchRequestedRecipes = async () => {
        try {
            setLoading(true);
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
            setRequests(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data when the component mounts
    useEffect(() => {
        fetchRequestedRecipes();
    }, []);

    // Function to refresh the list after an update
    const handleUpdate = () => {
        fetchRequestedRecipes();
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="requestedRecipes">
            <h2>Requested Recipes</h2>
            {requests.length > 0 ? (
                <ul className = "requestGrid">
                    {requests.map((request) => (
                        <RecipeCard 
                            key={request.id} // Add a unique key
                            requestId={request.id}
                            title={request.recipe.name}
                            cookTime={request.recipe.cook_time}
                            prepTime={request.recipe.prep_time}
                            recipeId={request.recipe.id}
                            requestedBy={request.user.username}
                            onUpdate={handleUpdate} // Pass the function as a prop
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
