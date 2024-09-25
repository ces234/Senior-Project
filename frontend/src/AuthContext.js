import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for authentication
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Retrieve user data from local storage
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null; // Initialize state with stored user
  });

  const login = (userData) => {
    setUser(userData); // Save user data in state
    localStorage.setItem('user', JSON.stringify(userData)); // Save user data in local storage
  };

  const logout = () => {
    setUser(null); // Clear user data
    localStorage.removeItem('user'); // Remove user data from local storage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
