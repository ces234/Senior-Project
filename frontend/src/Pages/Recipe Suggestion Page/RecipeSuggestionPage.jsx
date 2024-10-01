import React, { useEffect, useState } from "react";
import "./RecipeSuggestionPage.css";
import RecipeCard from "./RecipeCard";
import chicken from "../../photos/chicken.webp";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesRight, faChevronRight, faAnglesLeft, faChevronLeft } from '@fortawesome/free-solid-svg-icons';



const RecipeSuggestionPage = () => {
    const [recipes, setRecipes] = useState([]);   // State for storing random recipes or paginated results
    const [query, setQuery] = useState('');       // State for search query
    const [searchResults, setSearchResults] = useState([]); // State for search results
    const [currentPage, setCurrentPage] = useState(1);   // Track current page
    const [totalPages, setTotalPages] = useState(1);     // Track total pages
    const [selectedRecipes, setSelectedRecipes] = useState([]);
    const [openDropdowns, setOpenDropdowns] = useState([]);
    const [openSubDropdowns, setOpenSubDropdowns] = useState({}); // Track subcategory dropdowns
    const [selectedCategories, setSelectedCategories] = useState([]);
    const recipesPerPage = 16;   // Set how many recipes per page






    const fetchRecipes = (pageNumber) => {
        const url = query
            ? `http://localhost:8000/recipes/search/?q=${query}&page=${pageNumber}&pageSize=${recipesPerPage}`
            : `http://localhost:8000/recipes/random-recipes/?page=${pageNumber}&pageSize=${recipesPerPage}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (query) {
                    setSearchResults(data.recipes);
                    setTotalPages(data.total_pages); // Make sure to set total pages here
                } else {
                    setRecipes(data.recipes);
                    setTotalPages(data.total_pages); // Set total pages for random recipes too
                }
            })
            .catch(error => console.error('Error fetching recipes:', error));
    };


    // Fetch random recipes on component load
    useEffect(() => {
        fetchRecipes(currentPage);
    }, [currentPage]);

    // Handle search form submission
    const handleSearch = (event) => {
        event.preventDefault();
        setCurrentPage(1); // Reset to first page on search
        fetchRecipes(1);   // Fetch results for the first page of the search
    };


    const handleCategoryChange = (event) => {
        const categoryId = event.target.value; // Keep it as a string for easier comparison
        if (event.target.checked) {
            setSelectedCategories(prev => [...new Set([...prev, categoryId])]);
        } else {
            setSelectedCategories(prev => prev.filter(id => id !== categoryId));
        }
    }



    const categoryLists = {
        "Cuisine Types": {
            subcategories: {
                "American": [
                    "Apple Pie", "Baked Beans", "Bagels", "Banana Breads", "Beef Stews",
                    "Biscuits", "Blueberry Pie", "Buffalo Chicken Wings", "Cornbread",
                    "Fried Chicken", "Macaroni and Cheese", "Meatloaf"
                ],
                "Asian": [
                    "Beef Stroganoff", "Beef Tenderloin", "Bulgogi", "Chicken Adobo",
                    "Chicken Teriyaki", "Chinese", "Egg Rolls", "Etouffee",
                    "Pad Thai", "Noodles", "Sushi", "Shrimp Scampi"
                ],
                "Mexican": [
                    "Burritos", "Enchiladas", "Fajitas", "Guacamole", "Chiles Rellenos",
                    "Nachos", "Quesadillas", "Salsa", "Tamales", "Tacos", "Taco Salads", "Mexican"
                ],
                "European": [
                    "Bruschetta", "Chicken Marsala", "Goulash", "Minestrone Soups", "Paella",
                    "Pierogies", "Shepherd's Pie", "French Onion Soups", "Borscht",
                    "Kolache", "Calzones", "Pasta Primavera"
                ],
                "Mediterranean": [
                    "Falafel", "Greek", "Hummus", "Gyros", "Pita", "Shawarma",
                    "Greek Salad", "Baba Ghanoush", "Tabouli", "Ceviche", "Paella", "Couscous"
                ],
                "Indian": [
                    "Chicken Curry", "Chicken Marsala", "Biryani", "Naan", "Lentil Soups",
                    "Butter Chicken", "Aloo Gobi", "Tikka Masala", "Chutney", "Paneer",
                    "Samosas", "Indian"
                ]
            }
        },
        "Meal Types": {
            "subcategories": {
                "Breakfast": [
                    "Bagels", "Breakfast Burritos", "Breakfast Casseroles", "French Toast",
                    "Omelets", "Pancakes", "Waffles", "Muffins", "Frittatas", "Smoothies",
                    "Eggs Benedict", "Overnight Oats"
                ],
                "Lunch": [
                    "Burritos", "Calzones", "Chicken Salads", "Enchiladas", "Macaroni and Cheese",
                    "Quesadillas", "Sandwiches", "Sliders", "Taco Salads", "Panini", "Burgers", "Wraps"
                ],
                "Dinner": [
                    "Beef Stroganoff", "Beef Stews", "Chicken Cordon Bleu", "Chicken Parmesan",
                    "Chicken Piccata", "Chicken and Dumplings", "Lamb", "Lasagna", "Pot Roast",
                    "Meatloaf", "Pork Tenderloin", "Ravioli"
                ],
                "Desserts": [
                    "Angel Food Cakes", "Apple Pie", "Banana Breads", "Biscotti", "Blondies",
                    "Brownies", "Cakes", "Cherry Pie", "Cheesecakes", "Cookies", "Cupcakes", "Fudge"
                ],
                "Appetizers": [
                    "Artichoke Dips", "Buffalo Chicken Dips", "Cheese Balls", "Bruschetta",
                    "Crackers", "Deviled Eggs", "Nachos", "Stuffed Mushrooms",
                    "Spinach Dips", "Falafel", "Hummus", "Tapas"
                ]
            }
        },
        "Holiday & Seasonal": {
            "subcategories": {
                "Christmas": [
                    "Christmas Cookies", "Eggnog", "Divinity", "Cranberry Sauces",
                    "Fruitcakes", "Gingerbread Cookies", "Chocolate Fudge", "Hot Chocolate",
                    "Mulled Wine", "Pumpkin Pie", "Stuffing", "Yule Log"
                ],
                "Thanksgiving": [
                    "Turkey", "Gravy", "Cranberry Sauces", "Green Bean Casseroles",
                    "Pumpkin Pie", "Mashed Potatoes", "Cornbread", "Pecan Pie", "Apple Pie",
                    "Stuffing", "Sweet Potato Pie", "Rolls"
                ],
                "Easter": [
                    "Deviled Eggs", "Hot Cross Buns", "Lamb", "Carrot Cakes", "Easter Bread",
                    "Quiches", "Scones", "Easter Desserts", "Glazed Ham", "Scalloped Potatoes",
                    "Asparagus", "Eggs Benedict"
                ],
                "Fourth of July": [
                    "BBQ", "Burgers", "Hot Dogs", "Potato Salads", "Coleslaws",
                    "Corn on the Cob", "Lemonade", "Fried Chicken", "Ribs",
                    "Cornbread", "Watermelon Salad", "Ice Cream"
                ],
                "Halloween": [
                    "Candy Apples", "Halloween Cookies", "Pumpkin Seeds", "Punch",
                    "Caramel Apples", "Popcorn Balls", "Witches' Fingers", "Ghost Brownies",
                    "Spooky Jell-O Shots", "Cupcakes", "Spider Cookies", "Pretzels"
                ],
                "Mother's Day": [
                    "Muffins", "French Toast", "Quiches", "Mimosas", "Frittatas",
                    "Pancakes", "Fruit Salads", "Waffles", "Breakfast Casseroles",
                    "Scones", "Croissants", "Crepes"
                ],
                "Father's Day": [
                    "Steaks", "Burgers", "Buffalo Wings", "BBQ Ribs", "Potato Salads",
                    "Grilled Chicken", "Corn on the Cob", "Fried Chicken",
                    "Pulled Pork", "Cornbread", "Coleslaws", "Deviled Eggs"
                ]
            }
        },
        "Cooking Methods": {
            "subcategories": {
                "Baking": [
                    "Bagels", "Biscuits", "Breads", "Cakes", "Cookies", "Brownies",
                    "Muffins", "Cupcakes", "Pizza Dough", "Pies", "Scones", "Pretzels"
                ],
                "Grilling": [
                    "Burgers", "Hot Dogs", "Ribs", "Grilled Chicken", "Grilled Vegetables",
                    "BBQ", "Pork Chops", "Steaks", "Lamb", "Grilled Shrimp", "Grilled Salmon", "Grilled Pineapple"
                ],
                "Air Fryer": [
                    "Air Fryer Recipes", "Air Fryer Vegetables", "Air Fryer Fish",
                    "Air Fryer Fries", "Air Fryer Wings", "Air Fryer Donuts",
                    "Buffalo Chicken Wings", "Fried Chicken", "Sweet Potato Fries",
                    "Air Fryer Tofu", "Popcorn", "Egg Rolls"
                ],
                "Slow Cooker": [
                    "Slow Cooker Recipes", "Beef Stews", "Chili Recipes", "Pulled Pork",
                    "Pot Roast", "Chicken and Dumplings", "Soups", "Casseroles",
                    "Meatballs", "Beef Stroganoff", "Ribs", "Chicken Noodle Soups"
                ],
                "Instant Pot": [
                    "Instant Pot Recipes", "Soups", "Beef Stews", "Chili Recipes",
                    "Casseroles", "Risotto", "Beans", "Chicken and Dumplings",
                    "Pulled Pork", "Pot Roast", "Yogurt", "Pasta Dishes"
                ],
                "Sous Vide": [
                    "Sous Vide Recipes", "Steaks", "Chicken Breasts", "Salmon",
                    "Vegetables", "Eggs", "Pork Tenderloin", "Lamb",
                    "Duck", "Shrimp", "Custards", "Turkey Breast"
                ]
            }
        },
        "Dietary Preferences": {
            "subcategories": {
                "Vegan": [
                    "Falafel", "Hummus", "Vegan", "Vegan Pizza", "Quinoa", "Smoothies",
                    "Tofu", "Seitan", "Lentil Soups", "Stuffed Mushrooms",
                    "Grilled Vegetables", "Guacamole"
                ],
                "Vegetarian": [
                    "Eggplant Parmesan", "Spinach Dips", "Stuffed Mushrooms",
                    "Pasta Primavera", "Cheese Fondue", "Omelets",
                    "Mushroom Soups", "Zucchini Breads", "Macaroni and Cheese",
                    "Grilled Vegetables", "Vegetarian Tacos", "Falafel"
                ],
                "Gluten-Free": [
                    "Gluten-Free", "Gluten-Free Cookies", "Oatmeal", "Rice Pilaf",
                    "Risotto", "Quinoa", "Frittatas", "Grilled Vegetables",
                    "Smoothies", "Chicken Salads", "Chocolate Fudge", "Fruit Salads"
                ],
                "Keto": [
                    "Keto", "Low Carb", "Zucchini Noodles", "Steak", "Grilled Chicken",
                    "Bacon", "Eggs", "Avocado Salad", "Chicken Salad",
                    "Tofu", "Cauliflower Rice", "Omelets"
                ],
                "Low-Calorie": [
                    "Low Calorie", "Low Fat", "Low Cholesterol", "Low Sodium",
                    "Smoothies", "Chicken Salads", "Green Salads",
                    "Grilled Chicken", "Stir-Fries", "Steamed Vegetables", "Quinoa", "Oatmeal"
                ]
            }
        },
        "Ingredients": {
            "subcategories": {
                "Meat & Poultry": [
                    "Beef Recipes", "Chicken Recipes", "Pork", "Lamb",
                    "Ground Beef", "Turkey", "Chicken Wings",
                    "Chicken Thighs", "Pork Tenderloin", "Sausage", "Meatballs", "Ribs"
                ],
                "Seafood": [
                    "Shrimp", "Salmon", "Crab Cakes", "Ceviche",
                    "Tuna Casseroles", "Fish", "Clams",
                    "Lobster", "Scallops", "Shrimp Scampi", "Sushi", "Seafood Chowders"
                ],
                "Vegetables": [
                    "Broccoli Salads", "Zucchini Breads", "Eggplant Parmesan",
                    "Green Salads", "Potato Salads", "Sweet Potatoes",
                    "Mushrooms", "Butternut Squash Soups", "Spinach Dips",
                    "Carrot Cakes", "Guacamole", "Tomatoes"
                ],
                "Fruits": [
                    "Apple Pie", "Applesauce", "Bananas", "Blueberry Pie",
                    "Strawberry Shortcakes", "Cherry Pie", "Lemon Bars",
                    "Rhubarb Pie", "Cranberry Sauces", "Mangoes", "Peaches", "Fruit Salads"
                ],
                "Dairy & Eggs": [
                    "Cheesecakes", "Egg Salads", "Omelets",
                    "Frittatas", "Creme Brulee", "Ice Cream",
                    "Cheese Balls", "Cheese Fondue", "Ricotta",
                    "Parmesan", "Yogurt", "Eggs Benedict"
                ],
                "Grains & Bread": [
                    "Bagels", "Breads", "Biscuits", "Cornbread",
                    "Muffins", "Flatbreads", "English Muffins",
                    "Pizza Dough", "Pasta Dishes", "Oatmeal",
                    "Crackers", "Pretzels", "Pancakes"
                ],
                "Spices & Sauces": [
                    "Barbecue Sauce", "Gravy", "Marinades",
                    "Relishes", "Salsa", "Salad Dressings",
                    "Pesto", "Brines", "Hot Sauce",
                    "Cheese Fondue", "Fondant", "Garlic Butter"
                ]
            }
        }


    };

    const parentCategories = Object.keys(categoryLists);





    const toggleDropdown = (parentCategory) => {
        setOpenDropdowns((prevState) => ({
            ...prevState,
            [parentCategory]: !prevState[parentCategory]  // Toggle open/close state
        }));
    };


    // Handle parent category click to select/deselect all child categories
    const handleParentCategoryChange = (parentCategory) => {
        const isChecked = !selectedCategories.includes(parentCategory);
        const subcategories = Object.keys(categoryLists[parentCategory].subcategories);

        if (isChecked) {
            // If the parent category is checked, add it and all its subcategories and items
            const allItems = subcategories.reduce((acc, subcategory) => {
                return [...acc, subcategory, ...categoryLists[parentCategory].subcategories[subcategory]];
            }, []);
            setSelectedCategories((prev) => [...new Set([...prev, parentCategory, ...allItems])]);
        } else {
            // If the parent category is unchecked, remove it, its subcategories, and their items
            const allItems = subcategories.reduce((acc, subcategory) => {
                return [...acc, subcategory, ...categoryLists[parentCategory].subcategories[subcategory]];
            }, []);
            setSelectedCategories((prev) =>
                prev.filter(cat => cat !== parentCategory && !allItems.includes(cat))
            );
        }
    };

    const handleSubcategoryChange = (subcategory) => {
        const parentCategory = Object.keys(categoryLists).find(parent =>
            Object.keys(categoryLists[parent].subcategories).includes(subcategory)
        );

        const isChecked = !selectedCategories.includes(subcategory);
        const items = categoryLists[parentCategory].subcategories[subcategory];

        if (isChecked) {
            // If the subcategory is checked, add it and all its items
            setSelectedCategories((prev) => [
                ...new Set([...prev, subcategory, ...items])
            ]);
        } else {
            // If the subcategory is unchecked, remove it and all its items
            setSelectedCategories((prev) =>
                prev.filter(cat => cat !== subcategory && !items.includes(cat))
            );
        }
    };



    // Paginator things


    // Fetch recipes when page changes
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        fetchRecipes(pageNumber);
    };

    // Function to toggle subcategory dropdowns
    const toggleSubDropdown = (parentCategory) => {
        setOpenSubDropdowns((prevState) => ({
            ...prevState,
            [parentCategory]: !prevState[parentCategory]
        }));
    };





    // Logic for displaying 5 page bubbles
    // Pagination logic
    const getPaginationRange = () => {
        const maxPageDisplay = 5; // Maximum number of pagination bubbles to display

        let startPage = Math.max(1, currentPage - Math.floor(maxPageDisplay / 2));
        let endPage = Math.min(totalPages, currentPage + Math.floor(maxPageDisplay / 2));

        // Adjust start and end page when at the beginning of the pagination
        if (currentPage <= Math.floor(maxPageDisplay / 2)) {
            endPage = Math.min(totalPages, maxPageDisplay);
            startPage = 1;
        }

        // Adjust start and end page when at the end of the pagination
        if (currentPage > totalPages - Math.floor(maxPageDisplay / 2)) {
            startPage = Math.max(1, totalPages - maxPageDisplay + 1);
            endPage = totalPages;
        }

        const pageRange = [];
        for (let i = startPage; i <= endPage; i++) {
            pageRange.push(i);
        }

        return pageRange;
    };








    return (
        <div className="recipeSuggestionPageContainer">
            <div className="suggestedRecipesContainer">
                <div className="SRCHeader">
                    <div className="SRCHeaderSearchBar">
                        <form className="SRCHeaderSearchBar" onSubmit={handleSearch}>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search recipes or ingredients..."
                            />
                            {/* <button type="submit" onClick={handleSearch}>
                                    Search
                              </button> */}
                        </form>
                    </div>
                    {/* Pagination */}
                    <div className="SRCHeaderPagination">
                        <button
                            className="leftMultipleButton"
                            onClick={() => handlePageChange(Math.max(currentPage - 5, 1))}
                            disabled={currentPage <= 5}
                        >
                            <FontAwesomeIcon icon={faAnglesLeft} />
                        </button>
                        <button
                            className="leftOnceButton"
                            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        {getPaginationRange().map((page) => (
                            <button
                                key={page}
                                className={`paginationBubble ${page === currentPage ? 'active' : ''}`}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            className="rightOnceButton"
                            onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                        <button
                            className="rightMultipleButton"
                            onClick={() => handlePageChange(Math.min(currentPage + 5, totalPages))}
                            disabled={currentPage > totalPages - 5}
                        >
                            <FontAwesomeIcon icon={faAnglesRight} />
                        </button>
                    </div>
                </div>
                <div className="SRCSuggested">
                    {searchResults.length > 0 ? (
                        // Display search results if they exist
                        searchResults.map((recipe, index) => (
                            <RecipeCard
                                key={index}
                                image={chicken}
                                title={recipe.name}
                                cookTime={recipe.cook_time}
                                prepTime={recipe.prep_time}
                            />
                        ))
                    ) : (
                        // Otherwise, display random recipes
                        recipes.map((recipe, index) => (
                            <RecipeCard
                                key={index}
                                image={chicken}
                                title={recipe.name}
                                cookTime={recipe.cook_time}
                                prepTime={recipe.prep_time}
                            />
                        ))
                    )}
                </div>
                <div className="SRCFooter">
                    <button
                        className="leftMultipleButton"
                        onClick={() => handlePageChange(Math.max(currentPage - 5, 1))}
                        disabled={currentPage <= 5}
                    >
                        <FontAwesomeIcon icon={faAnglesLeft} />
                    </button>
                    <button
                        className="leftOnceButton"
                        onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    {getPaginationRange().map((page) => (
                        <button
                            key={page}
                            className={`paginationBubble ${page === currentPage ? 'active' : ''}`}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        className="rightOnceButton"
                        onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                    <button
                        className="rightMultipleButton"
                        onClick={() => handlePageChange(Math.min(currentPage + 5, totalPages))}
                        disabled={currentPage > totalPages - 5}
                    >
                        <FontAwesomeIcon icon={faAnglesRight} />
                    </button>
                </div>
            </div>
            <div className="recipeFilteringContainer">
                <div className="innerFilterContainer">
                    <h2 className="filterHeader">Filter By Category</h2>
                    {parentCategories.map((parentCategory) => (
                        <div key={parentCategory} className="parentCategoryContainer">
                            <div className="parentCategoryContent">
                                <button
                                    className="parentCategoryButton"
                                    onClick={() => toggleDropdown(parentCategory)}
                                >
                                    <span className="arrow">{openDropdowns[parentCategory] ? '▼' : '►'}</span>
                                    <span className="parentCategoryLabel">{parentCategory}</span>
                                </button>
                                <input
                                    type="checkbox"
                                    className="parentCheckbox"
                                    checked={selectedCategories.includes(parentCategory) ||
                                        Object.keys(categoryLists[parentCategory].subcategories).every(subCat =>
                                            selectedCategories.includes(subCat)
                                        )}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        handleParentCategoryChange(parentCategory);
                                    }}
                                />

                            </div>
                            {openDropdowns[parentCategory] && (
                                <div className="childCategoryContainer">
                                    {Object.keys(categoryLists[parentCategory].subcategories).map((subcategory) => (
                                        <div key={subcategory} className="subCategoryContainer">
                                            <label className="subcategoryLabel">
                                                <button onClick={() => toggleSubDropdown(subcategory)} className="subCategoryButton">
                                                    <span className="arrow">{openSubDropdowns[subcategory] ? "▼" : "► "}</span>
                                                    {subcategory}
                                                </button>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(subcategory) ||
                                                        categoryLists[parentCategory].subcategories[subcategory].every(item => selectedCategories.includes(item))}
                                                    onChange={() => handleSubcategoryChange(subcategory)}
                                                />
                                            </label>
                                            {openSubDropdowns[subcategory] && (
                                                <div className="subcategoryList">
                                                    {categoryLists[parentCategory].subcategories[subcategory].map((item) => (
                                                        <div key={item} className="childCategoryContainer">
                                                            <label className="categoryLabel">
                                                                {item}
                                                                <input
                                                                    type="checkbox"
                                                                    value={item}
                                                                    checked={selectedCategories.includes(item)}
                                                                    onChange={handleCategoryChange}
                                                                />
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );


    {/* {parentCategories.map((category) => (
                        <div key={category} className="categoryContainer">
                            <button
                                onClick={() => toggleDropdown(category)}
                                className="categoryButton"
                            >
                                {category}
                            </button>


                            {openDropdowns[category] && (
                                <div className="subcategoryDropdown">
                                    {subCategories[category].map((subCategory) => (
                                        <div key={subCategory} className="subcategoryOption">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    value={subCategory}
                                                    onChange={() => {
                                                        // Handle subcategory selection
                                                    }}
                                                />
                                                {subCategory}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )} */}




    {/* <h1>Random Recipes</h1>
            <ul>
                {recipes.map((recipe, index) => (
                    <li key={index}>
                        {recipe.name} - Prep: {recipe.prep_time} mins, Cook: {recipe.cook_time} mins, Servings: {recipe.servings}
                    </li>
                ))}
            </ul>

            <h2>Search for Recipes<s/h2>

            <form onSubmit={handleSearch}>
                <input 
                    type="text" 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                    placeholder="Search by recipe or ingredient" 
                />
                <div>
                    <h3>Filter by Categories</h3>
                    {categories.map(category => (
                        <label key = {category.id}>
                            <input 
                                type="checkbox"
                                value = {category.id}
                                onChange = {handleCategoryChange} 
                            />
                            {category.name}
                        </label>
                    ))}
                </div>
                <button type="submit">Search</button>
            </form>


            {searchResults.length > 0 && (
                <div>
                    <h3>Search Results</h3>
                    <ul>
                        {searchResults.map((recipe, index) => (
                            <li key={index}>
                                {recipe.name} - Prep: {recipe.prep_time} mins, Cook: {recipe.cook_time} mins, Servings: {recipe.servings}
                            </li>
                        ))}
                    </ul>
                </div>
            )} */}

};

export default RecipeSuggestionPage;
