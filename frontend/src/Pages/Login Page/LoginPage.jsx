import React, { useState } from 'react';
import { useAuth } from '../../AuthContext'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth(); // Get the login function
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Implement the login API call
    const response = await fetch('http://localhost:8000/api/user/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      login(data.user); // Call the login function with user data
      console.log(data.user);
      navigate('/'); // Redirect to the homepage after login
    } else {
      alert('Login failed!'); // Handle login failure
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginPage;
