import "./RecipeSuggestionPage.css";
import CategoryLists from "./CategoryLists";
import React, { useState } from "react";


const RecipeFiltering = () => {
    const categoryLists = CategoryLists;
    const parentCategories = Object.keys(categoryLists);
    const [openDropdowns, setOpenDropdowns] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [openSubDropdowns, setOpenSubDropdowns] = useState({}); // Track subcategory dropdowns

    const handleCategoryChange = (event) => {
        const categoryId = event.target.value; // Keep it as a string for easier comparison
        if (event.target.checked) {
          setSelectedCategories((prev) => [...new Set([...prev, categoryId])]);
        } else {
          setSelectedCategories((prev) => prev.filter((id) => id !== categoryId));
        }
      };
    



    const toggleDropdown = (parentCategory) => {
        setOpenDropdowns((prevState) => ({
          ...prevState,
          [parentCategory]: !prevState[parentCategory], // Toggle open/close state
        }));
      };

    const toggleSubDropdown = (parentCategory) => {
        setOpenSubDropdowns((prevState) => ({
          ...prevState,
          [parentCategory]: !prevState[parentCategory],
        }));
      };

        

  const handleSubcategoryChange = (subcategory) => {
    const parentCategory = Object.keys(categoryLists).find((parent) =>
      Object.keys(categoryLists[parent].subcategories).includes(subcategory)
    );

    const isChecked = !selectedCategories.includes(subcategory);
    const items = categoryLists[parentCategory].subcategories[subcategory];

    if (isChecked) {
      // If the subcategory is checked, add it and all its items
      setSelectedCategories((prev) => [
        ...new Set([...prev, subcategory, ...items]),
      ]);
    } else {
      // If the subcategory is unchecked, remove it and all its items
      setSelectedCategories((prev) =>
        prev.filter((cat) => cat !== subcategory && !items.includes(cat))
      );
    }
  };
    

      const handleParentCategoryChange = (parentCategory) => {
        const isChecked = !selectedCategories.includes(parentCategory);
        const subcategories = Object.keys(
          categoryLists[parentCategory].subcategories
        );
    
        if (isChecked) {
          // If the parent category is checked, add it and all its subcategories and items
          const allItems = subcategories.reduce((acc, subcategory) => {
            return [
              ...acc,
              subcategory,
              ...categoryLists[parentCategory].subcategories[subcategory],
            ];
          }, []);
          setSelectedCategories((prev) => [
            ...new Set([...prev, parentCategory, ...allItems]),
          ]);
        } else {
          // If the parent category is unchecked, remove it, its subcategories, and their items
          const allItems = subcategories.reduce((acc, subcategory) => {
            return [
              ...acc,
              subcategory,
              ...categoryLists[parentCategory].subcategories[subcategory],
            ];
          }, []);
          setSelectedCategories((prev) =>
            prev.filter((cat) => cat !== parentCategory && !allItems.includes(cat))
          );
        }
      };

    return (
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
                  <span className="arrow">
                    {openDropdowns[parentCategory] ? "▼" : "►"}
                  </span>
                  <span className="parentCategoryLabel">{parentCategory}</span>
                </button>
                <input
                  type="checkbox"
                  className="parentCheckbox"
                  checked={
                    selectedCategories.includes(parentCategory) ||
                    Object.keys(
                      categoryLists[parentCategory].subcategories
                    ).every((subCat) => selectedCategories.includes(subCat))
                  }
                  onChange={(e) => {
                    e.stopPropagation();
                    handleParentCategoryChange(parentCategory);
                  }}
                />
              </div>
              {openDropdowns[parentCategory] && (
                <div className="childCategoryContainer">
                  {Object.keys(categoryLists[parentCategory].subcategories).map(
                    (subcategory) => (
                      <div key={subcategory} className="subCategoryContainer">
                        <label className="subcategoryLabel">
                          <button
                            onClick={() => toggleSubDropdown(subcategory)}
                            className="subCategoryButton"
                          >
                            <span className="arrow">
                              {openSubDropdowns[subcategory] ? "▼" : "► "}
                            </span>
                            {subcategory}
                          </button>
                          <input
                            type="checkbox"
                            checked={
                              selectedCategories.includes(subcategory) ||
                              categoryLists[parentCategory].subcategories[
                                subcategory
                              ].every((item) =>
                                selectedCategories.includes(item)
                              )
                            }
                            onChange={() => handleSubcategoryChange(subcategory)}
                          />
                        </label>
                        {openSubDropdowns[subcategory] && (
                          <div className="subcategoryList">
                            {categoryLists[parentCategory].subcategories[
                              subcategory
                            ].map((item) => (
                              <div
                                key={item}
                                className="childCategoryContainer"
                              >
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
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  

  export default RecipeFiltering;