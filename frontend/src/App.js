import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeSuggestionPage from './Pages/Recipe Suggestion Page/RecipeSuggestionPage';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<RecipeSuggestionPage />} /> {/* Home page */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
