export interface Column {
    name: string;
    type: string;
    nullable: boolean;
}

export interface Table {
    name: string;
    description: string;
    columns: Column[];
}

export interface Database {
    name: string;
    tables?: Table[];
}

export interface QueryResult {
    results: any[];
    sql_query: string;
    schema_context: string[];
}

export interface TableViewProps {
    table: Table;
    onBack: () => void;
    dbName: string;
}

export interface TablesGridProps {
    tables: Table[];
    onTableSelect: (table: Table) => void;
    dbName: string;
}

export interface ResultsViewProps {
    results: QueryResult | null;
}