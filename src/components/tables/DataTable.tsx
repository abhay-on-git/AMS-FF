import * as React from 'react';

export interface ColumnConfig<T> {
  id: string;
  header: string;
  accessor: keyof T;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
}

export function DataTable<T extends Record<string, unknown>>({ data, columns }: DataTableProps<T>) {
  return (
    <div className='overflow-x-auto rounded border'>
      <table className='w-full text-sm'>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.id} className='px-3 py-2 text-left font-medium'>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className='border-t'>
              {columns.map((column) => (
                <td key={column.id} className='px-3 py-2'>
                  {column.render ? column.render(row) : String(row[column.accessor] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
