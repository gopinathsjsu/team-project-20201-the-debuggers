import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RestaurantPage from './pages/RestaurantPage';
import SearchResultsPage from './pages/SearchResultsPage';
import BookingPage from './pages/BookingPage';
import UserProfilePage from './pages/UserProfilePage';
import RestaurantDashboardPage from './pages/RestaurantDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { UserRole } from './types/user';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/restaurant/:id" element={<RestaurantPage />} />
              <Route 
                path="/booking/:id" 
                element={
                  <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
                    <BookingPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
                    <UserProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/restaurant-dashboard" 
                element={
                  <ProtectedRoute allowedRoles={[UserRole.RESTAURANT_MANAGER]}>
                    <RestaurantDashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position="top-center" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App; 