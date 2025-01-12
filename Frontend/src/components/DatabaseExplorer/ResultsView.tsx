"use client"

import React from 'react';
import { Card } from 'antd';
import { ResultsViewProps } from './types';

const ResultsView: React.FC<ResultsViewProps> = ({ results }) => {
  if (!results || !results.results || results.results.length === 0) {
    return null;
  }

  return (
    <Card className="mt-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">SQL Query</h3>
        <pre className="bg-gray-50 p-3 rounded-md overflow-x-auto">
          {results.sql_query}
        </pre>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              {Object.keys(results.results[0] || {}).map((key) => (
                <th 
                  key={key}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.results.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className="hover:bg-gray-50 transition-colors"
              >
                {Object.values(row).map((value, colIndex) => (
                  <td 
                    key={colIndex} 
                    className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap"
                  >
                    {value === null ? (
                      <span className="text-gray-400 italic">null</span>
                    ) : typeof value === 'boolean' ? (
                      value ? 'Yes' : 'No'
                    ) : typeof value === 'object' ? (
                      JSON.stringify(value)
                    ) : (
                      value?.toString()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td 
                colSpan={Object.keys(results.results[0] || {}).length}
                className="px-4 py-3 text-sm text-gray-500 border-t"
              >
                Total rows: {results.results.length}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex justify-end mt-2 text-xs text-gray-500">
        ← Scroll horizontally to see more →
      </div>
    </Card>
  );
};

export default ResultsView;