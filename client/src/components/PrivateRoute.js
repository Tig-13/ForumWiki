import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, user }) => {
  if (!user || user.role === 'Guest') {
    return <Navigate to="/login" />;
  }
  return element;
};

export default PrivateRoute;
