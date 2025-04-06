import axios from 'axios';
import { setupInterceptors, setupAuthInterceptor } from './interceptors';
import { ApiConfig } from '../types/api';

const defaultConfig: ApiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  retryCount: 3,
};

class ApiClient {
  private static instance: ApiClient;
  private axiosInstance;

  private constructor(config: ApiConfig = defaultConfig) {
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    setupInterceptors(this.axiosInstance);
    setupAuthInterceptor(this.axiosInstance);
  }

  public static getInstance(config?: ApiConfig): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient(config);
    }
    return ApiClient.instance;
  }

  get instance() {
    return this.axiosInstance;
  }
}

export const apiClient = ApiClient.getInstance().instance; 