from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class ColumnContext(BaseModel):
    name: str
    description: Optional[str] = None
    business_context: Optional[str] = None
    technical_notes: Optional[str] = None
    data_type: str
    constraints: Optional[List[str]] = None
    example_values: Optional[List[str]] = None
    last_updated: Optional[datetime] = Field(default_factory=datetime.now)
    updated_by: Optional[str] = None
    
class TableContext(BaseModel):
    name: str
    description: Optional[str] = None
    business_context: Optional[str] = None
    technical_notes: Optional[str] = None
    primary_key: Optional[List[str]] = None
    foreign_keys: Optional[Dict[str, str]] = None  # column -> referenced table.column
    columns: Optional[List[ColumnContext]] = None
    last_updated: Optional[datetime] = Field(default_factory=datetime.now)
    updated_by: Optional[str] = None

class DatabaseContext(BaseModel):
    name: str
    description: Optional[str] = None
    business_context: Optional[str] = None
    technical_notes: Optional[str] = None
    domain: Optional[str] = None
    tables: Optional[List[TableContext]] = None
    last_updated: Optional[datetime] = Field(default_factory=datetime.now)
    updated_by: Optional[str] = None

class ContextResponse(BaseModel):
    status: str = "success"
    message: Optional[str] = None
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None