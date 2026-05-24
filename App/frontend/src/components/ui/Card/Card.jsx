import clsx from 'clsx';

export default function Card({ children, className, padding = true, hover }) {
  return (
    <div
      className={clsx(
        'bg-white border border-gray-200 rounded-lg shadow-sm',
        padding && 'p-6',
        hover && 'hover:shadow-md transition-shadow',
        className
      )}
    >
      {children}
    </div>
  );
}
