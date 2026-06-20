import { useState, useEffect, useMemo } from 'react'
import useCarrerasStore from '../../../stores/carrerasStore'
import { horariosService } from '../../../services/horariosService'
import { useSiteConfigStore } from '../../../stores/siteConfigStore'
import QuickLinks from './QuickLinks'
import estudiantesBg from '../../../assets/fonts/estudiantes1.png'

const nombresCuatri = {
  1: 'Primer Cuatrimestre', 2: 'Segundo Cuatrimestre', 3: 'Tercer Cuatrimestre',
  4: 'Cuarto Cuatrimestre', 5: 'Quinto Cuatrimestre', 6: 'Sexto Cuatrimestre',
}

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
  const layout = useSiteConfigStore((s) => s.config.layout)
  const [horarios, setHorarios] = useState([])
  const [loadingHorarios, setLoadingHorarios] = useState(false)
  const [carreraId, setCarreraId] = useState('')
  const [comision, setComision] = useState('')
  const [cuatriFilter, setCuatriFilter] = useState('')
  const [anioFilter, setAnioFilter] = useState('')

  useEffect(() => { fetchCarreras() }, [fetchCarreras])

  const fetchHorarios = async (id) => {
    if (!id) { setHorarios([]); return }
    setLoadingHorarios(true)
    try {
      const res = await horariosService.getAll({ carrera_id: parseInt(id) })
      setHorarios(res.data?.data || res.data || [])
    } catch {
      setHorarios([])
    } finally {
      setLoadingHorarios(false)
    }
  }

  useEffect(() => { fetchHorarios(carreraId) }, [carreraId])

  const aniosDisponibles = useMemo(() => {
    const set = new Set(horarios.map(h => h.comisionInfo?.anio_lectivo).filter(Boolean))
    return Array.from(set).sort()
  }, [horarios])

  const horariosDelAnio = useMemo(() => {
    if (!anioFilter) return horarios
    return horarios.filter(h => h.comisionInfo?.anio_lectivo === anioFilter)
  }, [horarios, anioFilter])

  const horariosFiltrados = useMemo(() => {
    if (!comision) return []
    let filtrados = horariosDelAnio
    if (comision !== 'Todas') {
      filtrados = filtrados.filter((h) => (h.comisionInfo?.nombre || h.comision) === comision)
    }
    if (cuatriFilter) {
      filtrados = filtrados.filter(
        (h) => h.carreraMateria?.cuatrimestre === cuatriFilter
      )
    }
    return filtrados.sort((a, b) => {
      const cuatriA = a.carreraMateria?.cuatrimestre || 0
      const cuatriB = b.carreraMateria?.cuatrimestre || 0
      if (cuatriA !== cuatriB) return cuatriA - cuatriB
      const nomA = a.carreraMateria?.materia?.nombre || ''
      const nomB = b.carreraMateria?.materia?.nombre || ''
      if (nomA !== nomB) return nomA.localeCompare(nomB)
      return (a.dia || '').localeCompare(b.dia || '')
    })
  }, [horariosDelAnio, comision, cuatriFilter])

  const horariosPorCuatri = useMemo(() => {
    const map = {}
    horariosFiltrados.forEach((h) => {
      const c = h.carreraMateria?.cuatrimestre || 1
      if (!map[c]) map[c] = []
      map[c].push(h)
    })
    return Object.entries(map).sort(([a], [b]) => Number(a) - Number(b))
  }, [horariosFiltrados])

  const comisiones = useMemo(() => {
    const set = new Set(horariosDelAnio.map((h) => h.comisionInfo?.nombre || h.comision).filter(Boolean))
    return Array.from(set).sort()
  }, [horariosDelAnio])

  const comisionesDelCuatri = useMemo(() => {
    const horariosBase = cuatriFilter
      ? horariosDelAnio.filter((h) => h.carreraMateria?.cuatrimestre === cuatriFilter)
      : horariosDelAnio
    const set = new Set(
      horariosBase.map((h) => h.comisionInfo?.nombre || h.comision).filter(Boolean)
    )
    return Array.from(set).sort()
  }, [horariosDelAnio, cuatriFilter])

  const cuatrimestres = useMemo(() => {
    const set = new Set(
      horariosDelAnio.map((h) => h.carreraMateria?.cuatrimestre).filter(Boolean)
    )
    return Array.from(set).sort((a, b) => a - b)
  }, [horariosDelAnio])

  useEffect(() => { setComision(''); setCuatriFilter(''); setAnioFilter('') }, [carreraId])
  useEffect(() => { setComision('') }, [cuatriFilter])
  useEffect(() => { setComision(''); setCuatriFilter('') }, [anioFilter])

  return (
    <div className="dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-700 dark:to-slate-500 bg-slate-100">
      <div className={layout === 'boxed' ? 'max-w-[1280px] mx-auto' : ''}>
      <div
        className="relative bg-gradient-to-br from-slate-900 to-blue-700 text-white bg-cover bg-center min-h-[220px] md:min-h-[280px] flex items-center"
        style={{ backgroundImage: `url(${estudiantesBg})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-content mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-h1 mb-3 animate-fade-in-up text-shadow-hero">Portal del Estudiante</h1>
          <p className="text-white text-xl animate-fade-in-up delay-150">Todo lo que necesitas en un solo lugar</p>
        </div>
      </div>

      <div className={`${layout === 'boxed' ? '' : 'max-w-content'} mx-auto px-4 py-8 space-y-12`}>
        <section>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-body dark:text-white">Accesos Rapidos</h2>
            <p className="text-body/70 dark:text-white/70 mt-1">Herramientas y recursos para estudiantes</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {portalCards.map((card) => (
                <div key={card.title}
                  className="bg-white dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-white/20 shadow-md p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-64"
              >
                <div className={`w-20 h-20 rounded-full ${card.bg} flex items-center justify-center text-3xl mx-auto mb-4`}>
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold text-body dark:text-white mb-2">{card.title}</h3>
                <p className="text-sm text-body/70 dark:text-white/70 mb-4">{card.desc}</p>
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
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-body dark:text-white">
              Horarios de Cursada
            </h2>
          </div>

          <div className="max-w-2xl mx-auto mb-6 bg-white dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-white/20 shadow-sm p-5">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-center text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Carrera</label>
                <select value={carreraId} onChange={(e) => setCarreraId(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 dark:border-white/30 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-body dark:text-white"
                >
                  <option className="dark:bg-slate-800 dark:text-white" value="">Seleccionar</option>
                  {carreras.map((c) => (
                    <option className="dark:bg-slate-800 dark:text-white" key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>

              {carreraId && aniosDisponibles.length > 0 && (
                <div className="flex-1 animate-in fade-in duration-300">
                  <label className="block text-center text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Año lectivo</label>
                  <select value={anioFilter} onChange={(e) => setAnioFilter(Number(e.target.value) || '')}
                    className="w-full px-4 py-2.5 border border-slate-300 dark:border-white/30 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-body dark:text-white"
                  >
                    <option className="dark:bg-slate-800 dark:text-white" value="">Todos los años</option>
                    {aniosDisponibles.map((a) => (
                      <option className="dark:bg-slate-800 dark:text-white" key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              )}

              {carreraId && cuatrimestres.length > 0 && (
                <div className="flex-1 animate-in fade-in duration-300">
                  <label className="block text-center text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Cuatrimestre</label>
                  <select value={cuatriFilter} onChange={(e) => setCuatriFilter(Number(e.target.value) || '')}
                    className="w-full px-4 py-2.5 border border-slate-300 dark:border-white/30 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-body dark:text-white"
                  >
                    <option className="dark:bg-slate-800 dark:text-white" value="">Todos los cuatrimestres</option>
                    {cuatrimestres.map((c) => (
                      <option className="dark:bg-slate-800 dark:text-white" key={c} value={c}>{nombresCuatri[c] || `Cuatrimestre ${c}`}</option>
                    ))}
                  </select>
                </div>
              )}

              {carreraId && comisionesDelCuatri.length > 0 && (
                <div className="flex-1 animate-in fade-in duration-300">
                  <label className="block text-center text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Comision</label>
                  <select value={comision} onChange={(e) => setComision(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 dark:border-white/30 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-body dark:text-white"
                  >
                    <option className="dark:bg-slate-800 dark:text-white" value="">Seleccionar</option>
                    <option className="dark:bg-slate-800 dark:text-white" value="Todas">Todas las comisiones</option>
                    {comisionesDelCuatri.map((c) => (
                      <option className="dark:bg-slate-800 dark:text-white" key={c} value={c}>Comision {c}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {loadingHorarios ? (
            <div className="bg-white dark:bg-white/10 rounded-2xl border border-gray-200 dark:border-white/20 shadow-sm overflow-hidden p-8">
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-full" />
                ))}
              </div>
            </div>
          ) : comision && horariosFiltrados.length > 0 ? (
            <div className="space-y-6 max-w-4xl mx-auto px-2">
              {horariosPorCuatri.map(([cuatri, filas]) => (
                <div key={cuatri}>
                  <h3 className="text-lg font-bold text-body dark:text-white mb-2">{nombresCuatri[cuatri] || `Cuatrimestre ${cuatri}`}</h3>
                  <div className="bg-white dark:bg-white/10 rounded-2xl border border-gray-200 dark:border-white/20 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-surface text-white">
                            <th className="text-center px-4 py-3 font-semibold">Materia</th>
                            {comision === 'Todas' && (
                              <th className="text-center px-4 py-3 font-semibold">Comision</th>
                            )}
                            <th className="text-center px-4 py-3 font-semibold">Dia</th>
                            <th className="text-center px-4 py-3 font-semibold">Horario</th>
                            <th className="text-center px-4 py-3 font-semibold">Aula</th>
                            <th className="text-center px-4 py-3 font-semibold">Profesor</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filas.map((h, i) => (
                            <tr key={i} className="border-b border-slate-100 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                              <td className="text-center px-4 py-3 font-semibold text-body dark:text-white">{h.carreraMateria?.materia?.nombre || '—'}</td>
                              {comision === 'Todas' && (
                                <td className="text-center px-4 py-3 font-semibold text-blue-600 dark:text-blue-400">Comision {h.comisionInfo?.nombre || h.comision}</td>
                              )}
                              <td className="text-center px-4 py-3 text-body dark:text-white/70">{h.dia}</td>
                              <td className="text-center px-4 py-3 text-body dark:text-white/70">{h.horario}</td>
                              <td className="text-center px-4 py-3 text-body dark:text-white/70">{h.aula}</td>
                              <td className="text-center px-4 py-3 text-body dark:text-white/70">{h.profesor || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-body/50 dark:text-white/50 text-sm">
              {!carreraId
                ? 'Selecciona una carrera para comenzar.'
                : comisiones.length === 0
                  ? anioFilter && horarios.length > 0 ? 'No hay horarios para el año seleccionado.' : 'No hay horarios disponibles para esta carrera.'
                  : !comision
                    ? 'Selecciona una comision o Todas para ver los horarios.'
                    : 'No hay horarios disponibles para esta seleccion.'}
            </div>
          )}
        </section>

        <section className="pb-12">
          <QuickLinks />
        </section>
      </div>
      </div>
    </div>
  )
}
