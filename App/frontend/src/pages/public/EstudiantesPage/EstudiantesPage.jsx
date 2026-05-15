import { Link } from 'react-router-dom'
import QuickLinks from '../../../components/public/QuickLinks/QuickLinks'

const PORTAL_CARDS = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    titulo: 'Aula Virtual',
    descripcion: 'Accede a tus cursos, materiales y actividades online',
    bg: 'bg-blue-100 text-blue-600',
    href: '#',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    titulo: 'Horarios',
    descripcion: 'Consulta los horarios de clases del cuatrimestre actual',
    bg: 'bg-emerald-100 text-emerald-600',
    href: '#',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    titulo: 'Examenes',
    descripcion: 'Fechas de examenes finales y mesas de examen',
    bg: 'bg-amber-100 text-amber-600',
    href: '#',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    titulo: 'Portal SIU',
    descripcion: 'Solicita certificados, constancias y otros documentos',
    bg: 'bg-rose-100 text-rose-600',
    href: '#',
  },
]

const HORARIOS = [
  { materia: 'Programacion I', dia: 'Lunes', horario: '18:00 - 20:00', aula: 'Aula 5', profesor: 'Prof. Martinez' },
  { materia: 'Matematica', dia: 'Lunes', horario: '20:00 - 22:00', aula: 'Aula 5', profesor: 'Prof. Rodriguez' },
  { materia: 'Programacion II', dia: 'Miercoles', horario: '18:00 - 20:00', aula: 'Lab. Computacion', profesor: 'Prof. Garcia' },
  { materia: 'Bases de Datos I', dia: 'Miercoles', horario: '20:00 - 22:00', aula: 'Lab. Computacion', profesor: 'Prof. Lopez' },
  { materia: 'Ingles Tecnico I', dia: 'Viernes', horario: '18:00 - 20:00', aula: 'Aula 3', profesor: 'Prof. Smith' },
  { materia: 'Logica Computacional', dia: 'Viernes', horario: '20:00 - 22:00', aula: 'Aula 3', profesor: 'Prof. Fernandez' },
]

export default function EstudiantesPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-gradient-to-br from-slate-900 to-blue-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Portal del Estudiante</h1>
          <p className="text-blue-200 text-lg">Todo lo que necesitas en un solo lugar</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Accesos Rapidos</h2>
            <p className="text-slate-500 mt-1">Herramientas y recursos para estudiantes</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PORTAL_CARDS.map((card) => (
              <Link key={card.titulo} to={card.href}
                className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${card.bg}`}>
                  {card.icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{card.titulo}</h3>
                <p className="text-sm text-slate-500 mb-4">{card.descripcion}</p>
                <span className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                  Ingresar
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-6">Horarios - Primer Cuatrimestre 2026</h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="text-left px-4 py-3 font-semibold">Materia</th>
                    <th className="text-left px-4 py-3 font-semibold">Dia</th>
                    <th className="text-left px-4 py-3 font-semibold">Horario</th>
                    <th className="text-left px-4 py-3 font-semibold">Aula</th>
                    <th className="text-left px-4 py-3 font-semibold">Profesor</th>
                  </tr>
                </thead>
                <tbody>
                  {HORARIOS.map((h, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-900">{h.materia}</td>
                      <td className="px-4 py-3 text-slate-600">{h.dia}</td>
                      <td className="px-4 py-3 text-slate-600">{h.horario}</td>
                      <td className="px-4 py-3 text-slate-600">{h.aula}</td>
                      <td className="px-4 py-3 text-slate-600">{h.profesor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">Enlaces Utiles</h2>
          <p className="text-slate-500 text-center mb-2">Recursos adicionales para tu vida academica</p>
          <QuickLinks />
        </div>
      </div>
    </div>
  )
}
