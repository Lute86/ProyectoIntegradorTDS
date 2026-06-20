import clsx from 'clsx';

export default function Select({ label, error, options = [], placeholder, className, id, ...props }) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={clsx(
          'w-full px-3 py-2 border rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed bg-white dark:bg-slate-800 text-gray-900 dark:text-white',
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-white/30',
          className
        )}
        {...props}
      >
        {placeholder && <option className="dark:bg-slate-800 dark:text-white" value="">{placeholder}</option>}
        {options.map((opt) => (
          <option className="dark:bg-slate-800 dark:text-white" key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
