import { useEffect } from 'react';
import clsx from 'clsx';

const styles = {
  info: 'bg-blue-600 text-white',
  success: 'bg-emerald-600 text-white',
  warning: 'bg-amber-500 text-white',
  error: 'bg-red-600 text-white',
};

export default function Toast({ id, message, type = 'info', onClose, duration = 4000 }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose?.(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <div
      className={clsx(
        'flex items-center justify-between gap-3 px-4 py-3 rounded-lg shadow-lg text-sm min-w-[280px] animate-slide-in',
        styles[type]
      )}
    >
      <span>{message}</span>
      <button onClick={() => onClose?.(id)} className="text-white/80 hover:text-white text-lg leading-none">&times;</button>
    </div>
  );
}
