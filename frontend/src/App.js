import './App.css';
import React, { useState } from 'react'; // Add useState import
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Add Navigate import
import RecipeSuggestionPage from './Pages/Recipe Suggestion Page/RecipeSuggestionPage';
import NavBar from './Universal Components/Nav Bar/NavBar';
import Header from './Universal Components/Header/Header';
import PantryPage from './Pages/Pantry Page/PantryPage';
import LoginPage from './Pages/Login Page/LoginPage';

function App() {
  const [loggedIn, setLoggedIn] = useState(() => {
    // Check if there's a valid access token in localStorage when the app loads
    return !!localStorage.getItem("access_token");
  });

  const handleLogin = () => {
    setLoggedIn(true);
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token");  // Clear the token on logout
    localStorage.removeItem("refresh_token");
    setLoggedIn(false);
  }

  return (
    <div className="App">
      <Router>
        <Header />
        <div className="pageContent">
          <NavBar onLogout={handleLogout} />
          <Routes>
            <Route path="/" element={loggedIn ? <RecipeSuggestionPage /> : <Navigate to="/login" />} />
            <Route path="/pantry" element={loggedIn ? <PantryPage /> : <Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
