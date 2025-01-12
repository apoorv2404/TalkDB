// Types for context data structures
export interface ColumnContextType {
    name: string;
    description?: string;
    businessContext?: string;
    technicalNotes?: string;
    dataType: string;
    constraints?: string[];
    exampleValues?: string[];
    lastUpdated?: string;
    updatedBy?: string;
}

export interface TableContextType {
    name: string;
    description?: string;
    businessContext?: string;
    technicalNotes?: string;
    primaryKey?: string[];
    foreignKeys?: Record<string, string>;
    columns?: ColumnContextType[];
    lastUpdated?: string;
    updatedBy?: string;
}

export interface DatabaseContextType {
    name: string;
    description?: string;
    businessContext?: string;
    technicalNotes?: string;
    domain?: string;
    tables?: TableContextType[];
    lastUpdated?: string;
    updatedBy?: string;
}

// API response types
export interface ApiResponse<T> {
    status: string;
    message?: string;
    data?: T;
    error?: string;
}

export interface ContextResponse {
    status: string;
    data?: {
        description?: string;
        businessContext?: string;
        technicalNotes?: string;
        [key: string]: any;
    };
    error?: string;
}

// Request types
export interface UpdateContextRequest {
    name: string;
    description?: string;
    businessContext?: string;
    technicalNotes?: string;
    [key: string]: any;
}

// Entity types
export type EntityType = 'database' | 'table' | 'column';

export interface EntityIdentifier {
    type: EntityType;
    name: string;
    parentName?: string;
}