import "./PantryPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react"; // Optional since React 17
import AddItem from "./AddItem";

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

const PantryItem = ({ pantryItem }) => {
  return (
    <div className="pantryItemContainer">
      <div className="ingredientIcon">
        <FontAwesomeIcon icon={getRandomIcon()} className="pantryItemIcon" />
        <div className="ingredientName">{pantryItem.ingredient}</div>
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
  const pantryItems = [
    { ingredient: "butter", quantity: "1", unit: "cup" },
    { ingredient: "apple", quantity: "3", unit: "none" },
    { ingredient: "sugar", quantity: "3", unit: "cup" },
    { ingredient: "cinnamon", quantity: "none", unit: "none" },
    { ingredient: "flour", quantity: "2", unit: "cup" },
    { ingredient: "milk", quantity: "1", unit: "cup" },
    { ingredient: "salt", quantity: "1", unit: "tbsp" },
    { ingredient: "pepper", quantity: "1", unit: "tsp" },
    { ingredient: "pepper", quantity: "1", unit: "tsp" },
    { ingredient: "pepper", quantity: "1", unit: "tsp" },
    { ingredient: "pepper", quantity: "1", unit: "tsp" },
    { ingredient: "pepper", quantity: "1", unit: "tsp" },
    { ingredient: "pepper", quantity: "1", unit: "tsp" },
    { ingredient: "pepper", quantity: "1", unit: "tsp" },
    { ingredient: "pepper", quantity: "1", unit: "tsp" },
    { ingredient: "pepper", quantity: "1", unit: "tsp" },
    { ingredient: "pepper", quantity: "1", unit: "tsp" },
    { ingredient: "pepper", quantity: "1", unit: "tsp" },
    { ingredient: "pepper", quantity: "1", unit: "tsp" },
    { ingredient: "pepper", quantity: "1", unit: "tsp" },
    { ingredient: "pepper", quantity: "1", unit: "tsp" },
  ];

  return (
    <div className="pantryPageContainer">
      <div className="pantryPageContent">
        <div className="pantryHeader">
          <h1>My Pantry</h1>
          <button className = "addPantryItemButton">+ pantry item</button>
        </div>
        <div className="pantryItems">
          {pantryItems.map((pantryItem, index) => (
            <>
              <PantryItem pantryItem={pantryItem} key={index} />
              {/* Add a shelf after every 6 items */}
              {(index + 1) % 6 === 0 && <div className="pantryShelf"></div>}
            </>
          ))}

          {/* Add a final shelf after the last row if it's incomplete */}
          {pantryItems.length % 6 !== 0 && <div className="pantryShelf"></div>}
        </div>
      </div>
      <div className="pantrySideBar">
        <AddItem /> 
      </div>
    </div>
  );
};

export default PantryPage;
