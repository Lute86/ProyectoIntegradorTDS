import { useState, useMemo, ReactNode } from 'react';
import { clsx } from 'clsx';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  className?: string;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  actions?: (item: T) => ReactNode;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  searchable?: boolean;
  pageSize?: number;
}

export const DataTable = <T extends { id?: string | number }>({
  columns,
  data = [],
  actions,
  isLoading = false,
  emptyMessage = 'No se encontraron registros.',
  className,
  searchable = false,
  pageSize = 10,
}: DataTableProps<T>) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const safeData = Array.isArray(data) ? data : [];

  const filtered = useMemo(() => {
    if (!search.trim()) return safeData;
    const q = search.toLowerCase();
    return safeData.filter((item) =>
      columns.some((col) => {
        if (typeof col.accessor === 'function') return false;
        const val = item[col.accessor];
        return val != null && String(val).toLowerCase().includes(q);
      })
    );
  }, [data, search, columns]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = String(a[sortKey as keyof T] ?? '');
      const bVal = String(b[sortKey as keyof T] ?? '');
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

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
    <div className={clsx('w-full bg-white rounded-lg shadow-sm border border-gray-200', className)}>
      {/* Busqueda */}
      {searchable && (
        <div className="px-4 py-3 border-b border-gray-200">
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Buscar en la tabla..."
            className="w-full max-w-sm px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/80 border-b border-gray-200">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={clsx(
                    'px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider',
                    col.sortable && 'cursor-pointer select-none hover:text-gray-700',
                    col.className
                  )}
                  onClick={() => col.sortable && typeof col.accessor === 'string' && handleSort(col.accessor)}
                >
                  <span className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && sortKey === col.accessor && (
                      <span className="text-[10px]">{sortDir === 'asc' ? '\u25B2' : '\u25BC'}</span>
                    )}
                  </span>
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
            {paginated.length > 0 ? (
              paginated.map((item, rowIndex) => (
                <tr
                  key={item.id ?? rowIndex}
                  className="hover:bg-blue-50/30 transition-colors duration-150 group"
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={clsx('px-6 py-4 text-sm text-gray-600 whitespace-nowrap', col.className)}
                    >
                      {typeof col.accessor === 'function'
                        ? col.accessor(item)
                        : (item[col.accessor] as ReactNode)}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">{actions(item)}</div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-12 text-center text-gray-400 italic text-sm">
                  {search ? 'No se encontraron resultados para la busqueda.' : emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginacion */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 text-sm">
          <span className="text-gray-500">
            {sorted.length} registro{sorted.length !== 1 ? 's' : ''} — Pag. {page} de {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition text-xs font-semibold"
            >
              Anterior
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition text-xs font-semibold"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
