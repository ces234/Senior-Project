import React, { useState } from "react"; // Import useState
import "./PantryPage.css";
import axios from "axios"; // Import Axios

const AddItem = () => {
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState("");
    // const [expiration, setExpiration] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = {
            name,
            quantity,
            unit,
            // expiration
        };

        try {
            // Send POST request to the backend API
            const response = await axios.post('/api/add_pantry_item/', data);

            if (response.status === 201) {
                alert("Pantry item added successfully!");
                // Optionally, clear the form fields
                setName("");
                setQuantity("");
                setUnit("");
                // setExpiration("");
            }
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

                    <label htmlFor="expiration">Expiration Date:</label>
                    <hr />
                    <input
                        type="date"
                        id="expiration"
                        name="expiration"
                        // value={expiration}
                        // onChange={(e) => setExpiration(e.target.value)}
                    />
                    
                    <button type="submit" className="submitPantryItemButton">Add Item</button>
                </div>
            </form>
        </div>
    );
};

export default AddItem;
