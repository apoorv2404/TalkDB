"use client"

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, Database, ChevronRight, Layout } from 'lucide-react';
import ResultsView from './ResultsView';

interface Column {
  name: string;
  type: string;
  nullable: boolean;
}

interface Table {
  name: string;
  description: string;
  columns: Column[];
}

interface Database {
  name: string;
  tables?: Table[];
}

interface QueryResult {
  results: any[];
  sql_query: string;
  schema_context: string[];
}

const DatabaseExplorer = () => {
  const [databases, setDatabases] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDB, setSelectedDB] = useState<Database | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [loadingDatabases, setLoadingDatabases] = useState(false);
  const [loadingTables, setLoadingTables] = useState(false);

  const fetchDatabases = async () => {
    setLoadingDatabases(true);
    try {
      const response = await fetch('http://localhost:8000/api/databases');
      if (!response.ok) throw new Error('Failed to fetch databases');
      const data = await response.json();
      setDatabases(data);
    } catch (err) {
      console.error('Error fetching databases:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch databases');
    } finally {
      setLoadingDatabases(false);
    }
  };

  const fetchTables = async (dbName: string) => {
    setLoadingTables(true);
    try {
      const response = await fetch(`http://localhost:8000/api/databases/${dbName}/tables`);
      if (!response.ok) throw new Error('Failed to fetch tables');
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error fetching tables:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tables');
      return [];
    } finally {
      setLoadingTables(false);
    }
  };

  useEffect(() => {
    fetchDatabases();
  }, []);

  const handleDatabaseSelect = async (db: Database) => {
    setSelectedDB(db);
    setSelectedTable(null);
    
    try {
      const tables = await fetchTables(db.name);
      setSelectedDB(prev => ({
        ...prev,
        tables: tables
      }));
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/query', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          query: query,
          database: selectedDB?.name
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to execute query');
      }
      
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const TableStructureView = ({ table }: { table: Table }) => (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSelectedTable(null)}
          >
            ←
          </Button>
          <div>
            <CardTitle className="text-xl">{table.name}</CardTitle>
            <CardDescription>{table.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Column Name
                </th>
                <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nullable
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.columns.map((column) => (
                <tr key={column.name} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-900">{column.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-500">{column.type}</td>
                  <td className="px-4 py-2 text-sm text-gray-500">
                    {column.nullable ? 'Yes' : 'No'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  const TablesGridView = ({ tables }: { tables: Table[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tables.map((table) => (
        <Card 
          key={table.name} 
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setSelectedTable(table)}
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layout className="w-4 h-4" />
              <CardTitle className="text-lg">{table.name}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="line-clamp-2">
              {table.description}
            </CardDescription>
            <div className="mt-2 text-sm text-gray-500">
              {table.columns.length} columns
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r bg-gray-50 p-4">
        <div className="font-medium mb-4 flex items-center gap-2">
          <Database className="w-4 h-4" />
          Databases
        </div>
        {loadingDatabases ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          <div className="space-y-1">
            {databases.map((dbName) => (
              <Button
                key={dbName}
                variant={selectedDB?.name === dbName ? "default" : "ghost"}
                className="w-full justify-between"
                onClick={() => handleDatabaseSelect({ name: dbName })}
              >
                {dbName}
                <ChevronRight className="w-4 h-4" />
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <Tabs defaultValue="schema" className="w-full">
          <TabsList>
            <TabsTrigger value="schema">
              <Database className="w-4 h-4 mr-2" />
              Schema Browser
            </TabsTrigger>
            <TabsTrigger value="query">
              <Search className="w-4 h-4 mr-2" />
              Query Assistant
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schema">
            {selectedDB ? (
              selectedTable ? (
                <TableStructureView table={selectedTable} />
              ) : (
                <>
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold">{selectedDB.name}</h2>
                    <p className="text-gray-500">
                      {selectedDB.tables?.length || 0} tables
                    </p>
                  </div>
                  {loadingTables ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    <TablesGridView tables={selectedDB.tables || []} />
                  )}
                </>
              )
            ) : (
              <div className="text-center text-gray-500 mt-8">
                Select a database from the sidebar to view its schema
              </div>
            )}
          </TabsContent>

          <TabsContent value="query">
            <Card>
              <CardHeader>
                <CardTitle>Natural Language Query</CardTitle>
                {selectedDB && (
                  <CardDescription>
                    Querying database: {selectedDB.name}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleQuerySubmit} className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Ask a question about your data..."
                      className="flex-1"
                      disabled={!selectedDB}
                    />
                    <Button 
                      type="submit" 
                      disabled={loading || !query || !selectedDB}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Ask'
                      )}
                    </Button>
                  </div>
                  
                  {error && (
                    <div className="text-red-500 text-sm">
                      Error: {error}
                    </div>
                  )}
                </form>
                
                <ResultsView results={results}/>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DatabaseExplorer;