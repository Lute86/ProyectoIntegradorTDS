import { useState, useEffect, useMemo, useCallback } from 'react'
import useCarrerasStore from '../../../stores/carrerasStore'
import { carrerasService } from '../../../services/carrerasService'
import { horariosService } from '../../../services/horariosService'
import QuickLinks from './QuickLinks'
import estudiantesBg from '../../../assets/fonts/estudiantes1.png'

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

export default function EstudiantesPage() {
  const { carreras, fetchCarreras } = useCarrerasStore()
  const [allHorarios, setAllHorarios] = useState([])
  const [loadingHorarios, setLoadingHorarios] = useState(false)
  const [carreraId, setCarreraId] = useState('')
  const [comision, setComision] = useState('')
  const [materiasDeCarrera, setMateriasDeCarrera] = useState([])
  const [loadingCarrera, setLoadingCarrera] = useState(false)

  useEffect(() => { fetchCarreras() }, [fetchCarreras])

  useEffect(() => {
    if (!carreraId) { setMateriasDeCarrera([]); return }
    const c = carreras.find((c) => String(c.id) === carreraId)
    if (!c?.slug) return
    setLoadingCarrera(true)
    carrerasService.getBySlug(c.slug).then((res) => {
      const data = res.data?.data || res.data
      setMateriasDeCarrera(data?.materias || [])
    }).catch(() => setMateriasDeCarrera([])).finally(() => setLoadingCarrera(false))
  }, [carreraId, carreras])

  const fetchTodosLosHorarios = useCallback(async () => {
    if (allHorarios.length > 0) return
    setLoadingHorarios(true)
    try {
      const res = await horariosService.getAll()
      const data = res.data?.data || res.data || []
      setAllHorarios(data)
    } catch {
      setAllHorarios([])
    } finally {
      setLoadingHorarios(false)
    }
  }, [allHorarios.length])

  useEffect(() => { fetchTodosLosHorarios() }, [fetchTodosLosHorarios])

  const materiaIds = useMemo(() => {
    return new Set(materiasDeCarrera.map((m) => m.id))
  }, [materiasDeCarrera])

  const horariosDeCarrera = useMemo(() => {
    if (materiaIds.size === 0) return []
    return allHorarios.filter((h) => materiaIds.has(h.materia_id))
  }, [allHorarios, materiaIds])

  const comisiones = useMemo(() => {
    const set = new Set(horariosDeCarrera.map((h) => h.comision).filter(Boolean))
    return Array.from(set).sort()
  }, [horariosDeCarrera])

  useEffect(() => { setComision('') }, [carreraId])

  const horariosFiltrados = useMemo(() => {
    if (!comision) return []
    return horariosDeCarrera
      .filter((h) => h.comision === comision)
      .sort((a, b) => {
        const nomA = a.materia?.nombre || ''
        const nomB = b.materia?.nombre || ''
        if (nomA !== nomB) return nomA.localeCompare(nomB)
        return (a.dia || '').localeCompare(b.dia || '')
      })
  }, [horariosDeCarrera, comision])

  return (
    <div className="bg-slate-50">
      <div
        className="bg-gradient-to-br from-slate-900 to-blue-700 text-white bg-cover bg-center"
        style={{ backgroundImage: `url(${estudiantesBg})` }}
      >
        <div className="max-w-content mx-auto px-4 py-12 md:py-16 text-center bg-slate-900/50">
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
          <div className="flex flex-wrap justify-center gap-6">
            {portalCards.map((card) => (
              <div key={card.title}
                className="bg-white rounded-xl shadow-sm p-6 text-center border border-slate-100 transition-shadow hover:shadow-md w-64"
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
            Horarios - Primer Cuatrimestre
          </h2>

          <div className="max-w-lg mx-auto mb-6 bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-center text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Carrera</label>
                <select value={carreraId} onChange={(e) => setCarreraId(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Seleccionar</option>
                  {carreras.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-center text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Comision</label>
                <select value={comision} onChange={(e) => setComision(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={comisiones.length === 0 || loadingCarrera}
                >
                  <option value="">Seleccionar</option>
                  {comisiones.map((c) => (
                    <option key={c} value={c}>Comision {c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loadingHorarios ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden p-8">
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 bg-slate-200 rounded w-full" />
                ))}
              </div>
            </div>
          ) : comision && horariosFiltrados.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-900 text-white">
                      <th className="text-center
                       px-4 py-3 font-semibold">Materia</th>
                      <th className="text-center px-4 py-3 font-semibold">Dia</th>
                      <th className="text-center px-4 py-3 font-semibold">Horario</th>
                      <th className="text-center px-4 py-3 font-semibold">Aula</th>
                      <th className="text-center px-4 py-3 font-semibold">Profesor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {horariosFiltrados.map((h, i) => (
                      <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="text-center px-4 py-3 font-semibold text-slate-900">{h.materia?.nombre || '—'}</td>
                        <td className="text-center px-4 py-3 text-slate-600">{h.dia}</td>
                        <td className="text-center px-4 py-3 text-slate-600">{h.horario}</td>
                        <td className="text-center px-4 py-3 text-slate-600">{h.aula}</td>
                        <td className="text-center px-4 py-3 text-slate-600">{h.profesor || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm">
              {carreraId && loadingCarrera
                ? 'Cargando carrera...'
                : carreraId && comisiones.length === 0
                  ? 'No hay horarios disponibles para esta carrera.'
                  : carreraId && !comision
                    ? 'Selecciona una comision para ver los horarios.'
                    : 'Selecciona una carrera para comenzar.'}
            </div>
          )}
        </section>

        <section className="pb-12">
          <QuickLinks />
        </section>
      </div>
    </div>
  )
}
