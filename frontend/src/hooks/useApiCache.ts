import { useCallback } from 'react';
import { useCache } from './useCache';
import { ApiError } from '../types/api';

interface UseApiCacheOptions<T> {
  ttl?: number;
  key?: string;
  onError?: (error: ApiError) => void;
  transform?: (data: T) => T;
}

export function useApiCache<T>(options: UseApiCacheOptions<T> = {}) {
  const {
    ttl = 5 * 60 * 1000,
    key: baseKey = '',
    onError,
    transform = (data: T) => data,
  } = options;

  const cache = useCache<T>({ ttl, key: baseKey });

  const fetchWithCache = useCallback(
    async (
      key: string,
      apiCall: () => Promise<T>,
      skipCache = false
    ): Promise<T> => {
      // Try to get from cache first
      if (!skipCache) {
        const cachedData = cache.getData(key);
        if (cachedData) {
          return transform(cachedData);
        }
      }

      try {
        // Make API call
        const data = await apiCall();
        // Store in cache
        cache.setData(key, data);
        return transform(data);
      } catch (error) {
        if (onError && error instanceof Error) {
          onError(error as ApiError);
        }
        throw error;
      }
    },
    [cache, transform, onError]
  );

  const invalidateCache = useCallback(
    (key: string) => {
      cache.removeData(key);
    },
    [cache]
  );

  const clearAllCache = useCallback(() => {
    cache.clearCache();
  }, [cache]);

  return {
    fetchWithCache,
    invalidateCache,
    clearAllCache,
  };
} 