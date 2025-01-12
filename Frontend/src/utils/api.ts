const API_BASE_URL = 'http://localhost:8000';

export async function fetchDatabases() {
  const response = await fetch(`${API_BASE_URL}/api/databases`);
  if (!response.ok) throw new Error('Failed to fetch databases');
  return response.json();
}

export async function fetchTables(dbName: string) {
  const response = await fetch(`${API_BASE_URL}/api/databases/${dbName}/tables`);
  if (!response.ok) throw new Error('Failed to fetch tables');
  return response.json();
}

export async function executeQuery(query: string, database: string) {
  const response = await fetch(`${API_BASE_URL}/api/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, database }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to execute query');
  }
  
  return response.json();
}