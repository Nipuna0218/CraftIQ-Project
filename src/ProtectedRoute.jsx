import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userData = JSON.parse(localStorage.getItem('user'));

  if (!userData) {
    return <Navigate to="/register" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userData.role)) {
    return <Navigate to="/register" replace />;
  }

  return children;
};

export default ProtectedRoute;
