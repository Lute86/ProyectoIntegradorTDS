import clsx from 'clsx';

export default function EmptyState({ icon, title, description, action, className }) {
  return (
    <div className={clsx('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      {icon && <div className="text-gray-300 dark:text-slate-600 mb-4 text-5xl">{icon}</div>}
      {title && <h3 className="text-lg font-semibold text-gray-700 dark:text-slate-200 mb-1">{title}</h3>}
      {description && <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm mb-4">{description}</p>}
      {action && action}
    </div>
  );
}
