import { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar/AdminSidebar';
import AdminTopbar from './AdminTopbar/AdminTopbar';
import PageBanner from '../../ui/PageBanner/PageBanner';

export default function AdminLayout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mql.matches);
    const handler = (e) => {
      setIsDesktop(e.matches);
      if (e.matches) setSidebarExpanded(false);
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarExpanded((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    if (!isDesktop) setSidebarExpanded(false);
  }, [isDesktop]);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <AdminSidebar
        expanded={isDesktop || sidebarExpanded}
        collapsible={!isDesktop}
        onClose={closeSidebar}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminTopbar onToggleSidebar={toggleSidebar} />
        <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6">
          <PageBanner />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
