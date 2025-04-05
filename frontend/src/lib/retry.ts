import { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiErrorHandler } from './errorHandler';

interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  retryableStatuses: number[];
}

const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
};

export const setupRetry = (
  axiosInstance: AxiosInstance,
  config: Partial<RetryConfig> = {}
) => {
  const retryConfig = { ...defaultRetryConfig, ...config };

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const config = error.config as AxiosRequestConfig & { _retry?: number };
      
      if (!config || !shouldRetry(error, config, retryConfig)) {
        return Promise.reject(error);
      }

      config._retry = (config._retry || 0) + 1;
      
      const delay = calculateDelay(config._retry, retryConfig.retryDelay);
      await sleep(delay);

      return axiosInstance(config);
    }
  );
};

const shouldRetry = (
  error: AxiosError,
  config: AxiosRequestConfig & { _retry?: number },
  retryConfig: RetryConfig
): boolean => {
  if (!config._retry) {
    config._retry = 0;
  }

  if (config._retry >= retryConfig.maxRetries) {
    return false;
  }

  if (ApiErrorHandler.isNetworkError(error)) {
    return true;
  }

  if (error.response?.status && retryConfig.retryableStatuses.includes(error.response.status)) {
    return true;
  }

  return false;
};

const calculateDelay = (retryCount: number, baseDelay: number): number => {
  // Exponential backoff with jitter
  const exponentialDelay = baseDelay * Math.pow(2, retryCount - 1);
  const jitter = Math.random() * 0.3 * exponentialDelay;
  return exponentialDelay + jitter;
};

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}; 