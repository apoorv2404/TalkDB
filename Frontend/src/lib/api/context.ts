import {
    DatabaseContextType,
    TableContextType,
    ColumnContextType,
    ApiResponse,
    EntityType,
    UpdateContextRequest
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class ContextAPI {
    private async fetchWithError(url: string, options?: RequestInit): Promise<any> {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'An error occurred');
        }

        return response.json();
    }

    async getDatabaseContext(dbName: string, includeTables = false): Promise<ApiResponse<DatabaseContextType>> {
        const url = `${API_BASE_URL}/api/database/${dbName}/context?include_tables=${includeTables}`;
        return this.fetchWithError(url);
    }

    async updateDatabaseContext(dbName: string, context: UpdateContextRequest): Promise<ApiResponse<DatabaseContextType>> {
        const url = `${API_BASE_URL}/api/database/${dbName}/context`;
        return this.fetchWithError(url, {
            method: 'PUT',
            body: JSON.stringify(context),
        });
    }

    async getTableContext(
        dbName: string,
        tableName: string,
        includeColumns = false
    ): Promise<ApiResponse<TableContextType>> {
        const url = `${API_BASE_URL}/api/database/${dbName}/table/${tableName}/context?include_columns=${includeColumns}`;
        return this.fetchWithError(url);
    }

    async updateTableContext(
        dbName: string,
        tableName: string,
        context: UpdateContextRequest
    ): Promise<ApiResponse<TableContextType>> {
        const url = `${API_BASE_URL}/api/database/${dbName}/table/${tableName}/context`;
        return this.fetchWithError(url, {
            method: 'PUT',
            body: JSON.stringify(context),
        });
    }

    async getColumnContext(
        dbName: string,
        tableName: string,
        columnName: string
    ): Promise<ApiResponse<ColumnContextType>> {
        const url = `${API_BASE_URL}/api/database/${dbName}/table/${tableName}/column/${columnName}/context`;
        return this.fetchWithError(url);
    }

    async updateColumnContext(
        dbName: string,
        tableName: string,
        columnName: string,
        context: UpdateContextRequest
    ): Promise<ApiResponse<ColumnContextType>> {
        const url = `${API_BASE_URL}/api/database/${dbName}/table/${tableName}/column/${columnName}/context`;
        return this.fetchWithError(url, {
            method: 'PUT',
            body: JSON.stringify(context),
        });
    }

    async bulkUpdateContext(
        dbName: string,
        context: DatabaseContextType
    ): Promise<ApiResponse<DatabaseContextType>> {
        const url = `${API_BASE_URL}/api/database/${dbName}/bulk-context`;
        return this.fetchWithError(url, {
            method: 'PUT',
            body: JSON.stringify(context),
        });
    }

    // Helper method to construct context URL based on entity type
    getContextUrl(entityType: EntityType, params: { 
        dbName: string; 
        tableName?: string; 
        columnName?: string; 
    }): string {
        const { dbName, tableName, columnName } = params;
        
        switch (entityType) {
            case 'database':
                return `${API_BASE_URL}/api/database/${dbName}/context`;
            case 'table':
                return `${API_BASE_URL}/api/database/${dbName}/table/${tableName}/context`;
            case 'column':
                return `${API_BASE_URL}/api/database/${dbName}/table/${tableName}/column/${columnName}/context`;
            default:
                throw new Error(`Invalid entity type: ${entityType}`);
        }
    }
}

// Export a singleton instance
export const contextApi = new ContextAPI();