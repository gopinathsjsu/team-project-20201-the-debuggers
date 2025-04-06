import { useState, useCallback } from 'react';
import { ApiError } from '../types/api';

interface UseApiMutationOptions<T, V> {
  mutationFn: (variables: V) => Promise<T>;
  onSuccess?: (data: T, variables: V) => void | Promise<void>;
  onError?: (error: ApiError, variables: V) => void;
  onSettled?: (data: T | null, error: ApiError | null, variables: V) => void;
}

interface UseApiMutationResult<T, V> {
  mutate: (variables: V) => Promise<void>;
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
  reset: () => void;
}

export function useApiMutation<T, V = void>(
  options: UseApiMutationOptions<T, V>
): UseApiMutationResult<T, V> {
  const { mutationFn, onSuccess, onError, onSettled } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const mutate = useCallback(
    async (variables: V) => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await mutationFn(variables);
        setData(result);

        await onSuccess?.(result, variables);
        onSettled?.(result, null, variables);

        return result;
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError);
        onError?.(apiError, variables);
        onSettled?.(null, apiError, variables);
        throw apiError;
      } finally {
        setIsLoading(false);
      }
    },
    [mutationFn, onSuccess, onError, onSettled]
  );

  return {
    mutate,
    data,
    isLoading,
    error,
    reset,
  };
} 