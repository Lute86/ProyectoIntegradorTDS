import { Link, Outlet } from 'react-router-dom';
import UserAvatar from '../../ui/UserAvatar';

/**
 * AdminLayout - Shell básico para el panel de administración.
 * Proporciona la estructura necesaria para renderizar las páginas hijas.
 * Siguiendo Simplicity First hasta que FE Dev 1 complete el layout definitivo.
 */
const AdminLayout = () => {
  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar Minimalista (Placeholder) */}
      <aside className="w-64 bg-slate-900 text-white hidden lg:flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">29</div>
            <div>
              <h2 className="font-bold tracking-tight">IFTS 29</h2>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Admin Panel</p>
            </div>
          </div>
        </div>
        
        <nav className="mt-4 flex-1 px-4 space-y-1">
          {/* Grupo: CONTENIDO */}
          <p className="px-4 pt-4 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Contenido</p>
          <Link to="/admin/noticias" className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-sm">
            <div className="w-6 h-6 rounded bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300">NO</div>
            <span>Noticias</span>
          </Link>
          <Link to="/admin/eventos" className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-sm">
            <div className="w-6 h-6 rounded bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300">EV</div>
            <span>Eventos</span>
          </Link>
          <Link to="/admin/testimonios" className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-sm">
            <div className="w-6 h-6 rounded bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300">TE</div>
            <span>Testimonios</span>
          </Link>
          <Link to="/admin/consultas" className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-sm">
            <div className="w-6 h-6 rounded bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300">CO</div>
            <span>Consultas</span>
          </Link>

          {/* Separador */}
          <div className="border-t border-slate-800 my-3" />

          {/* Grupo: ADMIN */}
          <p className="px-4 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Admin</p>
          <Link to="/admin/usuarios" className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-sm">
            <div className="w-6 h-6 rounded bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300">US</div>
            <span>Usuarios</span>
          </Link>
          <Link to="/admin/personalizar" className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-sm">
            <div className="w-6 h-6 rounded bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300">PA</div>
            <span>Personalizar</span>
          </Link>
          <Link to="/admin/ajustes" className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-sm">
            <div className="w-6 h-6 rounded bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300">AJ</div>
            <span>Ajustes</span>
          </Link>
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white transition-colors cursor-pointer text-sm">
            <div className="w-6 h-6 rounded bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300">WEB</div>
            <span>Ver sitio público</span>
          </div>
        </div>
      </aside>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar Minimalista (Placeholder) */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="lg:hidden w-10 h-10 flex items-center justify-center text-gray-500">
            ☰
          </div>
          
          <div className="ml-auto flex items-center gap-4">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-semibold text-gray-700">Admin</span>
              <span className="text-[10px] text-gray-400 uppercase">Superusuario</span>
            </div>
            <UserAvatar nombre="Admin" apellido="IFTS" size="md" />
          </div>
        </header>

        {/* Área de Scroll de la Página */}
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
