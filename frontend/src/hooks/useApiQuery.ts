import { useState, useCallback, useEffect } from 'react';
import { useApiCache } from './useApiCache';
import { ApiError } from '../types/api';

interface UseApiQueryOptions<T> {
  key: string;
  apiCall: () => Promise<T>;
  enabled?: boolean;
  ttl?: number;
  transform?: (data: T) => T;
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
}

interface UseApiQueryResult<T> {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
  invalidate: () => void;
}

export function useApiQuery<T>(options: UseApiQueryOptions<T>): UseApiQueryResult<T> {
  const {
    key,
    apiCall,
    enabled = true,
    ttl,
    transform,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const apiCache = useApiCache<T>({
    ttl,
    key,
    transform,
    onError: (err) => {
      setError(err);
      onError?.(err);
    },
  });

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await apiCache.fetchWithCache(key, apiCall);
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      // Error is handled by apiCache onError callback
    } finally {
      setIsLoading(false);
    }
  }, [apiCall, apiCache, key, onSuccess]);

  const invalidate = useCallback(() => {
    apiCache.invalidateCache(key);
  }, [apiCache, key]);

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled, fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    invalidate,
  };
} 