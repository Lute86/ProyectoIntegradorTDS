import clsx from 'clsx';

export default function Pagination({ current, total, onChange }) {
  const pages = [];
  for (let i = 1; i <= total; i++) {
    pages.push(i);
  }

  if (total <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-1 mt-6">
      <button
        disabled={current === 1}
        onClick={() => onChange(current - 1)}
        className="px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Anterior
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={clsx(
            'px-3 py-1.5 text-sm rounded-md border',
            p === current
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700'
          )}
        >
          {p}
        </button>
      ))}
      <button
        disabled={current === total}
        onClick={() => onChange(current + 1)}
        className="px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Siguiente
      </button>
    </nav>
  );
}
