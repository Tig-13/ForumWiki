import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, user, requiredRole }) => {
  if (!user || user.role === 'Guest') {
    return <Navigate to="/login" />;
  }
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;  
  }
  
  return element;
};

export default PrivateRoute;
