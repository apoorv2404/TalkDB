from fastapi import APIRouter, HTTPException
from app.db.session import get_databases, get_tables
from app.utils.query_processing import process_natural_language_query, ingest_schema
from typing import List, Dict, Any
from pydantic import BaseModel

class QueryRequest(BaseModel):
    query: str
    database: str

router = APIRouter()

@router.get("/databases", response_model=List[str])
async def list_databases():
    """List all available databases."""
    try:
        return get_databases()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/databases/{database}/tables", response_model=List[Dict[str, Any]])
async def list_tables(database: str):
    """List all tables in a specific database with their structure."""
    try:
        return get_tables(database)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/query")
async def execute_query(request: QueryRequest):
    """Execute a natural language query on the specified database."""
    try:
        result = process_natural_language_query(request.query, request.database)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/ingest-schema")
async def ingest_database_schema(database: str):
    """Ingest database schema into Milvus."""
    try:
        # Get database schema
        tables = get_tables(database)
        
        # Format schema for ingestion
        schema_dict = {
            table["name"]: {
                "columns": table["columns"]
            } for table in tables
        }
        
        # Ingest schema
        count = ingest_schema(schema_dict, f"{database}_schema")
        return {"message": f"Successfully ingested schema for {count} tables"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))