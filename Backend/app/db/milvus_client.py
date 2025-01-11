from pymilvus import connections, utility
from app.core.config import settings

def connect_to_milvus():
    """Establish connection to Milvus."""
    try:
        connections.connect(
            "default",
            host=settings.MILVUS_HOST,
            port=settings.MILVUS_PORT
        )
    except Exception as e:
        raise Exception(f"Failed to connect to Milvus: {e}")

def disconnect_from_milvus():
    """Disconnect from Milvus."""
    try:
        connections.disconnect("default")
    except Exception as e:
        raise Exception(f"Failed to disconnect from Milvus: {e}")

def check_collection_exists(collection_name: str) -> bool:
    """Check if a collection exists in Milvus."""
    return utility.has_collection(collection_name)