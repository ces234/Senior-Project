import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null); // Optional: if you're using token-based auth

    const login = (userData) => {
        setUser(userData);
        // If you receive a token, store it
        if (userData.token) {
            setToken(userData.token);
            localStorage.setItem('token', userData.token); // Store token in localStorage
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token'); // Remove token on logout
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
