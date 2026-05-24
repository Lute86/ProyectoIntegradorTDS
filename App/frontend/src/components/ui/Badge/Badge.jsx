import clsx from 'clsx';

const variants = {
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-emerald-100 text-emerald-700',
  amber: 'bg-amber-100 text-amber-700',
  purple: 'bg-purple-100 text-purple-700',
  rose: 'bg-rose-100 text-rose-700',
  gray: 'bg-gray-100 text-gray-700',
};

export default function Badge({ children, variant = 'gray', className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant] || variants.gray,
        className
      )}
    >
      {children}
    </span>
  );
}
