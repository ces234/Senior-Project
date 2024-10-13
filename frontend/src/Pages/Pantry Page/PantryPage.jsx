import { useState, useEffect } from 'react';
import axios from 'axios';
import "./PantryPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react"; // Optional since React 17
import AddItem from "./AddItem";
import EditItem from "./EditItem";


import {
  faEgg,
  faCarrot,
  faPizzaSlice,
  faBurger,
  faLemon,
  faPepperHot,
  faIceCream,
  faDrumstickBite,
  faHotdog,
  faCheese,
  faCookie,
  faAppleWhole,
} from "@fortawesome/free-solid-svg-icons";

const PantryItem = ({ pantryItem, onClick }) => {
  return (
    <div className="pantryItemContainer" onClick={onClick}> {/* Attach onClick here */}
      <div className="ingredientIcon">
        <FontAwesomeIcon icon={getRandomIcon()} className="pantryItemIcon" />
        <div className="ingredientName">{pantryItem.ingredient_name}</div>
      </div>
      <div className="pantryItemDetails">
        <span>{pantryItem.quantity}</span>{" "}
        {pantryItem.unit !== "none" ? <span>{pantryItem.unit}</span> : ""}
      </div>
    </div>
  );
};

const icons = [
  faEgg,
  faCarrot,
  faPizzaSlice,
  faBurger,
  faLemon,
  faPepperHot,
  faIceCream,
  faDrumstickBite,
  faHotdog,
  faCheese,
  faCookie,
  faAppleWhole,
];

const getRandomIcon = () => {
  const randomIndex = Math.floor(Math.random() * icons.length);
  return icons[randomIndex];
};

const PantryPage = () => {

  const [pantryItems, setPantryItems] = useState([]);
  const [showAddItem, setShowAddItem] = useState(false); // State to manage visibility of AddItem component
  const [selectedPantryItem, setSelectedPantryItem] = useState(null);

  const fetchPantryItems = async () => {
    const token = localStorage.getItem('token'); // Get the user's token
    try {
      const response = await axios.get('http://localhost:8000/pantry/items/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data)
      setPantryItems(response.data); // Set the pantry items from the response
    } catch (error) {
      console.error('Error fetching pantry items:', error.response.data);
    }
  };

  useEffect(() => {
    fetchPantryItems(); // Fetch pantry items when the component mounts
  }, []);

  const toggleAddItem = () => {
    if (selectedPantryItem)
      handlePantryItemClick(null);
    setShowAddItem(!showAddItem); // Toggle the visibility of the AddItem component
  };

  const handlePantryItemClick = (pantryItem) => {
    if (showAddItem)
      toggleAddItem();
    setSelectedPantryItem(pantryItem); // Set the selected pantry item
  };

  return (
    <div className="pantryPageContainer">
      <div className="pantryPageContent">
        <div className="pantryHeader">
          <h1>My Pantry</h1>
          <button className="addPantryItemButton" onClick={toggleAddItem}>
            + pantry item
          </button>
        </div>
        <div className="pantryItems">
          {pantryItems.map((pantryItem, index) => (
            <React.Fragment key={index}>
              <PantryItem 
                pantryItem={pantryItem} 
                onClick={() => handlePantryItemClick(pantryItem)} // Handle click on pantry item
              />
              {/* Add a shelf after every 6 items */}
              {(index + 1) % 6 === 0 && <div className="pantryShelf"></div>}
            </React.Fragment>
          ))}

          {/* Add a final shelf after the last row if it's incomplete */}
          {pantryItems.length % 6 !== 0 && <div className="pantryShelf"></div>}
        </div>
      </div>
      <div className="pantrySideBar">
        {showAddItem && <AddItem fetchPantryItems={fetchPantryItems}/>} {/* Conditionally render AddItem */}
        {selectedPantryItem && <EditItem pantryItem={selectedPantryItem} fetchPantryItems={fetchPantryItems} />} {/* Render EditItem if an item is selected */}
      </div>
    </div>
  );
};

export default PantryPage;
