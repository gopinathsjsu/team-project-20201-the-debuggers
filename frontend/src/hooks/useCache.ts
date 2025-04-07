import { useCallback } from 'react';
import { useCache as useCacheContext } from '../context/CacheContext';

interface UseCacheOptions {
  ttl?: number;
  key?: string;
}

export function useCache<T>(options: UseCacheOptions = {}) {
  const { ttl = 5 * 60 * 1000, key: baseKey = '' } = options;
  const cache = useCacheContext();

  const generateKey = useCallback(
    (key: string) => `${baseKey}${key}`.trim(),
    [baseKey]
  );

  const getData = useCallback(
    (key: string): T | null => {
      const cacheKey = generateKey(key);
      return cache.getItem<T>(cacheKey);
    },
    [cache, generateKey]
  );

  const setData = useCallback(
    (key: string, data: T) => {
      const cacheKey = generateKey(key);
      cache.setItem(cacheKey, data, ttl);
    },
    [cache, generateKey, ttl]
  );

  const removeData = useCallback(
    (key: string) => {
      const cacheKey = generateKey(key);
      cache.removeItem(cacheKey);
    },
    [cache, generateKey]
  );

  const clearCache = useCallback(() => {
    cache.clearCache();
  }, [cache]);

  return {
    getData,
    setData,
    removeData,
    clearCache,
  };
} 