"use client";

import React, { useState, useEffect } from "react";
import { Card } from "antd";
import { Database, Table, QueryResult } from "./types";
import { fetchDatabases, fetchTables, executeQuery } from "@/utils/api";
import TableView from "./TableView";
import TablesGrid from "./TablesGrid";
import ResultsView from "./ResultsView";
import { ContextProvider } from "./context/ContextProvider";
import { ContextEditor } from "./context/ContextEditor";
import { DatabaseContextButton } from "./context/ContextButton";
import { ContextDisplay } from "./context/ContextDisplay";
import { useContextProvider } from "./context/ContextProvider";

const DatabaseExplorer = () => {
  const [databases, setDatabases] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDB, setSelectedDB] = useState<Database | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [loadingDatabases, setLoadingDatabases] = useState(false);
  const [loadingTables, setLoadingTables] = useState(false);
  const [activeTab, setActiveTab] = useState<"schema" | "query">("schema");

  useEffect(() => {
    const loadDatabases = async () => {
      setLoadingDatabases(true);
      try {
        const data = await fetchDatabases();
        setDatabases(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch databases"
        );
      } finally {
        setLoadingDatabases(false);
      }
    };
    loadDatabases();
  }, []);

  const handleDatabaseSelect = async (dbName: string) => {
    setSelectedTable(null);
    setLoadingTables(true);

    try {
      const tables = await fetchTables(dbName);
      setSelectedDB({
        name: dbName,
        tables,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tables");
    } finally {
      setLoadingTables(false);
    }
  };

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query || !selectedDB) return;

    setLoading(true);
    setError(null);

    try {
      const data = await executeQuery(query, selectedDB.name);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const MainContent = () => {
    const { getContext } = useContextProvider();
    const [dbContext, setDbContext] = useState<any>(null);
    const [isLoadingDbContext, setIsLoadingDbContext] = useState(false);
    const [contextError, setContextError] = useState<string | null>(null);

    useEffect(() => {
      const loadDatabaseContext = async () => {
        if (!selectedDB || isLoadingDbContext) return;

        setIsLoadingDbContext(true);
        setContextError(null);

        try {
          const context = await getContext("database", {
            dbName: selectedDB.name,
          });

          if (context && typeof context === "object") {
            setDbContext(context);
          } else {
            setDbContext(null);
            setContextError("Invalid context format received");
          }
        } catch (error) {
          setDbContext(null);
          setContextError(
            error instanceof Error ? error.message : "Failed to fetch context"
          );
        } finally {
          setIsLoadingDbContext(false);
        }
      };

      // Reset context when database changes
      if (!selectedDB) {
        setDbContext(null);
        setContextError(null);
      } else {
        loadDatabaseContext();
      }

      // Cleanup function
      return () => {
        setIsLoadingDbContext(false);
      };
    }, [selectedDB?.name, getContext]);

    return (
      <div className="flex-1 p-6 overflow-auto">
        <div className="border-b mb-6">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === "schema"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("schema")}
            >
              Schema Browser
            </button>
            <button
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === "query"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("query")}
            >
              Query Assistant
            </button>
          </div>
        </div>

        {activeTab === "schema" ? (
          <div>
            {selectedDB ? (
              selectedTable ? (
                <TableView
                  table={selectedTable}
                  onBack={() => setSelectedTable(null)}
                  dbName={selectedDB.name}
                />
              ) : (
                <>
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold">{selectedDB.name}</h2>
                      <DatabaseContextButton
                        name={selectedDB.name}
                        hasContext={!!dbContext?.data}
                      />
                    </div>
                    {isLoadingDbContext ? (
                      <div className="text-gray-400 mt-2">
                        Loading context...
                      </div>
                    ) : contextError ? (
                      <div className="text-red-500 mt-2">
                        Error: {contextError}
                      </div>
                    ) : dbContext ? (
                      <ContextDisplay
                        type="database"
                        name={selectedDB.name}
                        description={dbContext.description}
                        businessContext={dbContext.businessContext}
                        technicalNotes={dbContext.technicalNotes}
                      />
                    ) : (
                      <p className="text-gray-400 mt-2">No context available</p>
                    )}
                    <p className="text-gray-500 mt-2">
                      {selectedDB.tables?.length || 0} tables
                    </p>
                  </div>
                  {loadingTables ? (
                    <div className="flex items-center justify-center p-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                    </div>
                  ) : (
                    <TablesGrid
                      tables={selectedDB.tables || []}
                      onTableSelect={setSelectedTable}
                      dbName={selectedDB.name}
                    />
                  )}
                </>
              )
            ) : (
              <div className="text-center text-gray-500 mt-8">
                Select a database from the sidebar to view its schema
              </div>
            )}
          </div>
        ) : (
          <Card>
            <form onSubmit={handleQuerySubmit} className="space-y-4">
              {selectedDB && (
                <p className="text-gray-500">
                  Querying database: {selectedDB.name}
                </p>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask a question about your data..."
                  className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!selectedDB}
                />
                <button
                  type="submit"
                  disabled={loading || !query || !selectedDB}
                  className={`px-4 py-2 rounded-md text-white transition-colors ${
                    loading || !query || !selectedDB
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    "Ask"
                  )}
                </button>
              </div>

              {error && (
                <div className="text-red-500 text-sm">Error: {error}</div>
              )}
            </form>

            <ResultsView results={results} />
          </Card>
        )}
      </div>
    );
  };

  return (
    <ContextProvider>
      <div className="flex h-screen">
        <div className="w-64 border-r bg-gray-50 p-4">
          <div className="font-medium mb-4 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18" />
            </svg>
            Databases
          </div>
          {loadingDatabases ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
            </div>
          ) : (
            <div className="space-y-1">
              {databases.map((dbName) => (
                <button
                  key={dbName}
                  className={`w-full px-3 py-2 text-left rounded-md transition-colors ${
                    selectedDB?.name === dbName
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleDatabaseSelect(dbName)}
                >
                  {dbName}
                </button>
              ))}
            </div>
          )}
        </div>
        <MainContent />
      </div>
      <ContextEditor />
    </ContextProvider>
  );
};

export default DatabaseExplorer;
