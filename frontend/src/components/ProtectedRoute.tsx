import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/user';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [UserRole.CUSTOMER, UserRole.RESTAURANT_MANAGER, UserRole.ADMIN] 
}) => {
  const { user, loading, isRole } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!isRole(allowedRoles)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}; 