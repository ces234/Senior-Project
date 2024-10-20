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
import steak from "../../photos/steak.jpeg";
import granola from "../../photos/granola.jpeg";
import cookies from "../../photos/cookies.webp";
import cupcakes from "../../photos/cupcakes.webp";
import bagels from "../../photos/bagels.webp";
import danishes from "../../photos/danishes.jpeg";
import fudge from "../../photos/fudge.jpeg";
import pancakes from "../../photos/pancakes.webp";
import muffins from "../../photos/muffins.webp";
import food from "../../photos/food.jpeg";
import main from "../../photos/main.jpeg";
import dinner from "../../photos/dinner.jpeg";
import desserts from "../../photos/desserts.webp";
import lunch from "../../photos/lunch.jpeg";
import breakfast from "../../photos/breakfast.webp";
import appetizers from "../../photos/appetizers.webp";
import dip from "../../photos/dip.webp";
import sandwhich from "../../photos/sandwhich.webp";
import pickles from "../../photos/pickles.webp";
import cobbler from "../../photos/cobbler.jpeg";
import bars from "../../photos/bars.jpeg";
import salad from "../../photos/salad.webp";
import gravy from "../../photos/gravy.webp";
import turkey from "../../photos/turkey.webp";
import pork from "../../photos/pork.webp";
import lamb from "../../photos/lamb.webp";
import beef from "../../photos/lamb.webp";
import chicken from "../../photos/chicken.jpeg";
import burgers from "../../photos/burgers.webp";
import jerky from "../../photos/jerky.jpeg";
import gumbo from "../../photos/gumbo.jpg";
import snacks from "../../photos/snacks.jpeg";
import drink from "../../photos/drink.jpeg";
import icecream from "../../photos/icecream.webp";
import petFood from "../../photos/pet-food.webp";
import health from "../../photos/health.jpeg";
import hawaiian from "../../photos/hawaiian.webp";
import mediterranean from "../../photos/mediterranean.jpeg";
import korean from "../../photos/korean.jpeg";
import chinese from "../../photos/chinese.jpeg";
import mexican from "../../photos/mexican.webp";
import indian from "../../photos/indian.webp";
import stirFries from "../../photos/stir-fries.jpeg";
import sushi from "../../photos/sushi.webp";
import tacos from "../../photos/tacos.webp";
import fries from "../../photos/fries.webp";
import calzones from "../../photos/calzones.jpeg";
import pizza from "../../photos/pizza.webp";
import burritos from "../../photos/burritos.webp";
import chili from "../../photos/chili.webp";
import soups from "../../photos/soups.jpeg";
import stew from "../../photos/stew.webp";
import casseroles from "../../photos/casseroles.webp";
import oatmeal from "../../photos/oatmeal.webp";
import smoothies from "../../photos/smoothies.webp";
import saladDressing from "../../photos/salad-dressing.jpeg";
import rice from "../../photos/rice.webp";
import pasta from "../../photos/pasta.webp";
import flatbread from "../../photos/flatbread.jpeg";
import breads from "../../photos/breads.jpeg";
import doughnuts from "../../photos/doughnuts.jpeg";
import cake from "../../photos/cake.jpeg";




