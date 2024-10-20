import "./GroceryListPage.css";
import { useAuth } from "../../AuthContext";
import React, { useState, useEffect } from "react";

const GroceryListPage = () => {
  const { user, logout } = useAuth();
  const [groceryList, setGroceryList] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

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
      setGroceryList(fetchedList);
    } catch (error) {
      console.error("Error fetching grocery list: ", error);
      alert("Failed to fetch list. Please try again.");
    }
  };

  // useEffect to fetch grocery list on component mount
  useEffect(() => {
    fetchGroceryList();
    console.log(groceryList);
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

      if (!response.ok)
        throw new Error("Failed to add ingredient to grocery list.");

      // Refetch the grocery list after adding the ingredient
      fetchGroceryList(); // Refresh the list
    } catch (error) {
      console.error("Error adding ingredient to grocery list: ", error);
    }
  };

  const removeIngredient = async (ingredientId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://localhost:8000/grocery/remove-ingredient/",
        {
          method: "POST", // Could be DELETE if you choose to use it
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ ingredient_id: ingredientId }),
        }
      );

      if (!response.ok) throw new Error("Failed to remove ingredient.");

      // Refetch the grocery list after removing the ingredient
    } catch (error) {
      console.error("Error removing ingredient: ", error);
    }
  };

  // return (
  //   <div>
  //     <h1>Grocery List</h1>

  //     <div>
  //       <input
  //         type="text"
  //         placeholder="Search ingredient..."
  //         value={searchTerm}
  //         onChange={(e) => setSearchTerm(e.target.value)}
  //       />
  //       <button onClick={handleSearch}>Search</button>
  //       {searchResults.length > 0 && (
  //         <div className="dropdown">
  //           <ul className="dropdown-list">
  //             {searchResults.map((ingredient) => (
  //               <li key={ingredient.id} className="dropdown-item">
  //                 {ingredient.name}{" "}
  //                 <button onClick={() => addToGroceryList(ingredient)}>
  //                   Add
  //                 </button>
  //               </li>
  //             ))}
  //           </ul>
  //         </div>
  //       )}
  //     </div>
  //     <div>
  //       {groceryList && (
  //         <div>
  //           <ul>
  //             {groceryList.ingredients.map((ingredient) => (
  //               <li key={ingredient.id}>
  //                 {ingredient.name}
  //                 <button onClick={() => removeIngredient(ingredient.id)}>
  //                 Remove
  //               </button>
  //               </li>
  //             ))}
  //           </ul>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );
  //};
  const [items, setItems] = useState([
    { id: 1, name: "Eggs", checked: false },
    { id: 2, name: "Milk", checked: false },
  ]);
  const [editIndex, setEditIndex] = useState(null);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
    unit: "",
    notes: "",
  });

  const handleCheckboxChange = (index, ingredientId) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, checked: !item.checked } : item
    );
    setItems(updatedItems);
    removeIngredient(ingredientId);
  };

  const handleEditItem = (index) => {
    setEditIndex(index);
    const itemToEdit = items[index];
    setNewItem(itemToEdit);
  };

  const handleSaveItem = () => {
    const updatedItems = items.map((item, i) =>
      i === editIndex ? { ...item, ...newItem } : item
    );
    setItems(updatedItems);
    setEditIndex(null);
    setNewItem({ name: "", quantity: "", unit: "", notes: "" });
  };

  const handleRemoveItem = (ingredientId) => {
    const updatedItems = items.filter((_, i) => i !== editIndex);
    setItems(updatedItems);
    setEditIndex(null);
    removeIngredient(ingredientId);
    };

  const handleIngredientClick = (ingredient) => {
    setSearchTerm(ingredient.name); // Populate the search bar with the selected ingredient
    setSearchResults([]); // Hide the dropdown
    setSelectedItem(ingredient);
  };

  return (
    <div className="groceryListPage">
      <div className="mainContainer">
        <div className="filtersAndListContainer">
          <div className="GLHeader">
            <div className="GLHeaderSearchBar">
              <span className="GLHeaderLabel"></span>
              <input
                type="text"
                placeholder="Filter items..."
                className="filterInput"
              />
            </div>
          </div>
          <div className="filtersContainer">
            <div className="filterButtons">
              <button className="filterButton">Produce</button>
              <button className="filterButton">Fruit</button>
              <button className="filterButton">Grains</button>
            </div>
          </div>
          <div className="groceryListContainer">
            <ul className="groceryList">
              {groceryList && groceryList.ingredients ? (
                groceryList.ingredients.map((item, index) => (
                  <li
                    key={item.id}
                    className="groceryListItem"
                    onClick={() => handleEditItem(index)}
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handleCheckboxChange(index, item.id)}
                    />
                    <span className={item.checked ? "checked" : ""}>
                      {item.name}
                    </span>
                    <hr />
                  </li>
                ))
              ) : (
                <p>Loading grocery list...</p>
              )}
            </ul>
          </div>
        </div>
        <div className="addItemContainer">
          <h3>Add Item</h3>
          <div className="formGroup">
            <label>Item Name:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyUp={handleSearch}
            />
          </div>
          {searchResults.length > 0 && (
            <div className="dropdown">
              <ul className="dropdown-list">
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
          {/* <div className="formGroup">
            <label>Item Quantity:</label>
            <input
              type="text"
              value={newItem.quantity}
              onChange={(e) =>
                setNewItem({ ...newItem, quantity: e.target.value })
              }
            />
          </div>
          <div className="formGroup">
            <label>Item Unit:</label>
            <input
              type="text"
              value={newItem.unit}
              onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
            />
          </div> */}
          {/* <div className="formGroup">
            <label>Notes:</label>
            <textarea
              value={newItem.notes}
              onChange={(e) =>
                setNewItem({ ...newItem, notes: e.target.value })
              }
            ></textarea>
          </div> */}
          <div className="buttonGroup">
            <button className="removeButton" onClick={handleRemoveItem}>
              Remove
            </button>
            <button
              className="addButton"
              onClick={() => addToGroceryList(selectedItem)}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroceryListPage;
