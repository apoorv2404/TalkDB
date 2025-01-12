import React, { createContext, useContext, useState, useCallback } from 'react';
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

export const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
    // State
    const [state, setState] = useState<ContextState>({
        selectedEntity: null,
        isEditorOpen: false
    });

    // Get context hook
    const { loading, error, getContext, updateContext } = useContextHook({
        onSuccess: () => {
            // Optionally handle success
        },
        onError: (error) => {
            console.error('Context operation failed:', error);
            // Optionally handle error
        }
    });

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
            isEditorOpen: false
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