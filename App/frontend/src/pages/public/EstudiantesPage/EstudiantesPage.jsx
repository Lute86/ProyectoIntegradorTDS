import QuickLinks from './QuickLinks'

const portalCards = [
  {
    icon: '🎓', title: 'Aula Virtual',
    desc: 'Accede a tus cursos, materiales y actividades online',
    btn: 'Ingresar', href: 'https://aulasvirtuales.bue.edu.ar/', bg: 'bg-blue-100',
  },
  {
    icon: '📅', title: 'Horarios',
    desc: 'Consulta los horarios de clases del cuatrimestre actual',
    btn: 'Ver horarios', href: 'https://aulasvirtuales.bue.edu.ar/', bg: 'bg-emerald-100',
  },
  {
    icon: '📝', title: 'Examenes',
    desc: 'Fechas de examenes finales y mesas de examen',
    btn: 'Ver calendario', href: 'https://aulasvirtuales.bue.edu.ar/', bg: 'bg-amber-100',
  },
  {
    icon: '📄', title: 'Portal SIU',
    desc: 'Solicita certificados, constancias y otros documentos',
    btn: 'Iniciar tramite', href: 'https://guarani-autogestionagencia.bue.edu.ar/acceso', bg: 'bg-rose-100',
  },
]

const horarios = [
  { materia: 'Programacion I', dia: 'Lunes', horario: '18:00 - 20:00', aula: 'Aula 5', profesor: 'Prof. Martinez' },
  { materia: 'Matematica', dia: 'Lunes', horario: '20:00 - 22:00', aula: 'Aula 5', profesor: 'Prof. Rodriguez' },
  { materia: 'Programacion II', dia: 'Miercoles', horario: '18:00 - 20:00', aula: 'Lab. Computacion', profesor: 'Prof. Garcia' },
  { materia: 'Bases de Datos I', dia: 'Miercoles', horario: '20:00 - 22:00', aula: 'Lab. Computacion', profesor: 'Prof. Lopez' },
  { materia: 'Ingles Tecnico I', dia: 'Viernes', horario: '18:00 - 20:00', aula: 'Aula 3', profesor: 'Prof. Smith' },
  { materia: 'Logica Computacional', dia: 'Viernes', horario: '20:00 - 22:00', aula: 'Aula 3', profesor: 'Prof. Fernandez' },
]

export default function EstudiantesPage() {
  return (
    <div className="bg-slate-50">
      <div className="bg-gradient-to-br from-slate-900 to-blue-700 text-white">
        <div className="max-w-content mx-auto px-4 py-12 md:py-16 text-center">
          <h1 className="text-h1 mb-3">Portal del Estudiante</h1>
          <p className="text-blue-200 text-lg">Todo lo que necesitas en un solo lugar</p>
        </div>
      </div>

      <div className="max-w-content mx-auto px-4 py-8 space-y-12">
        <section>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Accesos Rapidos</h2>
            <p className="text-slate-500 mt-1">Herramientas y recursos para estudiantes</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 3xl:grid-cols-6 gap-6">
            {portalCards.map((card) => (
              <div key={card.title}
                className="bg-white rounded-xl shadow-sm p-6 text-center border border-slate-100 transition-shadow hover:shadow-md"
              >
                <div className={`w-20 h-20 rounded-full ${card.bg} flex items-center justify-center text-3xl mx-auto mb-4`}>
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{card.title}</h3>
                <p className="text-sm text-slate-500 mb-4">{card.desc}</p>
                <a href={card.href}
                  className="inline-block px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                  {card.btn}
                </a>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-6">
            Horarios - Primer Cuatrimestre 2025
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
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
                  {horarios.map((h, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
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
        </section>

        <section className="pb-12">
          <QuickLinks />
        </section>
      </div>
    </div>
  )
}
