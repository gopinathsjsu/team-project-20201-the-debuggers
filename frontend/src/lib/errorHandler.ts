import { AxiosError } from 'axios';
import { ApiError } from '../types/api';

export class ApiErrorHandler {
  static handle(error: AxiosError | ApiError): ApiError {
    if (this.isApiError(error)) {
      return error;
    }

    if (error.response) {
      return {
        status: error.response.status,
        message: this.getErrorMessage(error),
        errors: error.response.data?.errors,
      };
    }

    return {
      status: 500,
      message: 'Network error or server is unreachable',
    };
  }

  static isApiError(error: any): error is ApiError {
    return 'status' in error && 'message' in error;
  }

  private static getErrorMessage(error: AxiosError): string {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    switch (error.response?.status) {
      case 400:
        return 'Bad request - please check your input';
      case 401:
        return 'Unauthorized - please login again';
      case 403:
        return 'Forbidden - you don\'t have permission to access this resource';
      case 404:
        return 'Resource not found';
      case 422:
        return 'Validation error - please check your input';
      case 429:
        return 'Too many requests - please try again later';
      case 500:
        return 'Internal server error - please try again later';
      default:
        return 'An unexpected error occurred';
    }
  }

  static isNetworkError(error: AxiosError): boolean {
    return !error.response && !!error.request;
  }

  static isTimeout(error: AxiosError): boolean {
    return error.code === 'ECONNABORTED';
  }
} 