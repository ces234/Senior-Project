import "./PantryPage.css";

const AddItem = () => {
    return (
        <div className="addItemContainer">
            <div className="addItemHeader">
                <h1>Add Item</h1>
                <hr />
            </div>
            <div className="addItemInputs">
                <label htmlFor="name">Name:</label>
                <hr />
                <input type="text" id="name" name="name" placeholder="Item name" />

                <label htmlFor="quantity">Quantity:</label>
                <hr />
                <input type="number" id="quantity" name="quantity" placeholder="Quantity" />

                <label htmlFor="unit">Unit:</label>
                <hr />
                <select id="unit" name="unit">
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
                <input type="date" id="expiration" name="expiration" />
            </div>
        </div>
    );
};

export default AddItem;
