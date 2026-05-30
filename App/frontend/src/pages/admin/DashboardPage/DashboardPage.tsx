import { Link } from 'react-router-dom';

/* ------------------------------------------------------------------ */
/*  Datos mock estaticos (reemplazar con store cuando haya API real)   */
/* ------------------------------------------------------------------ */

const MOCK_STATS = [
  { label: 'Total Usuarios', value: 24, color: 'bg-blue-500' },
  { label: 'Noticias Publicadas', value: 18, color: 'bg-emerald-500' },
  { label: 'Proximos Eventos', value: 6, color: 'bg-amber-500' },
  { label: 'Testimonios Recibidos', value: 12, color: 'bg-violet-500' },
];

const MOCK_ACTIVITIES = [
  { id: 1, texto: 'Nueva noticia publicada: "Inscripciones 2026"', timestamp: 'Hace 15 min' },
  { id: 2, texto: 'Usuario Carlos Martinez actualizo su perfil', timestamp: 'Hace 1 hora' },
  { id: 3, texto: 'Evento "Jornada de Puertas Abiertas" creado', timestamp: 'Hace 3 horas' },
  { id: 4, texto: 'Se elimino la noticia "Evento deportivo"', timestamp: 'Hace 5 horas' },
  { id: 5, texto: 'Testimonio de Lucia Fernandez aprobado', timestamp: 'Hace 1 dia' },
];

const QUICK_ACTIONS = [
  { label: 'Nueva Noticia', href: '/admin/noticias', icono: '\u{1F4F0}' },
  { label: 'Nuevo Evento', href: '/admin/eventos', icono: '\u{1F4C5}' },
  { label: 'Nuevo Usuario', href: '/admin/usuarios', icono: '\u{1F465}' },
  { label: 'Ir a Galeria', href: '/admin/galeria', icono: '\u{1F4F7}' },
  { label: 'Gestionar Consultas', href: '/admin/consultas', icono: '\u{1F4E8}' },
];

/* ------------------------------------------------------------------ */
/*  Componente principal                                              */
/* ------------------------------------------------------------------ */

const DashboardPage = () => {
  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">

      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Resumen general del instituto.</p>
      </div>

      {/* StatCards: grilla responsiva de metricas */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_STATS.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center text-white font-bold text-sm`}>
                  {stat.value}
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Filas inferiores: ActivityFeed + QuickActions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ActivityFeed */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
          <h2 className="text-base font-bold text-gray-900">Actividad Reciente</h2>
          <ul className="space-y-3">
            {MOCK_ACTIVITIES.map((act) => (
              <li key={act.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{act.texto}</p>
                  <span className="text-xs text-gray-400">{act.timestamp}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* QuickActions */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
          <h2 className="text-base font-bold text-gray-900">Acciones Rapidas</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.label}
                to={action.href}
                className="flex flex-col items-center justify-center gap-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-500 focus:border-blue-500 hover:-translate-y-1 transition-all duration-200 p-5"
              >
                <span className="text-3xl">{action.icono}</span>
                <span className="text-sm font-semibold text-gray-800 text-center leading-tight">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default DashboardPage;
