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
  selectable?: boolean;
  selectedIds?: Set<number | string>;
  onSelectionChange?: (ids: Set<number | string>) => void;
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
  selectable = false,
  selectedIds: externalSelectedIds,
  onSelectionChange,
}: DataTableProps<T>) => {
  const [internalSelectedIds, setInternalSelectedIds] = useState<Set<number | string>>(new Set());
  const selectedIds = externalSelectedIds ?? internalSelectedIds;
  const setSelectedIds = onSelectionChange ?? setInternalSelectedIds;
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const safeData = Array.isArray(data) ? data : [];

  const filtered = useMemo(() => {
    if (!search.trim()) return safeData;
    const q = search.toLowerCase();
    return safeData.filter((item) => {
      if (!item) return false;
      return Object.values(item).some((val) =>
        val != null && String(val).toLowerCase().includes(q)
      );
    });
  }, [safeData, search]);

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

  const toggleSelectAll = () => {
    const allSelected = paginated.every((item) => item.id != null && selectedIds.has(item.id));
    const next = new Set(selectedIds);
    paginated.forEach((item) => {
      if (item.id == null) return;
      if (allSelected) next.delete(item.id);
      else next.add(item.id);
    });
    setSelectedIds(next);
  };

  const toggleSelect = (id: number | string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  if (isLoading) {
    return (
      <div className="w-full animate-pulse border border-gray-100 dark:border-slate-700 rounded-lg overflow-hidden">
        <div className="h-12 bg-gray-50 dark:bg-slate-700 border-b border-gray-100 dark:border-slate-700 mb-1" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-white dark:bg-slate-800 border-b border-gray-50 dark:border-slate-700" />
        ))}
      </div>
    );
  }

  return (
    <div className={clsx('w-full bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700', className)}>
      {/* Busqueda */}
      {searchable && (
        <div className="px-3 md:px-4 py-3 border-b border-gray-200 dark:border-slate-700">
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Buscar..."
            className="w-full sm:max-w-sm px-3 py-1.5 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 dark:placeholder:text-slate-400 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>
      )}

      <div className="w-full overflow-x-auto block">
        <table className="w-full min-w-[600px] text-left border-collapse">
          <thead className="bg-gray-50/80 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-700">
            <tr>
              {selectable && (
                <th className="px-3 md:px-4 py-3 md:py-4 w-10">
                  <input
                    type="checkbox"
                    checked={paginated.length > 0 && paginated.every((item) => item.id != null && selectedIds.has(item.id))}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
              )}
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={clsx(
                    'px-3 md:px-6 py-3 md:py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider',
                    col.sortable && 'cursor-pointer select-none hover:text-gray-700 dark:hover:text-slate-200',
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
                <th className="px-3 md:px-6 py-3 md:py-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider text-right">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
            {paginated.length > 0 ? (
              paginated.map((item, rowIndex) => (
                <tr
                  key={item.id ?? rowIndex}
                  className="hover:bg-blue-50/30 dark:hover:bg-slate-700/50 transition-colors duration-150 group"
                >
                  {selectable && (
                    <td className="px-3 md:px-4 py-3 md:py-4 w-10" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={item.id != null && selectedIds.has(item.id)}
                        onChange={() => item.id != null && toggleSelect(item.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                  )}
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={clsx('px-3 md:px-6 py-3 md:py-4 text-sm text-gray-600 dark:text-slate-300 whitespace-nowrap', col.className)}
                    >
                      {typeof col.accessor === 'function'
                        ? col.accessor(item)
                        : (item[col.accessor] as ReactNode)}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-3 md:px-6 py-3 md:py-4 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-1 md:gap-2 whitespace-nowrap">{actions(item)}</div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0) + (selectable ? 1 : 0)} className="px-3 md:px-6 py-12 text-center text-gray-400 dark:text-slate-500 italic text-sm">
                  {search ? 'No se encontraron resultados para la busqueda.' : emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginacion */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-3 md:px-6 py-3 border-t border-gray-200 dark:border-slate-700 text-xs md:text-sm">
          <span className="text-gray-500 dark:text-slate-400 hidden sm:inline">
            {sorted.length} registro{sorted.length !== 1 ? 's' : ''} — Pag. {page} de {totalPages}
          </span>
          <span className="text-gray-500 dark:text-slate-400 sm:hidden">
            {page}/{totalPages}
          </span>
          <div className="flex gap-1">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-2 md:px-3 py-1 rounded border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition text-xs font-semibold"
            >
              Ant.
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-2 md:px-3 py-1 rounded border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition text-xs font-semibold"
            >
              Sig.
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
