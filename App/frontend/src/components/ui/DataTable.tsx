import { ReactNode } from 'react';
import { clsx } from 'clsx';

/**
 * Interfaz para la definición de columnas
 * T es el tipo de dato que representará cada fila
 */
export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  actions?: (item: T) => ReactNode;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

/**
 * DataTable Reutilizable - IFTS 29 Admin
 * Cumple con los estándares de diseño del wireframe y Karpathy Guidelines.
 */
export const DataTable = <T extends { id?: string | number }>({
  columns,
  data,
  actions,
  isLoading = false,
  emptyMessage = 'No se encontraron registros.',
  className,
}: DataTableProps<T>) => {
  
  // Estado de carga (Skeletons)
  if (isLoading) {
    return (
      <div className="w-full animate-pulse border border-gray-100 rounded-lg overflow-hidden">
        <div className="h-12 bg-gray-50 border-b border-gray-100 mb-1" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-white border-b border-gray-50" />
        ))}
      </div>
    );
  }

  return (
    <div className={clsx('overflow-x-auto w-full bg-white rounded-lg shadow-sm border border-gray-200', className)}>
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50/80 border-b border-gray-200">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className={clsx(
                  'px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider',
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
            {actions && (
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length > 0 ? (
            data.map((item, rowIndex) => (
              <tr 
                key={item.id ?? rowIndex} 
                className="hover:bg-blue-50/30 transition-colors duration-150 group"
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={clsx(
                      'px-6 py-4 text-sm text-gray-600 whitespace-nowrap',
                      col.className
                    )}
                  >
                    {typeof col.accessor === 'function'
                      ? col.accessor(item)
                      : (item[col.accessor] as ReactNode)}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex justify-end gap-2">
                      {actions(item)}
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="px-6 py-12 text-center text-gray-400 italic text-sm"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
