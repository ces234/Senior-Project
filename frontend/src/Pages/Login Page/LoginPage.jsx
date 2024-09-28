import React, { useState } from 'react';
import { useAuth } from '../../AuthContext'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); // Get the login function
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!username || !password) {
      alert('Please fill in both fields.');
      return;
    }

    setIsLoading(true); // Start loading

    const response = await fetch('http://localhost:8000/user/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    setIsLoading(false); // Stop loading

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token); // Store token
      login(data.user); // Update context with user data
      navigate('/recipes'); // Redirect to recipes page
    } else {
      const errorData = await response.json();
      alert(`Login failed: ${errorData.detail || 'Unknown error'}`);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginPage;
