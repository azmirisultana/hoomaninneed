import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';



/**
 * ProtectedRoute component
 * Redirects unauthenticated users to the login page.
 * Optionally checks if the user has the required role.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-brand-primary font-medium">Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login but save the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required and user doesn't have one, redirect to unauthorized/dashboard
  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    // Basic redirect based on role
    switch (user.role) {
      case 'donor': return <Navigate to="/donor" replace />;
      case 'volunteer': return <Navigate to="/volunteer" replace />;
      case 'organization': return <Navigate to="/organization" replace />;
      case 'admin': return <Navigate to="/admin" replace />;
      default: return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
