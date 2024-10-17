import React, { useState } from "react";
import "./GroceryListPage.css";

const GroceryListPage = () => {
  const [items, setItems] = useState([
    { id: 1, name: "Eggs", checked: false },
    { id: 2, name: "Milk", checked: false },
  ]);
  const [editIndex, setEditIndex] = useState(null);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", unit: "", notes: "" });

  const handleCheckboxChange = (index) => {
    const updatedItems = items.map((item, i) => 
      i === index ? { ...item, checked: !item.checked } : item
    );
    setItems(updatedItems);
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

  const handleRemoveItem = () => {
    const updatedItems = items.filter((_, i) => i !== editIndex);
    setItems(updatedItems);
    setEditIndex(null);
  };

  return (
    <div className="groceryListPage">
      <div className="mainContainer">
        <div className="filtersAndListContainer">
          <div className="GLHeader">
            <div className="GLHeaderSearchBar">
              <span className="GLHeaderLabel"></span>
              <input type="text" placeholder="Filter items..." className="filterInput" />
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
              {items.map((item, index) => (
                <li key={item.id} className="groceryListItem" onClick={() => handleEditItem(index)}>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleCheckboxChange(index)}
                  />
                  <span className={item.checked ? 'checked' : ''}>{item.name}</span>
                  <hr />
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="addItemContainer">
          <h3>Add Item</h3>
          <div className="formGroup">
            <label>Item Name:</label>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
          </div>
          <div className="formGroup">
            <label>Item Quantity:</label>
            <input
              type="text"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
            />
          </div>
          <div className="formGroup">
            <label>Item Unit:</label>
            <input
              type="text"
              value={newItem.unit}
              onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
            />
          </div>
          <div className="formGroup">
            <label>Notes:</label>
            <textarea
              value={newItem.notes}
              onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
            ></textarea>
          </div>
          <div className="buttonGroup">
            <button className="removeButton" onClick={handleRemoveItem}>Remove</button>
            <button className="addButton" onClick={handleSaveItem}>Add</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroceryListPage;
