import React, { useState } from "react";
import "./PantryPage.css";
import axios from "axios";

const AddItem = ({ fetchPantryItems }) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [expiration, setExpiration] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleIngredientClick = (ingredient) => {
    setSearchTerm(ingredient.name); // Populate the search bar with the selected ingredient
    setSearchResults([]); // Hide the dropdown
    setSelectedItem(ingredient);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh on form submission

    // Only proceed if an item is selected
    if (!selectedItem) {
      alert("Please select an ingredient.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:8000/pantry/add_pantry_item/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            ingredient_id: selectedItem.id,
            quantity: quantity,
            unit: unit,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to add ingredient to pantry.");

      console.log("Item added successfully.");
      fetchPantryItems(); // Call the function to refresh the pantry items
      setName("");
      setQuantity("");
      setUnit("");
      setExpiration("");
      setSearchTerm("");
      setSearchResults([]);
      setSelectedItem(null); // Clear the selected item after adding
    } catch (error) {
      console.error("Error adding pantry item:", error);
    }
  };

  return (
    <div className="addItemContainer">
      <div className="addItemHeader">
        <h1>Add Item</h1>
        <hr />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="addItemInputs">
          <label htmlFor="name">Name:</label>
          <hr />
          <input
            type="text"
            id="name"
            name="name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyUp={handleSearch}
            placeholder="Item name"
          />
          {searchResults.length > 0 && (
            <div className="dropdown-grocery">
              <ul className="dropdown-list-grocery">
                {searchResults.map((item) => (
                  <li
                    key={item.id}
                    className="dropdown-item"
                    onClick={() => handleIngredientClick(item)} // Select the item
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <label htmlFor="quantity">Quantity:</label>
          <hr />
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity"
          />

          <label htmlFor="unit">Unit:</label>
          <hr />
          <select
            id="unit"
            name="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            <option value="">Select unit</option>
            <option value="cup">Cup</option>
            <option value="tsp">Teaspoon</option>
            <option value="tbsp">Tablespoon</option>
            <option value="kg">Kilogram</option>
            <option value="g">Gram</option>
            <option value="none">None</option>
          </select>

          <button type="submit" className="submitPantryItemButton">
            Add Item
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItem;
