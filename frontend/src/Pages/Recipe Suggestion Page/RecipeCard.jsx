
import "./RecipeSuggestionPage.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar} from "@fortawesome/free-regular-svg-icons";
import { faCirclePlus} from "@fortawesome/free-solid-svg-icons";


const RecipeCard = ({ image, title, cookTime, prepTime, recipeId }) => {
    return <div className="recipeCardContainer">
        <img src={image} alt="recipe image" />
        <div className="recipeTitleContainer">{title}</div>
        <div className="recipeTimeContainer">
            <div className="cookTime" >
                Cook Time: {cookTime}

            </div>
            <div className="prepTime" >
                Prep Time: {prepTime}

            </div>
        </div>
        <div className="recipeButtonContainer">
            <FontAwesomeIcon icon = {faStar}></FontAwesomeIcon>
            <FontAwesomeIcon icon = {faCirclePlus}></FontAwesomeIcon>

        </div>



    </div>

}

export default RecipeCard
