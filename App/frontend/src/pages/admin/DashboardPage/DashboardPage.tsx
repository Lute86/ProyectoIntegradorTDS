import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';

const QUICK_ACTIONS = [
  { label: 'Nueva Noticia', href: '/admin/noticias', icono: '\u{1F4F0}' },
  { label: 'Nuevo Evento', href: '/admin/eventos', icono: '\u{1F4C5}' },
  { label: 'Nuevo Usuario', href: '/admin/usuarios', icono: '\u{1F465}' },
  { label: 'Ir a Galeria', href: '/admin/galeria', icono: '\u{1F4F7}' },
  { label: 'Gestionar Consultas', href: '/admin/consultas', icono: '\u{1F4E8}' },
  { label: 'Gestionar Carreras', href: '/admin/carreras', icono: '\u{1F393}' },
  { label: 'Gestionar Materias', href: '/admin/materias', icono: '\u{1F4D6}' },
];

const formatearTiempo = (fecha: string) => {
  const diff = Date.now() - new Date(fecha).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Ahora';
  if (mins < 60) return `Hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Hace ${hrs} hora${hrs > 1 ? 's' : ''}`;
  const dias = Math.floor(hrs / 24);
  return `Hace ${dias} dia${dias > 1 ? 's' : ''}`;
};

const DashboardPage = () => {
  const [stats, setStats] = useState<{ label: string; value: number; color: string }[]>([]);
  const [actividades, setActividades] = useState<{ texto: string; timestamp: string; tipo: string; id: number }[]>([]);

  useEffect(() => {
    api.get('/stats/dashboard').then((res) => {
      const d = res.data.data || {};
      setStats([
        { label: 'Carreras Activas', value: d.carreras ?? 0, color: 'bg-blue-500' },
        { label: 'Materias Registradas', value: d.materias ?? 0, color: 'bg-emerald-500' },
        { label: 'Staff Activo', value: d.staff ?? 0, color: 'bg-amber-500' },
      ]);
    }).catch((err) => {
      console.error('Error en stats:', err);
      setStats([
        { label: 'Carreras Activas', value: 0, color: 'bg-blue-500' },
        { label: 'Materias Registradas', value: 0, color: 'bg-emerald-500' },
        { label: 'Staff Activo', value: 0, color: 'bg-amber-500' },
      ]);
    });

    api.get('/stats/recent-activity').then((res) => {
      setActividades(res.data.data || []);
    }).catch(() => {
      setActividades([]);
    });
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Resumen general del instituto.</p>
      </div>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-5 space-y-3">
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center text-white font-bold text-sm`}>
                {stat.value}
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-5 space-y-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-slate-100">Acciones Rapidas</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {QUICK_ACTIONS.map((action) => (
              <Link key={action.label} to={action.href}
                className="flex flex-col items-center justify-center gap-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md hover:border-blue-500 focus:border-blue-500 hover:-translate-y-1 transition-all duration-200 p-5">
                <span className="text-3xl">{action.icono}</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-slate-100 text-center leading-tight">{action.label}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-5 space-y-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-slate-100">Actividad Reciente</h2>
          {actividades.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-slate-500 italic text-center py-8">Sin actividad reciente.</p>
          ) : (
            <ul className="space-y-3">
              {actividades.map((act, i) => (
                <li key={i} className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-slate-700 last:border-0 last:pb-0">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 dark:text-slate-200">{act.texto}</p>
                    <span className="text-xs text-gray-400 dark:text-slate-500">{formatearTiempo(act.timestamp)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