const RecipeCardImage = ({ categories }) => {
    const getImage = () => {
        if (categories.includes("Air Fryer Recipes")) {
            return airFryer; // Return the image path directly
        }
        if (categories.includes("Canning and Preserving")) {
            return Canning; // Return the image path directly
        }
        if (categories.includes("Lettuce Wraps")) {
            return muffins; // Return the image path directly
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
        if (categories.includes("Steak")) {
            return steak; // Return the image path directly
        }
        if (categories.includes("Granola")) {
            return granola; // Return the image path directly
        }
        if (categories.includes("Cookies")) {
            return cookies; // Return the image path directly
        }
        if (categories.includes("Cupcakes")) {
            return cupcakes; // Return the image path directly
        }
        if (categories.includes("Bagels")) {
            return bagels; // Return the image path directly
        }
        if (categories.includes("Danishes")) {
            return danishes; // Return the image path directly
        }
        if (categories.includes("Fudge")) {
            return fudge; // Return the image path directly
        }
        if (categories.includes("Pancakes")) {
            return pancakes; // Return the image path directly
        }
        if (categories.includes("Muffins")) {
            return muffins; // Return the image path directly
        }
        if (categories.includes("Doughnuts")) {
            return doughnuts; // Return the image path directly
        }
        if (categories.includes("Breads")) {
            return breads; // Return the image path directly
        }
        if (categories.includes("Flatbread")) {
            return flatbread; // Return the image path directly
        }
        if (categories.includes("Pasta")) {
            return pasta; // Return the image path directly
        }
        if (categories.includes("Rice")) {
            return rice; // Return the image path directly
        }
        if (categories.includes("Salad Dressings")) {
            return saladDressing; // Return the image path directly
        }
        if (categories.includes("Smoothies")) {
            return smoothies; // Return the image path directly
        }
        if (categories.includes("Oatmeal")) {
            return oatmeal; // Return the image path directly
        }
        if (categories.includes("Casseroles")) {
            return casseroles; // Return the image path directly
        }
        if (categories.includes("Stews")) {
            return stew; // Return the image path directly
        }
        if (categories.includes("Soups")) {
            return soups; // Return the image path directly
        }
        if (categories.includes("Chili Recipes")) {
            return chili; // Return the image path directly
        }
        if (categories.includes("Burritos")) {
            return burritos; // Return the image path directly
        }
        if (categories.includes("Pizza")) {
            return pizza; // Return the image path directly
        }
        if (categories.includes("Calzones")) {
            return calzones; // Return the image path directly
        }
        if (categories.includes("Fries")) {
            return fries; // Return the image path directly
        }
        if (categories.includes("Tacos")) {
            return tacos; // Return the image path directly
        }
        if (categories.includes("Sushi")) {
            return sushi; // Return the image path directly
        }
        if (categories.includes("Stir-Fries")) {
            return stirFries; // Return the image path directly
        }
        if (categories.includes("Indian Recipes")) {
            return indian; // Return the image path directly
        }
        if (categories.includes("Mexican Recipes")) {
            return mexican; // Return the image path directly
        }
        if (categories.includes("Chinese Recipes")) {
            return chinese; // Return the image path directly
        }
        if (categories.includes("Korean Recipes")) {
            return korean; // Return the image path directly
        }
        if (categories.includes("Mediterranean Diet")) {
            return mediterranean; // Return the image path directly
        }
        if (categories.includes("Hawaiian")) {
            return hawaiian; // Return the image path directly
        }
        if (categories.includes("Cake Recipes")) {
            return cake; // Return the image path directly
        }
        if (categories.includes("Healthy Recipes")) {
            return health; // Return the image path directly
        }
        if (categories.includes("Pet Food")) {
            return petFood; // Return the image path directly
        }
        if (categories.includes("Ice Cream")) {
            return icecream; // Return the image path directly
        }
        if (categories.includes("Drinks")) {
            return drink; // Return the image path directly
        }
        if (categories.includes("Snacks")) {
            return snacks; // Return the image path directly
        }
        if (categories.includes("Gumbo")) {
            return gumbo; // Return the image path directly
        }
        if (categories.includes("Jerky")) {
            return jerky; // Return the image path directly
        }
        if (categories.includes("Burgers")) {
            return burgers; // Return the image path directly
        }
        if (categories.includes("Chicken Recipes")) {
            return chicken; // Return the image path directly
        }
        if (categories.includes("Beef Recipes")) {
            return beef; // Return the image path directly
        }
        if (categories.includes("Lamb Recipes")) {
            return lamb; // Return the image path directly
        }
        if (categories.includes("Pork Recipes")) {
            return pork; // Return the image path directly
        }
        if (categories.includes("Turkey")) {
            return turkey; // Return the image path directly
        }
        if (categories.includes("Gravy")) {
            return gravy; // Return the image path directly
        }
        if (categories.includes("Salad")) {
            return salad; // Return the image path directly
        }
        if (categories.includes("Bars")) {
            return bars; // Return the image path directly
        }
        if (categories.includes("Cobbler")) {
            return cobbler; // Return the image path directly
        }
        if (categories.includes("Pickles")) {
            return pickles; // Return the image path directly
        }
        if (categories.includes("Sandwhich")) {
            return sandwhich; // Return the image path directly
        }
        if (categories.includes("Dip")) {
            return dip; // Return the image path directly
        }
        if (categories.includes("Appetizers")) {
            return appetizers; // Return the image path directly
        }
        if (categories.includes("Breakfast")) {
            return breakfast; // Return the image path directly
        }
        if (categories.includes("Lunch")) {
            return lunch; // Return the image path directly
        }
        if (categories.includes("Desserts")) {
            return desserts; // Return the image path directly
        }
        if (categories.includes("Dinner Recipes")) {
            return dinner; // Return the image path directly
        }
        if (categories.includes("Main Dishes")) {
            return main; // Return the image path directly
        }
        return food; // Or return a default image path or null
    };

    return (
        <img src={getImage()} alt="Recipe Image" />
    );
};

export default RecipeCardImage;
