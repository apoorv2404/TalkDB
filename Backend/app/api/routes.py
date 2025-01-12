from fastapi import APIRouter, HTTPException
from app.db.session import get_databases, get_tables
from app.utils.query_processing import process_natural_language_query, ingest_schema
from app.models.context import DatabaseContext, TableContext, ColumnContext, ContextResponse
from app.db.context_store import context_store
from typing import List, Dict, Any
from pydantic import BaseModel

# Define a Pydantic model for the query request
class QueryRequest(BaseModel):
    query: str  # The natural language query provided by the user
    database: str  # The database on which the query should be executed

# Create an API router instance
router = APIRouter()

# Endpoint to list all available databases
@router.get("/databases", response_model=List[str])
async def list_databases():
    """
    List all available databases.
    
    Returns:
        List[str]: A list of database names.
    Raises:
        HTTPException: If an error occurs while retrieving the databases.
    """
    try:
        return get_databases()  # Retrieve and return the list of databases
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))  # Raise an exception if an error occurs

# Endpoint to list all tables in a specific database with their structure
@router.get("/databases/{database}/tables", response_model=List[Dict[str, Any]])
async def list_tables(database: str):
    """
    List all tables in a specific database with their structure.
    
    Args:
        database (str): The name of the database.
        
    Returns:
        List[Dict[str, Any]]: A list of dictionaries representing table structures.
    Raises:
        HTTPException: If an error occurs while retrieving the tables.
    """
    try:
        return get_tables(database)  # Retrieve and return the list of tables
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))  # Raise an exception if an error occurs

# Endpoint to execute a natural language query on the specified database
@router.post("/query")
async def execute_query(request: QueryRequest):
    """
    Execute a natural language query on the specified database.
    
    Args:
        request (QueryRequest): The query request containing the query and database name.
        
    Returns:
        Any: The result of the executed query.
    Raises:
        HTTPException: If an error occurs while executing the query.
    """
    try:
        result = process_natural_language_query(request.query, request.database)  # Process and execute the query
        return result  # Return the query result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))  # Raise an exception if an error occurs

# Endpoint to ingest database schema into Milvus
@router.post("/ingest-schema")
async def ingest_database_schema(database: str):
    """
    Ingest database schema into Milvus.
    
    Args:
        database (str): The name of the database whose schema needs to be ingested.
        
    Returns:
        Dict[str, Any]: A dictionary containing a success message and the count of tables ingested.
    Raises:
        HTTPException: If an error occurs while ingesting the schema.
    """
    try:
        # Retrieve all tables from the specified database
        tables = get_tables(database)
        
        # Format the schema for ingestion
        schema_dict = {
            table["name"]: {
                "columns": table["columns"]
            } for table in tables
        }
        
        # Ingest the schema into Milvus
        count = ingest_schema(schema_dict, f"{database}_schema")
        
        # Return a success message with the count of ingested tables
        return {"message": f"Successfully ingested schema for {count} tables"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))  # Raise an exception if an error occurs


@router.get("/database/{db_name}/context")
async def get_database_context(
    db_name: str,
    include_tables: bool = False,
    include_columns: bool = False
) -> ContextResponse:
    """
    Retrieve context for a database.
    
    Args:
        db_name: Database name
        include_tables: If True, includes context for all tables
        include_columns: If True, includes context for all columns
    """
    try:
        context = await context_store.retrieve_context(
            entity_type="database",
            entity_name=db_name,
            include_children=include_tables or include_columns
        )
        return context
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/database/{db_name}/context")
async def update_database_context(
    db_name: str,
    context: DatabaseContext
) -> ContextResponse:
    """
    Update or create context for a database.
    
    Args:
        db_name: Database name
        context: Database context information
    """
    try:
        updated_context = await context_store.store_context(
            entity_type="database",
            entity_name=db_name,
            context_data=context.dict()
        )
        return updated_context
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/database/{db_name}/table/{table_name}/context")
async def get_table_context(
    db_name: str,
    table_name: str,
    include_columns: bool = False
) -> ContextResponse:
    """
    Retrieve context for a specific table.
    
    Args:
        db_name: Database name
        table_name: Table name
        include_columns: If True, includes context for all columns
    """
    try:
        context = await context_store.retrieve_context(
            entity_type="table",
            entity_name=f"{db_name}.{table_name}",
            include_children=include_columns
        )
        return context
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/database/{db_name}/table/{table_name}/context")
async def update_table_context(
    db_name: str,
    table_name: str,
    context: TableContext
) -> ContextResponse:
    """
    Update or create context for a table.
    
    Args:
        db_name: Database name
        table_name: Table name
        context: Table context information
    """
    try:
        updated_context = await context_store.store_context(
            entity_type="table",
            entity_name=f"{db_name}.{table_name}",
            context_data=context.dict()
        )
        return updated_context
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/database/{db_name}/table/{table_name}/column/{column_name}/context")
async def get_column_context(
    db_name: str,
    table_name: str,
    column_name: str
) -> ContextResponse:
    """
    Retrieve context for a specific column.
    
    Args:
        db_name: Database name
        table_name: Table name
        column_name: Column name
    """
    try:
        context = await context_store.retrieve_context(
            entity_type="column",
            entity_name=f"{db_name}.{table_name}.{column_name}"
        )
        return context
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/database/{db_name}/table/{table_name}/column/{column_name}/context")
async def update_column_context(
    db_name: str,
    table_name: str,
    column_name: str,
    context: ColumnContext
) -> ContextResponse:
    """
    Update or create context for a column.
    
    Args:
        db_name: Database name
        table_name: Table name
        column_name: Column name
        context: Column context information
    """
    try:
        updated_context = await context_store.store_context(
            entity_type="column",
            entity_name=f"{db_name}.{table_name}.{column_name}",
            context_data=context.dict()
        )
        return updated_context
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Optional: Bulk operations for efficiency

@router.put("/database/{db_name}/bulk-context")
async def update_bulk_context(
    db_name: str,
    context: DatabaseContext,
    include_tables: bool = True,
    include_columns: bool = True
) -> ContextResponse:
    """
    Bulk update context for database, its tables, and columns.
    
    Args:
        db_name: Database name
        context: Complete context hierarchy
        include_tables: If True, updates table contexts
        include_columns: If True, updates column contexts
    """
    try:
        # Implement bulk update logic
        pass
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))