import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeSuggestionPage from './Pages/Recipe Suggestion Page/RecipeSuggestionPage';
import NavBar from './Universal Components/Nav Bar/NavBar';

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar /> 
        <Routes>
          <Route path="/" element={<RecipeSuggestionPage />} /> {/* Home page */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
