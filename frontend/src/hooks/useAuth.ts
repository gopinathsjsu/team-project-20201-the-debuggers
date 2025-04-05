import { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { LoginCredentials, RegisterData, AuthResponse, User } from '../types/auth';
import { api } from '../lib/api';
import { ApiError } from '../types/api';

interface UseAuthResult {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = (): UseAuthResult => {
  const { login: setAuth, logout: clearAuth, isLoading: contextLoading } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: unknown) => {
    if ((error as ApiError).message) {
      setError((error as ApiError).message);
    } else {
      setError('An unexpected error occurred');
    }
    setIsLoading(false);
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      setAuth(response.data.token, response.data.user);
    } catch (error) {
      handleError(error);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.post<AuthResponse>('/auth/register', data);
      setAuth(response.data.token, response.data.user);
    } catch (error) {
      handleError(error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await api.post('/auth/reset-password', { email });
      setIsLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await api.post('/auth/update-password', { currentPassword, newPassword });
      setIsLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  return {
    login,
    register,
    logout: clearAuth,
    resetPassword,
    updatePassword,
    isLoading: isLoading || contextLoading,
    error,
  };
}; 