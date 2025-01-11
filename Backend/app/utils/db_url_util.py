from urllib.parse import urlparse, urlunparse

def get_db_connection_params(base_url: str, database: str) -> str:
    """
    Creates a new database URL by replacing only the database name in the connection URL.
    
    Args:
        base_url: Original database URL (e.g., postgresql://user:pass@host:port/dbname)
        database: New database name to use
    
    Returns:
        Modified database URL with new database name
    """
    # Parse the URL into components
    parsed = urlparse(base_url)
    
    # Create a new path with the new database name
    new_path = f"/{database}"
    
    # Create new URL with all original components but new path
    new_url = urlunparse((
        parsed.scheme,
        parsed.netloc,
        new_path,
        parsed.params,
        parsed.query,
        parsed.fragment
    ))
    
    return new_url