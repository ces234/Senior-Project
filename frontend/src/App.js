import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeSuggestionPage from './Pages/Recipe Suggestion Page/RecipeSuggestionPage';
import NavBar from './Universal Components/Nav Bar/NavBar';
import Header from './Universal Components/Header/Header';
import PantryPage from './Pages/Pantry Page/PantryPage';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <div className = "pageContent">
        <NavBar /> 
        <Routes>
          <Route path="/" element={<RecipeSuggestionPage />} /> {/* Home page */}
          <Route path="/pantry" element={<PantryPage />} /> {/* Home page */}
        </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
