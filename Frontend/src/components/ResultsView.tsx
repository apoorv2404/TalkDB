"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ResultsViewProps {
  results: {
    results: any[];
    sql_query: string;
    schema_context: string[];
  } | null;
}

const ResultsView: React.FC<ResultsViewProps> = ({ results }) => {
  if (!results || !results.results || results.results.length === 0) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Query Results</CardTitle>
        {results.sql_query && (
          <CardDescription>
            <div className="font-mono text-sm bg-gray-50 p-3 rounded-md overflow-x-auto">
              {results.sql_query}
            </div>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          {/* Outer container with shadow and border */}
          <div className="overflow-x-auto rounded-lg shadow-sm">
            {/* Inner container for horizontal scrolling */}
            <div className="min-w-full inline-block align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    {Object.keys(results.results[0] || {}).map((key) => (
                      <th 
                        key={key}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap sticky top-0 bg-gray-50"
                        style={{ minWidth: '150px' }}
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
                          {/* Handle different data types */}
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
          </div>
          
          {/* Scroll indicator */}
          <div className="flex justify-end mt-2 px-4 text-xs text-gray-500">
            ← Scroll horizontally to see more →
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsView;