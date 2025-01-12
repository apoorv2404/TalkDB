# app/utils/context_processing.py

from typing import Dict, List, Any, Optional
import json
from datetime import datetime
from app.db.context_store import context_store
from app.models.context import DatabaseContext, TableContext, ColumnContext

class ContextProcessor:
    def __init__(self):
        self.context_store = context_store

    async def process_database_context(
        self,
        db_name: str,
        context: DatabaseContext
    ) -> Dict[str, Any]:
        """Process and store database level context."""
        # Prepare the context data
        context_data = context.dict()
        context_data["last_updated"] = datetime.now()

        # Store in Milvus
        result = await self.context_store.store_context(
            entity_type="database",
            entity_name=db_name,
            context_data=context_data
        )
        
        # If tables are included, process them
        if context.tables:
            for table in context.tables:
                await self.process_table_context(
                    db_name=db_name,
                    table_name=table.name,
                    context=table
                )
        
        return result

    async def process_table_context(
        self,
        db_name: str,
        table_name: str,
        context: TableContext
    ) -> Dict[str, Any]:
        """Process and store table level context."""
        # Prepare the context data
        context_data = context.dict()
        context_data["last_updated"] = datetime.now()
        
        # Store in Milvus
        result = await self.context_store.store_context(
            entity_type="table",
            entity_name=f"{db_name}.{table_name}",
            context_data=context_data,
            parent_entity=db_name
        )
        
        # If columns are included, process them
        if context.columns:
            for column in context.columns:
                await self.process_column_context(
                    db_name=db_name,
                    table_name=table_name,
                    column_name=column.name,
                    context=column
                )
        
        return result

    async def process_column_context(
        self,
        db_name: str,
        table_name: str,
        column_name: str,
        context: ColumnContext
    ) -> Dict[str, Any]:
        """Process and store column level context."""
        # Prepare the context data
        context_data = context.dict()
        context_data["last_updated"] = datetime.now()
        
        # Store in Milvus
        result = await self.context_store.store_context(
            entity_type="column",
            entity_name=f"{db_name}.{table_name}.{column_name}",
            context_data=context_data,
            parent_entity=f"{db_name}.{table_name}"
        )
        
        return result

    async def enrich_query_context(
        self, 
        query: str, 
        db_name: str
    ) -> Dict[str, Any]:
        """
        Enrich a natural language query with relevant context.
        Used before query generation to provide more context to the LLM.
        """
        try:
            # Search for similar contexts
            similar_contexts = await self.context_store.search_similar_contexts(
                query_text=query,
                limit=3
            )
            
            # Extract and organize relevant context
            enriched_context = {
                "database": db_name,
                "relevant_contexts": [],
                "query": query
            }
            
            for ctx in similar_contexts:
                context_info = {
                    "type": ctx["entity_type"],
                    "name": ctx["entity_name"],
                    "description": ctx["context"].get("description", ""),
                    "business_context": ctx["context"].get("business_context", ""),
                    "technical_notes": ctx["context"].get("technical_notes", ""),
                    "relevance_score": ctx["similarity"]
                }
                enriched_context["relevant_contexts"].append(context_info)
            
            return enriched_context
            
        except Exception as e:
            raise Exception(f"Failed to enrich query context: {str(e)}")

    async def get_schema_overview(
        self,
        db_name: str,
        include_tables: bool = True,
        include_columns: bool = False
    ) -> Dict[str, Any]:
        """
        Get a comprehensive overview of the database schema with context.
        Useful for providing overall context to the LLM.
        """
        try:
            # Get database context
            db_context = await self.context_store.retrieve_context(
                entity_type="database",
                entity_name=db_name,
                include_children=include_tables
            )
            
            overview = {
                "database": db_name,
                "context": db_context.get("data", {}),
                "tables": []
            }
            
            if include_tables:
                # Get context for each table
                table_contexts = db_context.get("data", {}).get("children", {}).get("table", [])
                for table_ctx in table_contexts:
                    table_info = {
                        "name": table_ctx.get("name", ""),
                        "context": table_ctx
                    }
                    
                    if include_columns and "columns" in table_ctx:
                        table_info["columns"] = []
                        for col in table_ctx["columns"]:
                            col_context = await self.context_store.retrieve_context(
                                entity_type="column",
                                entity_name=f"{db_name}.{table_ctx['name']}.{col['name']}"
                            )
                            table_info["columns"].append({
                                "name": col["name"],
                                "context": col_context.get("data", {})
                            })
                            
                    overview["tables"].append(table_info)
            
            return overview
            
        except Exception as e:
            raise Exception(f"Failed to get schema overview: {str(e)}")

# Create a singleton instance
context_processor = ContextProcessor()