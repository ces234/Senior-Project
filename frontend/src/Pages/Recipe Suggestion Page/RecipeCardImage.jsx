import React, {useState, useEffect} from "react";
import airFryer from "../../photos/airFryer.jpg";
import brownies from "../../photos/brownies.webp";
import buffaloWings from "../../photos/buffaloWings.jpeg";
import canning from "../../photos/Canning.webp";
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
import lettuceWraps from "../../photos/lettuceWraps.jpeg";
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
import pie from "../../photos/pie.jpeg";
import shrimp from "../../photos/shrimp.webp";
import fruitcake from "../../photos/fruitcake.jpeg";
import bakedBeans from "../../photos/bakedBeans.jpeg";
import biscuit from "../../photos/biscuit.jpeg";
import sandwichFood from "../../photos/sandwichFood.jpeg";
import plannedFood from "../../photos/plannedFood.jpeg";
import saladFood from "../../photos/saladFood.webp";
import chickenFood from "../../photos/chickenFood.webp";
import greenFood from "../../photos/greenFood.jpeg";
import plateFood from "../../photos/plateFood.jpeg";
import noodleFood from "../../photos/noodleFood.webp";
import indianFood from "../../photos/indianFood.jpeg";
import burgerFood from "../../photos/burgerFood.jpeg";

const RecipeCardImage = ({ categories }) => {
    const [image, setImage] = useState(null);

    useEffect(() => {            
        let foundMatch = false;

        if (categories.includes("Air Fryer Recipes")) {
            setImage(airFryer); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Canning and Preserving")) {
            setImage(canning); // Return the image path directly
            foundMatch = true;
        }
        else if(categories.includes("Fruitcake")){
            setImage(fruitcake)
            foundMatch = true;
        }
        if (categories.includes("Lettuce Wraps")) {
            setImage(lettuceWraps);
            foundMatch = true;
        }
        else if (categories.includes("Cheese Fondue")) {
            setImage(fondue); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Cheesecake")) {
            setImage(cheesecake); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Cheese Balls")) {
            setImage(cheeseBalls); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Dumplings")) {
            setImage(dumplings); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Buffalo Chicken Wings")) {
            setImage(buffaloWings); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Brownies")) {
            setImage(brownies); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Falafel")) {
            setImage(falafel); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Pork Ribs")) {
            setImage(porkRibs); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Steak")) {
            setImage(steak); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Shrimp Recipes")){
            setImage(shrimp);
            foundMatch = true;

        }
        else if (categories.includes("Granola")) {
            setImage(granola); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Cookies")||categories.includes("Oatmeal Cookies")||categories.includes("Drop Cookies")) {
            setImage(cookies); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Cupcakes")) {
            setImage(cupcakes); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Bagels")) {
            setImage(bagels); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Danishes")) {
            setImage(danishes); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Fudge")) {
            setImage(fudge); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Pancakes")) {
            setImage(pancakes); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Muffins")) {
            setImage(muffins); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Doughnuts")) {
            setImage(doughnuts); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Breads")) {
            setImage(breads); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Flatbread")) {
            setImage(flatbread); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Homemade Pasta")||categories.includes("Pasta")||categories.includes("Pasta Carbonara")||categories.includes("Pasta Primavera")||categories.includes("Pasta Salad")||categories.includes("Lasagna")||categories.includes("Linguine")) {
            setImage(pasta); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Rice")) {
            setImage(rice); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Salad Dressings")) {
            setImage(saladDressing); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Smoothies")) {
            setImage(smoothies); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Oatmeal")) {
            setImage(oatmeal); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Casseroles")) {
            setImage(casseroles); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Stews")) {
            setImage(stew); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Soups")||categories.includes("Chowder")) {
            setImage(soups); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Chili Recipes")) {
            setImage(chili); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Burritos")) {
            setImage(burritos); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Pizza") || categories.includes("Pizza Dough and Crusts")) {
            setImage(pizza); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Calzones")) {
            setImage(calzones); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Fries")) {
            setImage(fries); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Tacos")) {
            setImage(tacos); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Sushi")) {
            setImage(sushi); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Stir-Fries")) {
            setImage(stirFries); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Indian Recipes")) {
            setImage(indian); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Mexican Recipes")||categories.includes("Tacos")||categories.includes("Enchiladas")||categories.includes("Fajitas")||categories.includes("Empanada Recipes")) {
            setImage(mexican); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Chinese Recipes")) {
            setImage(chinese); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Korean Recipes")) {
            setImage(korean); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Mediterranean Diet")) {
            setImage(mediterranean); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Hawaiian")) {
            setImage(hawaiian); // Return the image path directly
            foundMatch = true;
        }
        else if(categories.includes("Apple Pie")||categories.includes("Blueberry Pie")||categories.includes("Cherry Pie")||categories.includes("Chess Pie")||categories.includes("Key Lime Pie")||categories.includes("Mincemeat Pie")||categories.includes("Pecan Pie")||categories.includes("Pies")||categories.includes("Pies")||categories.includes("Pumpkin Pie")||categories.includes("Rhubarb Pie")||categories.includes("Apple Pie")||categories.includes("Shepherd's Pie")){
            setImage(pie);
            foundMatch = true;
        }
        else if (categories.includes("Cake Recipes")) {
            setImage(cake); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Biscuit")||categories.includes("Biscotti")) {
            setImage(biscuit); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Baked Beans")) {
            setImage(bakedBeans); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Healthy Recipes")) {
            setImage(health); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Pet Food")) {
            setImage(petFood); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Ice Cream")) {
            setImage(icecream); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Drinks")) {
            setImage(drink); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Snacks")) {
            setImage(snacks); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Gumbo")) {
            setImage(gumbo); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Jerky")) {
            setImage(jerky); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Burgers")) {
            setImage(burgers); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Chicken Recipes")) {
            setImage(chicken); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Beef Recipes")) {
            setImage(beef); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Lamb Recipes")) {
            setImage(lamb); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Pork Recipes")) {
            setImage(pork); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Turkey")) {
            setImage(turkey); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Gravy")) {
            setImage(gravy); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Salad")||categories.includes("Broccoli Salad")||categories.includes("Chicken Salad")||categories.includes("Egg Salad")||categories.includes("Green Salads")||categories.includes("Pasta Salad")||categories.includes("Quinoa Salad Recipes")) {
            setImage(salad); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Bar Cookies")||categories.includes("Lemon Bars")) {
            setImage(bars); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Cobbler")) {
            setImage(cobbler); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Pickles")) {
            setImage(pickles); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Sandwhich")) {
            setImage(sandwhich); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Dip")) {
            setImage(dip); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Appetizers")) {
            setImage(appetizers); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Breakfast")) {
            setImage(breakfast); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Lunch")) {
            setImage(lunch); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Desserts")) {
            setImage(desserts); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Dinner Recipes")) {
            setImage(dinner); // Return the image path directly
            foundMatch = true;
        }
        else if (categories.includes("Main Dishes")) {
            setImage(main); // Return the image path directly
            foundMatch = true;
        }

        if (!foundMatch) {
            const randomFood=[food, sandwichFood,plannedFood,saladFood,chickenFood,greenFood,plateFood,noodleFood,indianFood,burgerFood];
            setImage(randomFood[Math.floor(Math.random()*10)]); // Or return a default image path
        }
    }, [image, categories]);

    return (
        <img src={image} alt="Recipe Image" />
    );
};

export default RecipeCardImage;
