"use client"

import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import { TableViewProps } from './types';
import { TableContextButton, ColumnContextButton } from './context/ContextButton';
import { ContextDisplay } from './context/ContextDisplay';
import { useContextProvider } from './context/ContextProvider';

const TableView: React.FC<TableViewProps> = ({ table, onBack, dbName }) => {
  const { getContext } = useContextProvider();
  const [tableContext, setTableContext] = useState<any>(null);
  const [activeColumnContext, setActiveColumnContext] = useState<{name: string; context: any} | null>(null);
  const [isLoadingTableContext, setIsLoadingTableContext] = useState(false);
  const [isLoadingColumnContext, setIsLoadingColumnContext] = useState(false);

  // Load table context when component mounts
  useEffect(() => {
    const loadTableContext = async () => {
      if (isLoadingTableContext) return;

      setIsLoadingTableContext(true);
      try {
        const context = await getContext('table', {
          dbName,
          tableName: table.name
        });
        setTableContext(context);
      } catch (error) {
        console.error('Failed to fetch table context:', error);
        setTableContext(null);
      } finally {
        setIsLoadingTableContext(false);
      }
    };

    loadTableContext();

    return () => {
      setIsLoadingTableContext(false);
    };
  }, [table.name, dbName, getContext]);

  // Load column context only when button is clicked
  const handleColumnContextClick = async (columnName: string) => {
    if (isLoadingColumnContext || activeColumnContext?.name === columnName) return;

    setIsLoadingColumnContext(true);
    try {
      const context = await getContext('column', {
        dbName,
        tableName: table.name,
        columnName
      });
      setActiveColumnContext({ name: columnName, context });
    } catch (error) {
      console.error(`Failed to fetch context for column ${columnName}:`, error);
      setActiveColumnContext({ name: columnName, context: null });
    } finally {
      setIsLoadingColumnContext(false);
    }
  };

  return (
    <Card className="mt-4">
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={onBack}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          ←
        </button>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{table.name}</h2>
            <TableContextButton
              name={table.name}
              parentName={dbName}
              hasContext={!!tableContext?.data}
            />
          </div>
          {isLoadingTableContext ? (
            <div className="text-gray-400 mt-2">Loading table context...</div>
          ) : (
            tableContext?.data ? (
              <ContextDisplay
                type="table"
                name={table.name}
                {...tableContext.data}
                className="mt-2"
              />
            ) : (
              <p className="text-gray-400 mt-2">No table context available</p>
            )
          )}
        </div>
      </div>

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
              <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Context
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.columns.map((column) => {
              const isActiveContext = activeColumnContext?.name === column.name;
              const columnContext = isActiveContext ? activeColumnContext.context : null;
              
              return (
                <tr key={column.name} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {column.name}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
                      {column.type}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <span 
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        column.nullable 
                          ? 'text-green-600 bg-green-50' 
                          : 'text-red-600 bg-red-50'
                      }`}
                    >
                      {column.nullable ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <div className="flex items-center gap-2">
                      {isActiveContext && (
                        isLoadingColumnContext ? (
                          <div className="text-gray-400">Loading...</div>
                        ) : columnContext?.data ? (
                          <ContextDisplay
                            type="column"
                            name={column.name}
                            {...columnContext.data}
                          />
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )
                      )}
                      <ColumnContextButton
                        name={column.name}
                        parentName={`${dbName}.${table.name}`}
                        hasContext={!!columnContext?.data}
                        onClick={() => handleColumnContextClick(column.name)}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default TableView;