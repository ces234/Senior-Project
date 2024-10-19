import airFryer from "../../photos/airFryer.jpg";
import brownies from "../../photos/brownies.webp";
import buffaloWings from "../../photos/buffaloWings.jpeg";
import Canning from "../../photos/Canning.webp";
import cheeseBalls from "../../photos/cheeseBalls.webp";
import cheesecake from "../../photos/cheesecake.webp";
import dumplings from "../../photos/dumplings.webp";
import falafel from "../../photos/falafel.webp";
import fondue from "../../photos/falafel.webp";
import porkRibs from "../../photos/porkRibs.jpeg";

const RecipeCardImage = ({ categories }) => {
    const getImage = () => {
        if (categories.includes("Air Fryer Recipes")) {
            return airFryer; // Return the image path directly
        }
        if (categories.includes("Canning and Preserving")) {
            return Canning; // Return the image path directly
        }
        if (categories.includes("Cheese Fondue")) {
            return fondue; // Return the image path directly
        }
        if (categories.includes("Cheesecake")) {
            return cheesecake; // Return the image path directly
        }
        if (categories.includes("Cheese Balls")) {
            return cheeseBalls; // Return the image path directly
        }
        if (categories.includes("Dumplings")) {
            return dumplings; // Return the image path directly
        }
        if (categories.includes("Buffalo Chicken Wings")) {
            return buffaloWings; // Return the image path directly
        }
        if (categories.includes("Brownies")) {
            return brownies; // Return the image path directly
        }
        if (categories.includes("Falafel")) {
            return falafel; // Return the image path directly
        }
        if (categories.includes("Pork Ribs")) {
            return porkRibs; // Return the image path directly
        }
        return ""; // Or return a default image path or null
    };

    return (
        <img src={getImage()} alt="Recipe Image" />
    );
};

export default RecipeCardImage;
