import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheState {
  items: Record<string, CacheItem<unknown>>;
}

type CacheAction =
  | { type: 'SET_CACHE_ITEM'; key: string; data: unknown; ttl: number }
  | { type: 'REMOVE_CACHE_ITEM'; key: string }
  | { type: 'CLEAR_CACHE' };

const initialState: CacheState = {
  items: {},
};

const cacheReducer = (state: CacheState, action: CacheAction): CacheState => {
  switch (action.type) {
    case 'SET_CACHE_ITEM':
      return {
        ...state,
        items: {
          ...state.items,
          [action.key]: {
            data: action.data,
            timestamp: Date.now(),
            ttl: action.ttl,
          },
        },
      };
    case 'REMOVE_CACHE_ITEM':
      const { [action.key]: removed, ...remainingItems } = state.items;
      return {
        ...state,
        items: remainingItems,
      };
    case 'CLEAR_CACHE':
      return initialState;
    default:
      return state;
  }
};

interface CacheContextType {
  getItem: <T>(key: string) => T | null;
  setItem: <T>(key: string, data: T, ttl: number) => void;
  removeItem: (key: string) => void;
  clearCache: () => void;
}

const CacheContext = createContext<CacheContextType | undefined>(undefined);

interface CacheProviderProps {
  children: ReactNode;
}

export const CacheProvider: React.FC<CacheProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cacheReducer, initialState);

  const getItem = <T,>(key: string): T | null => {
    const item = state.items[key] as CacheItem<T> | undefined;
    
    if (!item) {
      return null;
    }

    const isExpired = Date.now() - item.timestamp > item.ttl;
    if (isExpired) {
      dispatch({ type: 'REMOVE_CACHE_ITEM', key });
      return null;
    }

    return item.data;
  };

  const setItem = <T,>(key: string, data: T, ttl: number) => {
    dispatch({ type: 'SET_CACHE_ITEM', key, data, ttl });
  };

  const removeItem = (key: string) => {
    dispatch({ type: 'REMOVE_CACHE_ITEM', key });
  };

  const clearCache = () => {
    dispatch({ type: 'CLEAR_CACHE' });
  };

  return (
    <CacheContext.Provider
      value={{
        getItem,
        setItem,
        removeItem,
        clearCache,
      }}
    >
      {children}
    </CacheContext.Provider>
  );
};

export const useCache = () => {
  const context = useContext(CacheContext);
  if (context === undefined) {
    throw new Error('useCache must be used within a CacheProvider');
  }
  return context;
}; 