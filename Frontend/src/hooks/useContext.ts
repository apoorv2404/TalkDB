import { useState, useCallback } from 'react';
import { contextApi } from '@/lib/api/context';
import {
    EntityType,
    DatabaseContextType,
    //TableContextType,
    //ColumnContextType,
    UpdateContextRequest
} from '@/lib/api/types';

interface UseContextOptions {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export function useContext(options: UseContextOptions = {}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const getContext = useCallback(async (
        entityType: EntityType,
        params: {
            dbName: string;
            tableName?: string;
            columnName?: string;
            includeChildren?: boolean;
        }
    ) => {
        setLoading(true);
        setError(null);
        
        try {
            let result;
            switch (entityType) {
                case 'database':
                    result = await contextApi.getDatabaseContext(params.dbName, params.includeChildren);
                    break;
                case 'table':
                    if (!params.tableName) throw new Error('Table name is required');
                    result = await contextApi.getTableContext(params.dbName, params.tableName, params.includeChildren);
                    break;
                case 'column':
                    if (!params.tableName || !params.columnName) throw new Error('Table and column names are required');
                    result = await contextApi.getColumnContext(params.dbName, params.tableName, params.columnName);
                    break;
                default:
                    throw new Error(`Invalid entity type: ${entityType}`);
            }
            
            options.onSuccess?.();
            return result.data;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('An error occurred');
            setError(error);
            options.onError?.(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [options]);

    const updateContext = useCallback(async (
        entityType: EntityType,
        params: {
            dbName: string;
            tableName?: string;
            columnName?: string;
        },
        context: UpdateContextRequest
    ) => {
        setLoading(true);
        setError(null);
        
        try {
            let result;
            switch (entityType) {
                case 'database':
                    result = await contextApi.updateDatabaseContext(params.dbName, context);
                    break;
                case 'table':
                    if (!params.tableName) throw new Error('Table name is required');
                    result = await contextApi.updateTableContext(params.dbName, params.tableName, context);
                    break;
                case 'column':
                    if (!params.tableName || !params.columnName) throw new Error('Table and column names are required');
                    result = await contextApi.updateColumnContext(params.dbName, params.tableName, params.columnName, context);
                    break;
                default:
                    throw new Error(`Invalid entity type: ${entityType}`);
            }
            
            options.onSuccess?.();
            return result.data;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('An error occurred');
            setError(error);
            options.onError?.(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [options]);

    const bulkUpdate = useCallback(async (
        dbName: string,
        context: DatabaseContextType
    ) => {
        setLoading(true);
        setError(null);
        
        try {
            const result = await contextApi.bulkUpdateContext(dbName, context);
            options.onSuccess?.();
            return result.data;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('An error occurred');
            setError(error);
            options.onError?.(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [options]);

    return {
        loading,
        error,
        getContext,
        updateContext,
        bulkUpdate
    };
}