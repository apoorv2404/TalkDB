import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useContext as useContextHook } from '@/hooks/useContext';
import { EntityType, DatabaseContextType, TableContextType, ColumnContextType } from '@/lib/api/types';

interface ContextProviderProps {
    children: React.ReactNode;
}

interface ContextState {
    selectedEntity: {
        type: EntityType;
        name: string;
        parentName?: string;
    } | null;
    isEditorOpen: boolean;
}

interface CachedContext {
    type: EntityType;
    key: string;
    data: any;
    timestamp: number;
}

interface ContextContextValue {
    state: ContextState;
    loading: boolean;
    error: Error | null;
    openEditor: (type: EntityType, name: string, parentName?: string) => void;
    closeEditor: () => void;
    getContext: (type: EntityType, params: { 
        dbName: string; 
        tableName?: string; 
        columnName?: string; 
        includeChildren?: boolean;
    }) => Promise<any>;
    updateContext: (type: EntityType, params: {
        dbName: string;
        tableName?: string;
        columnName?: string;
    }, context: any) => Promise<any>;
}

const ContextContext = createContext<ContextContextValue | undefined>(undefined);

// Cache expiration time (5 minutes)
const CACHE_EXPIRY = 5 * 60 * 1000;

export const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
    // State
    const [state, setState] = useState<ContextState>({
        selectedEntity: null,
        isEditorOpen: false
    });

    // Cache ref to persist between renders
    const contextCache = useRef<Map<string, CachedContext>>(new Map());
    const pendingRequests = useRef<Map<string, Promise<any>>>(new Map());

    // Get context hook
    const { loading, error, getContext: hookGetContext, updateContext: hookUpdateContext } = useContextHook({
        onSuccess: () => {
            // Optionally handle success
        },
        onError: (error) => {
            console.error('Context operation failed:', error);
        }
    });

    const getCacheKey = (type: EntityType, params: any): string => {
        return `${type}:${params.dbName}${params.tableName ? ':' + params.tableName : ''}${params.columnName ? ':' + params.columnName : ''}`;
    };

    const getContext = useCallback(async (type: EntityType, params: { 
        dbName: string; 
        tableName?: string; 
        columnName?: string; 
        includeChildren?: boolean;
    }) => {
        const cacheKey = getCacheKey(type, params);
        
        // Check if there's a pending request
        if (pendingRequests.current.has(cacheKey)) {
            return pendingRequests.current.get(cacheKey);
        }

        // Check cache
        const cached = contextCache.current.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp) < CACHE_EXPIRY) {
            return cached.data;
        }

        // Create new request
        const request = hookGetContext(type, params).then(result => {
            // Update cache with new data
            contextCache.current.set(cacheKey, {
                type,
                key: cacheKey,
                data: result,
                timestamp: Date.now()
            });
            // Clear pending request
            pendingRequests.current.delete(cacheKey);
            return result;
        });

        // Store pending request
        pendingRequests.current.set(cacheKey, request);

        return request;
    }, [hookGetContext]);

    const updateContext = useCallback(async (type: EntityType, params: any, context: any) => {
        const result = await hookUpdateContext(type, params, context);
        
        // Update cache with new data
        const cacheKey = getCacheKey(type, params);
        contextCache.current.set(cacheKey, {
            type,
            key: cacheKey,
            data: result,
            timestamp: Date.now()
        });

        return result;
    }, [hookUpdateContext]);

    // Actions
    const openEditor = useCallback((type: EntityType, name: string, parentName?: string) => {
        setState(prev => ({
            ...prev,
            selectedEntity: { type, name, parentName },
            isEditorOpen: true
        }));
    }, []);

    const closeEditor = useCallback(() => {
        setState(prev => ({
            ...prev,
            isEditorOpen: false,
            selectedEntity: null // Reset selected entity when closing
        }));
    }, []);

    // Context value
    const value: ContextContextValue = {
        state,
        loading,
        error,
        openEditor,
        closeEditor,
        getContext,
        updateContext
    };

    return (
        <ContextContext.Provider value={value}>
            {children}
        </ContextContext.Provider>
    );
};

// Custom hook to use context
export const useContextProvider = () => {
    const context = useContext(ContextContext);
    if (context === undefined) {
        throw new Error('useContextProvider must be used within a ContextProvider');
    }
    return context;
};