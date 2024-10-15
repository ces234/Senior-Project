import airFryer from "../../photos/airFryer.jpg";

const RecipeCardImage = ({ categories }) => {
    const getImage = () => {
        if (categories.includes("Beef Recipes")) {
            return airFryer; // Return the image path directly
        }
        return ""; // Or return a default image path or null
    };

    return (
        <img src={getImage()} alt="Recipe Image" />
    );
};

export default RecipeCardImage;
