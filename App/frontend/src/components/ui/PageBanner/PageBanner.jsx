import { useEffect } from 'react';
import useUIStore from '../../../stores/uiStore';

export default function PageBanner() {
  const notification = useUIStore((s) => s.pageNotification);
  const clear = useUIStore((s) => s.clearPageNotification);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => clear(), 4000);
    return () => clearTimeout(timer);
  }, [notification, clear]);

  if (!notification) return null;

  const isError = notification.type === 'error';
  const bg = isError ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700';
  const icon = isError ? '!' : '\u2713';

  return (
    <div className={`mx-4 md:mx-8 mb-2 flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300 ${bg}`}>
      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${isError ? 'bg-red-500' : 'bg-green-500'}`}>
        {icon}
      </span>
      <span className="flex-1">{notification.message}</span>
      <button onClick={clear} className="text-current/60 hover:text-current font-bold text-lg leading-none">&times;</button>
    </div>
  );
}
