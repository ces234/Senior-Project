import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const login = (userData) => {
        setUser(userData);
        if (userData.token) {
            setToken(userData.token);
            localStorage.setItem('token', userData.token);
        }
    };

    const isMember = () => {
        return (user && user.status === 'member'); // Check if user is a member
    };

    const isAdmin = () => {
        return (user && user.status === 'admin');
    }

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };



    return (
        <AuthContext.Provider value={{ user, token, login, logout, isMember }}>
            {children}
        </AuthContext.Provider>
    );
};
