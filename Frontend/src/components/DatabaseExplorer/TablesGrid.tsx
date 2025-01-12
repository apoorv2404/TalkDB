"use client"

import React from 'react';
import { Card } from 'antd';
import { TablesGridProps } from './types';
import { TableContextButton } from './context/ContextButton';

const TablesGrid: React.FC<TablesGridProps> = ({ tables, onTableSelect, dbName }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tables.map((table) => (
        <Card 
          key={table.name} 
          className="hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1"
          onClick={() => onTableSelect(table)}
          extra={
            <TableContextButton
              name={table.name}
              parentName={dbName}
              // Note: We'll only show if context exists when it's loaded in the editor
              hasContext={false}
            />
          }
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 bg-blue-50 rounded-md text-blue-600">
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
            </span>
            <h3 className="text-lg font-medium">{table.name}</h3>
          </div>
          
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
            {table.columns.length} columns
          </span>
        </Card>
      ))}
    </div>
  );
};

export default TablesGrid;