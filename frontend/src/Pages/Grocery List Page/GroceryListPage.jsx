import "./GroceryListPage.css";
import { useAuth } from "../../AuthContext";
import React, { useState, useEffect } from "react";

const GroceryListPage = () => {
  const { user, logout } = useAuth();
  const [groceryList, setGroceryList] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Function to fetch the grocery list
  const fetchGroceryList = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://localhost:8000/grocery/grocery-list/",
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch grocery list");
      const fetchedList = await response.json();
      console.log("list:", fetchedList);
      setGroceryList(fetchedList);
    } catch (error) {
      console.error("Error fetching grocery list: ", error);
      alert("Failed to fetch list. Please try again.");
    }
  };

  // useEffect to fetch grocery list on component mount
  useEffect(() => {
    fetchGroceryList();
  }, []);

  const handleSearch = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:8000/recipes/search-ingredient/?q=${searchTerm}`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to search for ingredient");
      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching ingredient: ", error);
    }
  };

  const addToGroceryList = async (ingredient) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://localhost:8000/grocery/add-ingredient/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            ingredient_id: ingredient.id,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to add ingredient to grocery list.");

      // Refetch the grocery list after adding the ingredient
      fetchGroceryList(); // Refresh the list
    } catch (error) {
      console.error("Error adding ingredient to grocery list: ", error);
    }
  };

  return (
    <div>
      <h1>Grocery List</h1>

      <div>
        <input
          type="text"
          placeholder="Search ingredient..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        {searchResults.length > 0 && (
          <div className="dropdown">
            <ul className="dropdown-list">
              {searchResults.map((ingredient) => (
                <li key={ingredient.id} className="dropdown-item">
                  {ingredient.name}{" "}
                  <button onClick={() => addToGroceryList(ingredient)}>
                    Add
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div>
        {groceryList && (
          <div>
            <ul>
              {groceryList.ingredients.map((ingredient) => (
                <li key={ingredient.id}>{ingredient.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroceryListPage;
