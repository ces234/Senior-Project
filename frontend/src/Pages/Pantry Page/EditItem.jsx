import React, { useState, useEffect } from "react"; // Import useState
import "./PantryPage.css";
import axios from "axios"; // Import Axios

const EditItem = ({ pantryItem, fetchPantryItems }) => {
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState("");
    const [expiration, setExpiration] = useState("");

    useEffect(() => {
        if (pantryItem) {
            setName(pantryItem.ingredient_name);
            setQuantity(pantryItem.quantity);
            setUnit(pantryItem.unit);
        }
    }, [pantryItem]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = {
            name,
            quantity,
            unit        
        };

        const token = localStorage.getItem("token");

        try {
            const response = await axios.put(
                `http://localhost:8000/pantry/edit_pantry_item/${pantryItem.ingredient_id}/`, // Ensure you have this endpoint in your backend
                data,
                {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('Item updated successfully:', response.data); // Handle successful response
            fetchPantryItems(); // Fetch the updated pantry items
        } catch (error) {
            console.error('Error updating pantry item:', error.response ? error.response.data : error.message);
        }
    };

    // Edit a pantry item
    const editItem = async(item_id) => {
        const data = {
            name,
            quantity,
            unit        
        };

        const token = localStorage.getItem("token");

        try {
            const response = await axios.put(
                `http://localhost:8000/pantry/edit_pantry_item/${item_id}/`, // Ensure you have this endpoint in your backend
                data,
                {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('Item updated successfully:', response.data); // Handle successful response
            fetchPantryItems(); // Fetch the updated pantry items
        } catch (error) {
            console.error('Error updating pantry item:', error.response ? error.response.data : error.message);
        }
    }

    // Delete a pantry item
    const deleteItem = async (item_id) => {
        console.log('Deleting item with ID:', item_id);
        const token = localStorage.getItem("token"); // Get the token from local storage
    
        try {
            const response = await axios.delete(`http://localhost:8000/pantry/delete_pantry_item/${item_id}/`, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            // Handle successful response
            console.log('Item deleted successfully:', response.data);
            fetchPantryItems();
        } catch (error) {
            console.error('Error deleting item:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="addItemContainer">
            <div className="addItemHeader">
                <h1>Edit Item</h1>
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
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Item name"
                    />

                    <label htmlFor="quantity">Quantity:</label>
                    <hr />
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
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

                    <label htmlFor="expiration">Expiration Date:</label>
                    <hr />
                    <input
                        type="date"
                        id="expiration"
                        name="expiration"
                        value={expiration}
                        onChange={(e) => setExpiration(e.target.value)}
                    />
                    
                    <button type="button" className="submitPantryItemButton" onClick={() => editItem(pantryItem.ingredient_id)}>Edit Item</button>
                    <button type="button" className="deletePantryItemButton" onClick={() => deleteItem(pantryItem.ingredient_id)}>Delete Item</button>
                </div>
            </form>
        </div>
    );
};

export default EditItem;
