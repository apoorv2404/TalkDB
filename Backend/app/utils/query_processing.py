from pymilvus import connections, FieldSchema, CollectionSchema, DataType, Collection, utility
import ollama
import json
import psycopg
from app.core.config import settings
from typing import List, Dict, Any, Optional
from app.utils.db_url_util import get_db_connection_params

def retrieve_relevant_schema(user_query: str, milvus_collection_name: str = "db_schema") -> Optional[List[str]]:
    """Retrieve relevant schema context for a user query using embeddings stored in Milvus."""
    try:
        print("retrieving relevant schema")
        connections.connect(
            "default", 
            host=settings.MILVUS_HOST, 
            port=settings.MILVUS_PORT
        )
        collection = Collection(milvus_collection_name)
        collection.load()

        # Generate query embedding using Ollama
        embedding_response = ollama.embed(
            model="mxbai-embed-large:335m-v1-fp16", 
            input=user_query
        )
        query_embedding = embedding_response["embeddings"][0]

        # Perform vector similarity search
        search_params = {
            "metric_type": "IP", 
            "params": {"nprobe": 10}
        }
        results = collection.search(
            data=[query_embedding],
            anns_field="embedding",
            param=search_params,
            limit=3,
            output_fields=["description"]
        )

        # Extract schema descriptions
        schema_context = []
        for hits in results:
            for hit in hits:
                schema_context.append(hit.entity.get("description"))
        return schema_context

    except Exception as e:
        print(f"Error retrieving schema: {e}")
        return None

def generate_sql_query(schema_context: List[str], user_query: str) -> Optional[str]:
    """Generate SQL query using LLM."""
    try:
        prompt = f"""
        You are a database assistant for a PostGreSql DB. The schema of the database is as follows:
        {schema_context}

        User Query: {user_query}

        Please provide the SQL query only, without any markdown formatting or surrounding code fences. 
        Respond only in the following JSON format:
        {{"query":"string", "thoughts":"string"}}
        """

        model = "qwen2.5-coder:14b"
        response = ollama.chat(
            model=model, 
            messages=[{'role': 'user', 'content': prompt}], 
            format='json'
        )
        
        contents = json.loads(response['message']['content'])
        sql_query = contents['query'].strip()

        # Basic validation
        if not sql_query.lower().startswith(("select", "insert", "update", "delete", "create", "drop", "alter", "with")):
            print("Unexpected response format")
            return None

        return sql_query

    except Exception as e:
        print(f"Error generating SQL: {e}")
        return None

def execute_sql_query(sql_query: str, database: str) -> List[Dict[str, Any]]:
    """Execute SQL query and return results."""
    connection_params = get_db_connection_params(settings.DATABASE_URL, database)
    try:
        with psycopg.connect(connection_params) as conn:
            with conn.cursor() as cur:
                print(sql_query)
                cur.execute(sql_query)
                columns = [desc[0] for desc in cur.description]
                results = [
                    dict(zip(columns, row)) 
                    for row in cur.fetchall()
                ]
                print(results)
                return results
    except Exception as e:
        print(f"Error executing SQL: {e}")
        raise

def process_natural_language_query(query: str, database: str) -> Dict[str, Any]:
    """Process natural language query end-to-end."""
    try:
        # Step 1: Retrieve relevant schema context
        schema = "pagila_db_schema_1"
        # schema_context = retrieve_relevant_schema(query, f"{database}_schema")
        schema_context = retrieve_relevant_schema(query, schema)
        if not schema_context:
            raise Exception("Could not find relevant schema information")

        print("Generating Sql Query")
        # Step 2: Generate SQL query
        sql_query = generate_sql_query(schema_context, query)
        if not sql_query:
            raise Exception("Could not generate SQL query")

        # Step 3: Execute query and return results
        results = execute_sql_query(sql_query, database)
        
        return {
            "results": results,
            "sql_query": sql_query,
            "schema_context": schema_context
        }

    except Exception as e:
        raise Exception(f"Error processing query: {e}")

def ingest_schema(table_schema: Dict[str, Any], milvus_collection_name: str = "db_schema"):
    """Ingest schema into Milvus."""
    try:
        # Connect to Milvus
        connections.connect(
            "default", 
            host=settings.MILVUS_HOST, 
            port=settings.MILVUS_PORT
        )

        # Create collection if it doesn't exist
        if not utility.has_collection(milvus_collection_name):
            fields = [
                FieldSchema(
                    name="id", 
                    dtype=DataType.INT64, 
                    is_primary=True, 
                    description="primary id", 
                    auto_id=True
                ),
                FieldSchema(
                    name="description", 
                    dtype=DataType.VARCHAR, 
                    max_length=1024, 
                    description="Descriptions about the schema"
                ),
                FieldSchema(
                    name="embedding", 
                    dtype=DataType.FLOAT_VECTOR, 
                    dim=1024, 
                    description="vector"
                )
            ]
            collection_schema = CollectionSchema(fields, description="Database schema embeddings")
            collection = Collection(name=milvus_collection_name, schema=collection_schema)
        else:
            collection = Collection(name=milvus_collection_name)

        # Prepare data for ingestion
        descriptions = []
        embeddings = []

        for table, details in table_schema.items():
            table_description = f"Table: {table}\nColumns: {', '.join(col['name'] for col in details['columns'])}"
            descriptions.append(table_description)
            
            # Generate embeddings
            embedding_response = ollama.embed(
                model="mxbai-embed-large:335m-v1-fp16", 
                input=table_description
            )
            embeddings.append(embedding_response["embeddings"][0])

        # Insert data into Milvus
        collection.insert([descriptions, embeddings])
        
        # Create index if it doesn't exist
        if not collection.has_index():
            index_params = {
                "index_type": "IVF_FLAT",
                "metric_type": "IP",
                "params": {"nlist": 128}
            }
            collection.create_index(
                field_name="embedding", 
                index_params=index_params
            )
        
        collection.load()
        
        return len(descriptions)

    except Exception as e:
        raise Exception(f"Error ingesting schema: {e}")
    finally:
        connections.disconnect("default")