import { AxiosInstance, AxiosError } from 'axios';
import { ApiError } from '../types/api';

export const setupInterceptors = (axiosInstance: AxiosInstance) => {
  // Request interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      // You can modify the request config here
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      const apiError: ApiError = {
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'An unexpected error occurred',
        errors: error.response?.data?.errors,
      };

      return Promise.reject(apiError);
    }
  );
};

export const setupAuthInterceptor = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config;
      
      if (error.response?.status === 401 && originalRequest) {
        // Handle token refresh logic here
        try {
          // Implement your token refresh logic
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );
}; 