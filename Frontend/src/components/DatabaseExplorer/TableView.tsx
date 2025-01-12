"use client"

import React, { useState } from 'react';
import { Card } from 'antd';
import { TableViewProps } from './types';
import { TableContextButton, ColumnContextButton } from './context/ContextButton';
import { ContextDisplay } from './context/ContextDisplay';
import { useContextProvider } from './context/ContextProvider';

const TableView: React.FC<TableViewProps> = ({ table, onBack, dbName }) => {
  const { getContext } = useContextProvider();
  const [activeColumnContext, setActiveColumnContext] = useState<{name: string; context: any} | null>(null);

  // Load column context only when button is clicked
  const handleColumnContextClick = async (columnName: string) => {
    // If already loaded for this column, don't reload
    if (activeColumnContext?.name === columnName) return;

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
              hasContext={false}
            />
          </div>
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
                        columnContext ? (
                          <ContextDisplay
                            type="column"
                            name={column.name}
                            {...columnContext}
                          />
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )
                      )}
                      <ColumnContextButton
                        name={column.name}
                        parentName={`${dbName}.${table.name}`}
                        hasContext={!!columnContext}
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