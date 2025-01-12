import psycopg
from app.core.config import settings
from contextlib import contextmanager
from app.utils.db_url_util import get_db_connection_params

@contextmanager
def get_db_connection():
    conn = None
    try:
        conn = psycopg.connect(settings.DATABASE_URL)
        yield conn
    finally:
        if conn:
            conn.close()

def get_databases():
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT datname FROM pg_database 
                WHERE datistemplate = false AND datname != 'postgres'
            """)
            return [row[0] for row in cur.fetchall()]

def get_tables(database_name: str):
    connection_params = get_db_connection_params(settings.DATABASE_URL, database_name)
    with psycopg.connect(connection_params) as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT 
                    table_name,
                    obj_description((quote_ident(table_schema) || '.' || 
                    quote_ident(table_name))::regclass, 'pg_class') as description
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_type = 'BASE TABLE'
            """)
            tables = []
            for table_name, description in cur.fetchall():
                # Get columns for each table
                cur.execute("""
                    SELECT 
                        column_name, 
                        data_type,
                        is_nullable
                    FROM information_schema.columns 
                    WHERE table_name = %s
                """, (table_name,))
                columns = [
                    {
                        "name": col[0],
                        "type": col[1],
                        "nullable": col[2] == "YES"
                    } for col in cur.fetchall()
                ]
                tables.append({
                    "name": table_name,
                    "description": description or f"Table containing {table_name} data",
                    "columns": columns
                })
            return tables