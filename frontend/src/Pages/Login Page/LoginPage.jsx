import React, { useState } from 'react';
import { useAuth } from '../../AuthContext'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Import the CSS file

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert('Please fill in both fields.');
      return;
    }

    setIsLoading(true);

    const response = await fetch('http://localhost:8000/user/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    setIsLoading(false);

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      login(data.user);
      navigate('/recipes');
    } else {
      const errorData = await response.json();
      alert(`Login failed: ${errorData.detail || 'Unknown error'}`);
    }
  };

  return (
    <div className="outerContainer">
      <div className="innerContainer">
        <div className="loginFormContainer">
          <form className="loginForm" onSubmit={handleLogin}>
            <h1 className="loginTitle">Login</h1>
            <label className="inputLabel">
              Username:
              <input
                className="textInput"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
            <label className="inputLabel">
              Password:
              <input
                className="textInput"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <button className="loginButton" type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="registerPrompt">
            New here? <a href="/register">Make an account</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
