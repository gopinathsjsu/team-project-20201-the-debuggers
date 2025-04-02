import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/user';

const Header = () => {
  const { user, logout, isRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">BookTable</Link>
        
        <nav className="flex items-center space-x-6">
          <Link to="/search" className="text-gray-700 hover:text-blue-600">Find a Table</Link>
          
          {user ? (
            <div className="flex items-center space-x-4">
              {isRole([UserRole.CUSTOMER]) && (
                <Link to="/profile" className="text-gray-700 hover:text-blue-600">My Reservations</Link>
              )}
              
              {isRole([UserRole.RESTAURANT_MANAGER]) && (
                <Link to="/restaurant-dashboard" className="text-gray-700 hover:text-blue-600">Restaurant Dashboard</Link>
              )}
              
              {isRole([UserRole.ADMIN]) && (
                <Link to="/admin" className="text-gray-700 hover:text-blue-600">Admin Dashboard</Link>
              )}
              
              <button onClick={handleLogout} className="text-gray-700 hover:text-blue-600">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Sign Up</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header; 