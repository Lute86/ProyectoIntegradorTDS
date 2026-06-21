import clsx from 'clsx';

export default function Skeleton({ variant = 'text', className }) {
  const variants = {
    text: 'h-4 w-full rounded',
    title: 'h-6 w-2/3 rounded',
    avatar: 'h-12 w-12 rounded-full',
    card: 'h-40 w-full rounded-lg',
    image: 'h-48 w-full rounded-lg',
    button: 'h-10 w-24 rounded-md',
  };

  return (
    <div
      className={clsx(
        'animate-pulse bg-gray-200 dark:bg-slate-700',
        variants[variant] || variants.text,
        className
      )}
    />
  );
}
