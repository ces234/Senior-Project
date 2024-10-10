import "./App.css";
import React from "react"; 
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; 
import RecipeSuggestionPage from "./Pages/Recipe Suggestion Page/RecipeSuggestionPage";
import NavBar from "./Universal Components/Nav Bar/NavBar";
import Header from "./Universal Components/Header/Header";
import PantryPage from "./Pages/Pantry Page/PantryPage";
import LoginPage from "./Pages/Login Page/LoginPage";
import MealPlanPage from "./Pages/Meal Plan Page/MealPlanPage";
import GroceryListPage from "./Pages/Grocery List Page/GroceryListPage";
import { AuthProvider, useAuth } from "./AuthContext"; // Ensure correct path

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <Header />
          <div className="pageContent">
            <NavBar />
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/recipes" element={<PrivateRoute component={RecipeSuggestionPage} />} /> {/* Protect RecipeSuggestionPage */}
              <Route path="/pantry" element={<PrivateRoute component={PantryPage} />} /> {/* Protect PantryPage */}
              <Route path = "/meal-plan" element = {<PrivateRoute component={MealPlanPage} />} />
              <Route path = "/grocery-list" element = {<PrivateRoute component={GroceryListPage} />} />
            </Routes>
          </div>
        </Router>
      </div>
    </AuthProvider>
  );
}

function PrivateRoute({ component: Component }) {
  const { user } = useAuth(); // Get the user from auth context
  return user ? <Component /> : <Navigate to="/" replace />; // Render the component if authenticated, otherwise redirect
}

export default App;
