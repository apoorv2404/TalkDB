from pymilvus import connections, Collection, utility
import ollama
import json
from typing import Dict, Any, List, Optional
from app.models.context import DatabaseContext, TableContext, ColumnContext
import numpy as np

class ContextStore:
    def __init__(self, collection_name: str = "enhanced_schema"):
        self.collection_name = collection_name
        self.embedding_model = "mxbai-embed-large:335m-v1-fp16"
        self._ensure_connection()
        self._ensure_collection()

    def _ensure_connection(self):
        """Ensure connection to Milvus is established."""
        try:
            connections.connect("default", host="localhost", port="19530")
        except Exception as e:
            raise ConnectionError(f"Failed to connect to Milvus: {str(e)}")

    def _ensure_collection(self):
        """Ensure the collection exists, create if it doesn't."""
        try:
            if not utility.has_collection(self.collection_name):
                from pymilvus import FieldSchema, CollectionSchema, DataType
                fields = [
                    FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
                    FieldSchema(name="entity_type", dtype=DataType.VARCHAR, max_length=50),
                    FieldSchema(name="entity_name", dtype=DataType.VARCHAR, max_length=100),
                    FieldSchema(name="parent_entity", dtype=DataType.VARCHAR, max_length=100),
                    FieldSchema(name="context_data", dtype=DataType.VARCHAR, max_length=65535),
                    FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=1024)
                ]
                schema = CollectionSchema(fields)
                collection = Collection(self.collection_name, schema)
                index_params = {
                    "metric_type": "IP",
                    "index_type": "IVF_FLAT",
                    "params": {"nlist": 128}
                }
                collection.create_index(field_name="embedding", index_params=index_params)
                return collection
            return Collection(self.collection_name)
        except Exception as e:
            raise Exception(f"Failed to ensure collection exists: {str(e)}")

    def _generate_embedding(self, text: str) -> List[float]:
        """Generate embedding for given text using Ollama."""
        try:
            response = ollama.embed(model=self.embedding_model, input=text)
            return response["embeddings"][0]
        except Exception as e:
            raise ValueError(f"Failed to generate embedding: {str(e)}")

    def _prepare_context_text(self, context_data: Dict[str, Any], entity_type: str) -> str:
        """Prepare text for embedding generation."""
        text_parts = []
        
        # Add basic context information
        text_parts.extend([
            f"Type: {entity_type}",
            f"Name: {context_data.get('name', '')}",
            f"Description: {context_data.get('description', '')}",
            f"Business Context: {context_data.get('business_context', '')}",
            f"Technical Notes: {context_data.get('technical_notes', '')}"
        ])
        
        # Add type-specific information
        if entity_type == "column":
            text_parts.extend([
                f"Data Type: {context_data.get('data_type', '')}",
                f"Constraints: {', '.join(context_data.get('constraints', []))}"
            ])
        elif entity_type == "table":
            text_parts.extend([
                f"Primary Key: {', '.join(context_data.get('primary_key', []))}",
                f"Foreign Keys: {json.dumps(context_data.get('foreign_keys', {}))}"
            ])
        elif entity_type == "database":
            text_parts.extend([
                f"Domain: {context_data.get('domain', '')}"
            ])
        
        return "\n".join(filter(None, text_parts))

    async def store_context(
        self,
        entity_type: str,
        entity_name: str,
        context_data: Dict[str, Any],
        parent_entity: str = ""
    ) -> Dict[str, Any]:
        """Store context information in Milvus."""
        try:
            collection = Collection(self.collection_name)
            
            # Prepare context text and generate embedding
            context_text = self._prepare_context_text(context_data, entity_type)
            embedding = self._generate_embedding(context_text)
            
            # Store in Milvus
            data = [
                [entity_type],
                [entity_name],
                [parent_entity],
                [json.dumps(context_data)],
                [embedding]
            ]
            
            # Delete existing context if it exists
            expr = f'entity_type == "{entity_type}" && entity_name == "{entity_name}"'
            collection.delete(expr)
            
            # Insert new context
            collection.insert(data)
            
            return {
                "status": "success",
                "message": f"Context stored for {entity_type}: {entity_name}",
                "data": context_data
            }
            
        except Exception as e:
            raise Exception(f"Failed to store context: {str(e)}")

    async def retrieve_context(
        self,
        entity_type: str,
        entity_name: str,
        include_children: bool = False
    ) -> Dict[str, Any]:
        """Retrieve context information from Milvus."""
        try:
            collection = Collection(self.collection_name)

            collection.load()
            
            # Search for exact match
            expr = f'entity_type == "{entity_type}" && entity_name == "{entity_name}"'
            output_fields = ["context_data", "parent_entity"]
            results = collection.query(expr, output_fields=output_fields)
            
            if not results:
                return {
                    "status": "error",
                    "message": f"No context found for {entity_type}: {entity_name}"
                }
            
            context_data = json.loads(results[0]["context_data"])
            
            if include_children:
                # Retrieve child contexts
                child_expr = f'parent_entity == "{entity_name}"'
                child_results = collection.query(child_expr, output_fields=output_fields)
                
                if child_results:
                    children = {}
                    for child in child_results:
                        child_data = json.loads(child["context_data"])
                        child_type = child_data.get("type", "unknown")
                        if child_type not in children:
                            children[child_type] = []
                        children[child_type].append(child_data)
                    context_data["children"] = children
            
            return {
                "status": "success",
                "data": context_data
            }
            
        except Exception as e:

            try:
                collection.release()
            except:
                pass
            raise Exception(f"Failed to retrieve context: {str(e)}")

    async def search_similar_contexts(
        self,
        query_text: str,
        entity_type: Optional[str] = None,
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        """Search for similar contexts using vector similarity."""
        try:
            collection = Collection(self.collection_name)
            
            # Generate embedding for query
            query_embedding = self._generate_embedding(query_text)
            
            # Prepare search parameters
            search_params = {
                "metric_type": "IP",
                "params": {"nprobe": 10}
            }
            
            expr = f'entity_type == "{entity_type}"' if entity_type else None
            
            # Perform search
            results = collection.search(
                data=[query_embedding],
                anns_field="embedding",
                param=search_params,
                limit=limit,
                expr=expr,
                output_fields=["entity_type", "entity_name", "context_data"]
            )
            
            # Process results
            similar_contexts = []
            for hits in results:
                for hit in hits:
                    context_data = json.loads(hit.entity.get("context_data"))
                    similar_contexts.append({
                        "entity_type": hit.entity.get("entity_type"),
                        "entity_name": hit.entity.get("entity_name"),
                        "context": context_data,
                        "similarity": hit.score
                    })
            
            return similar_contexts
            
        except Exception as e:
            raise Exception(f"Failed to search similar contexts: {str(e)}")

# Create a singleton instance
context_store = ContextStore("structure_schema")