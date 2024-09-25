// PrivateRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Adjust the import path as necessary

const PrivateRoute = ({ element, ...rest }) => {
  const { user } = useAuth(); // Assuming user is part of your auth context

  return (
    <Route
      {...rest}
      element={user ? element : <Navigate to="/login" replace />} // Redirect to login if not authenticated
    />
  );
};

export default PrivateRoute;
