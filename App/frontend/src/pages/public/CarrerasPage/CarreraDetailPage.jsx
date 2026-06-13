import { useState, useMemo, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import useCarrerasStore from '../../../stores/carrerasStore'
import { useSiteConfigStore } from '../../../stores/siteConfigStore'
import { horariosService } from '../../../services/horariosService'
import CareerIcon from '../../../components/ui/CareerIcon/CareerIcon'
import carreraImg from '../../../assets/fonts/carrera1.png'

const capitalizar = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : ''

const TABS = [
  { id: 'descripcion', label: 'Descripcion' },
  { id: 'materias', label: 'Materias' },
  { id: 'requisitos', label: 'Requisitos' },
  { id: 'horarios', label: 'Horarios' },
]

const badgeVariant = (mod) => {
  const mapa = { presencial: 'blue', virtual: 'green', hibrida: 'amber' }
  return mapa[mod] || 'gray'
}

const badgeStyles = {
  blue: 'bg-blue-50 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-400/20',
  green: 'bg-green-50 dark:bg-green-400/10 text-green-600 dark:text-green-400 border-green-100 dark:border-green-400/20',
  amber: 'bg-amber-50 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-400/20',
  gray: 'bg-gray-50 dark:bg-gray-400/10 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-400/20',
}

const nombresCuatri = {
  1: 'Primer Cuatrimestre',
  2: 'Segundo Cuatrimestre',
  3: 'Tercer Cuatrimestre',
  4: 'Cuarto Cuatrimestre',
}

export default function CarreraDetailPage() {
  const { slug } = useParams()
  const { carreras, selectedCarrera, loading, fetchCarreraBySlug } = useCarrerasStore()
  const layout = useSiteConfigStore((s) => s.config.layout)
  const [activeTab, setActiveTab] = useState('descripcion')
  const [horarios, setHorarios] = useState([])
  const [selectedComision, setSelectedComision] = useState('')
  const [cuatriFilter, setCuatriFilter] = useState('')
  const [loadingHorarios, setLoadingHorarios] = useState(false)
  const [fetchedHorarios, setFetchedHorarios] = useState(false)

  const carrera = useMemo(() => {
    return selectedCarrera || carreras.find((c) => c.slug === slug) || null
  }, [slug, carreras, selectedCarrera])

  const otrasCarreras = useMemo(() => {
    if (!carrera) return []
    return carreras.filter((c) => c.slug !== slug)
  }, [carrera, carreras, slug])

  const materiasPorCuatri = useMemo(() => {
    if (!carrera?.carreraMaterias) return []
    const grupos = {}
    carrera.carreraMaterias.forEach((cm) => {
      const c = cm.cuatrimestre
      if (!grupos[c]) grupos[c] = []
      grupos[c].push({
        ...cm.materia,
        cuatrimestre: cm.cuatrimestre,
        carga_horaria_semanal: cm.carga_horaria_semanal,
      })
    })
    return Object.entries(grupos).sort(([a], [b]) => Number(a) - Number(b))
  }, [carrera])

  useEffect(() => {
    fetchCarreraBySlug(slug)
  }, [slug, fetchCarreraBySlug])

  useEffect(() => {
    setSelectedComision('')
    setCuatriFilter('')
    setHorarios([])
    setActiveTab('descripcion')
    setFetchedHorarios(false)
  }, [slug])

  const fetchHorarios = useCallback(async (carreraId) => {
    if (!carreraId) return
    setLoadingHorarios(true)
    try {
      const res = await horariosService.getAll({ carrera_id: carreraId })
      setHorarios(res.data?.data || res.data || [])
    } catch {
      setHorarios([])
    } finally {
      setLoadingHorarios(false)
      setFetchedHorarios(true)
    }
  }, [])

  useEffect(() => {
    if (activeTab === 'horarios' && carrera?.id && !fetchedHorarios && !loadingHorarios) {
      fetchHorarios(carrera.id)
    }
  }, [activeTab, carrera?.id, fetchedHorarios, loadingHorarios, fetchHorarios])

  const comisiones = useMemo(() => {
    const set = new Set(horarios.map((h) => h.comision).filter(Boolean))
    return Array.from(set).sort()
  }, [horarios])

  const cuatrimestres = useMemo(() => {
    const set = new Set(
      horarios.map((h) => h.carreraMateria?.cuatrimestre).filter(Boolean)
    )
    return Array.from(set).sort((a, b) => a - b)
  }, [horarios])

  const horariosFiltrados = useMemo(() => {
    if (!selectedComision) return []
    let filtrados = horarios
    if (selectedComision !== 'Todas') {
      filtrados = filtrados.filter((h) => h.comision === selectedComision)
    }
    if (cuatriFilter) {
      filtrados = filtrados.filter(
        (h) => h.carreraMateria?.cuatrimestre === cuatriFilter
      )
    }
    return filtrados.sort((a, b) => {
      const nomA = a.carreraMateria?.materia?.nombre || ''
      const nomB = b.carreraMateria?.materia?.nombre || ''
      if (nomA !== nomB) return nomA.localeCompare(nomB)
      return (a.dia || '').localeCompare(b.dia || '')
    })
  }, [horarios, selectedComision, cuatriFilter])

  if (loading && !carrera) {
    return (
    <div className="min-h-screen dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-500 bg-site-bg">
      <div className={layout === 'boxed' ? 'max-w-[1280px] mx-auto' : ''}>
        <div className="bg-gradient-to-br from-slate-900 to-blue-700 text-white">
          <div className="max-w-content mx-auto px-4 py-12 md:py-16 animate-pulse">
            <div className="h-8 bg-blue-300/30 rounded w-2/3 mb-2" />
            <div className="h-4 bg-blue-300/20 rounded w-1/3" />
          </div>
        </div>
      <div className={`${layout === 'boxed' ? '' : 'max-w-content'} mx-auto px-4 py-8`}>
          <div className="h-96 bg-slate-200 rounded-xl animate-pulse" />
        </div>
      </div>
      </div>
    )
  }

  if (!carrera) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-500 bg-site-bg">
        <div className={layout === 'boxed' ? 'max-w-[1280px] mx-auto' : ''}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-body dark:text-white mb-4">Carrera no encontrada</h1>
          <Link to="/carreras" className="text-blue-600 hover:underline">Volver a carreras</Link>
        </div>
      </div>
      </div>
    )
  }

  const infoCards = [
    { label: 'Duracion', valor: carrera.duracion ? `${carrera.duracion} anos` : '—' },
    { label: 'Modalidad', valor: carrera.modalidad ? capitalizar(carrera.modalidad) : '—' },
    // 
  //  { label: 'Titulo', valor: `Tecnicatura en ${carrera.nombre}` },
  ]

  return (
    <div className="min-h-screen dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-500 bg-site-bg">
      <div className={layout === 'boxed' ? 'max-w-[1280px] mx-auto' : ''}>
      <div
        className="bg-gradient-to-br from-slate-900 to-blue-700 text-white bg-cover bg-center"
        style={{ backgroundImage: `url(${carreraImg})` }}
      >
        <div className={`${layout === 'boxed' ? '' : 'max-w-content'} mx-auto px-4 py-12 md:py-16 bg-black/40`}>
          <div className="flex items-center gap-5">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: carrera.color || '#3B82F6' }}
            >
              {carrera.icono ? <CareerIcon name={carrera.icono} className="w-8 h-8 text-white" /> : (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              )}
            </div>
            <div>
              <h1 className="text-h1 mb-1">{carrera.nombre}</h1>
              <p className="text-blue-200">Tecnicatura en {carrera.nombre}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-content mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <div className="lg:col-span-2 xl:col-span-3">
            <div className="flex gap-1 border-b border-slate-300 mb-6">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-blue-600'
                      : 'text-body/70 dark:text-white/70 border-transparent hover:text-body'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'descripcion' && (
              <div>
                <p className="text-body dark:text-white/80 leading-relaxed mb-6">
                  {carrera.descripcion || 'Sin descripcion disponible.'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {infoCards.map((item, i) => (
                    <div key={i} className="p-4 bg-white dark:bg-white/10 rounded-xl border border-gray-100 dark:border-white/20 shadow-sm text-center">
                      <h4 className="text-blue-600 dark:text-blue-400 font-bold text-sm mb-1">{item.label}</h4>
                      <p className="text-body dark:text-white/80 text-sm">{item.valor}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'requisitos' && (
              <div>
                <h3 className="text-xl font-bold text-body dark:text-white mb-2">Requisitos de Inscripcion</h3>
                <p className="text-body/70 dark:text-white/70 text-sm mb-6">Documentacion necesaria para todas las carreras</p>
                <ul className="space-y-3 max-w-xl">
                  {[
                    'Titulo secundario completo',
                    'DNI original y copia',
                    'Certificado de estudios secundarios',
                    'Partida de nacimiento',
                    '2 fotos 4x4',
                    'Constancia de CUIL',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-body dark:text-white/80">
                      <svg className="w-5 h-5 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'horarios' && (
              <div>
                {comisiones.length > 0 ? (
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-xl font-bold text-body dark:text-white">Horarios</h3>
                    <p className="text-body/70 dark:text-white/70 text-xs">Selecciona una comision y/o cuatrimestre para ver los horarios</p>
                  </div>
                ) : (
                  <h3 className="text-xl font-bold text-body dark:text-white mb-4">Horarios</h3>
                )}

                {loadingHorarios ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white dark:bg-white/10 rounded-xl shadow-sm p-5 animate-pulse">
                        <div className="h-5 bg-slate-200 dark:bg-slate-600 rounded w-1/3 mb-4" />
                        <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-full mb-2" />
                        <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-3/4" />
                      </div>
                    ))}
                  </div>
                ) : comisiones.length === 0 ? (
                  <p className="text-body/50 dark:text-white/50 text-center py-8 text-sm">
                    Sin horarios disponibles para esta carrera.
                  </p>
                ) : (
                  <>
                    {cuatrimestres.length > 1 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        <button onClick={() => setCuatriFilter('')}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                            !cuatriFilter
                              ? 'bg-slate-800 text-white shadow-sm'
                              : 'bg-white dark:bg-white/10 border border-slate-300 dark:border-white/30 text-body dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/20'
                          }`}
                        >Todos los cuatrimestres</button>
                        {cuatrimestres.map((c) => (
                          <button key={c} onClick={() => setCuatriFilter(c)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                              cuatriFilter === c
                                ? 'bg-slate-800 text-white shadow-sm'
                                : 'bg-white dark:bg-white/10 border border-slate-300 dark:border-white/30 text-body dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/20'
                            }`}
                          >{nombresCuatri[c] || `Cuatrimestre ${c}`}</button>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-6">
                      <button onClick={() => setSelectedComision('Todas')}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                          selectedComision === 'Todas'
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-white dark:bg-white/10 border border-slate-300 dark:border-white/30 text-body dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/20'
                        }`}
                      >Todas</button>
                      {comisiones.map((com) => (
                        <button key={com} onClick={() => setSelectedComision(com)}
                          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                            selectedComision === com
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-white dark:bg-white/10 border border-slate-300 dark:border-white/30 text-body dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/20'
                          }`}
                        >Comision {com}</button>
                      ))}
                    </div>

                    {!selectedComision ? null : horariosFiltrados.length === 0 ? (
                    <p className="text-body/50 dark:text-white/50 text-center py-8 text-sm">
                      No hay horarios disponibles para esta seleccion.
                    </p>
                    ) : (
                      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
                        <table className="w-full border-collapse text-sm">
                          <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800">
                              <th className="p-3 text-left font-semibold text-body dark:text-white/70">Materia</th>
                              {selectedComision === 'Todas' && (
                                <th className="p-3 text-left font-semibold text-body dark:text-white/70">Comision</th>
                              )}
                              <th className="p-3 text-left font-semibold text-body dark:text-white/70">Dia</th>
                              <th className="p-3 text-left font-semibold text-body dark:text-white/70">Horario</th>
                            </tr>
                          </thead>
                          <tbody>
                            {horariosFiltrados.map((h, i) => (
                              <tr key={i} className="border-t border-slate-100 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5">
                                <td className="p-3 text-body dark:text-white font-medium">{h.carreraMateria?.materia?.nombre || '—'}</td>
                                {selectedComision === 'Todas' && (
                                  <td className="p-3 text-body dark:text-white/70 font-semibold">Comision {h.comision}</td>
                                )}
                                <td className="p-3 text-body dark:text-white/80">{h.dia}</td>
                                <td className="p-3 text-body dark:text-white/70">{h.horario}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'materias' && (
              <div>
                {materiasPorCuatri.length === 0 ? (
                  <p className="text-body/70 dark:text-white/70 text-center py-8">Sin materias registradas.</p>
                ) : (
                  materiasPorCuatri.map(([cuatri, materias]) => (
                    <div key={cuatri} className="mb-6">
                      <h4 className="text-blue-600 font-bold mb-3">
                        {nombresCuatri[cuatri] || `Cuatrimestre ${cuatri}`}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                        {materias.map((m, i) => (
                          <div
                            key={i}
                            className="p-4 bg-white dark:bg-white/10 rounded-xl border border-gray-100 dark:border-white/20 shadow-sm border-l-4 border-blue-600"
                          >
                            <h5 className="font-semibold text-body dark:text-white text-sm">{m.nombre}</h5>
                            {m.carga_horaria_semanal && (
                              <p className="text-xs text-body/70 dark:text-white/70 mt-1">{m.carga_horaria_semanal}hs semanales</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="p-5 bg-white dark:bg-white/10 rounded-2xl border border-gray-100 dark:border-white/20 shadow-sm">
              <h4 className="font-bold text-body dark:text-white mb-3">Otras Carreras</h4>
              {otrasCarreras.length === 0 ? (
                <p className="text-sm text-body/50 dark:text-white/50">No hay otras carreras.</p>
              ) : (
                <ul className="space-y-3">
                  {otrasCarreras.map((oc) => (
                    <li key={oc.id} className="flex items-center justify-between">
                      <Link
                        to={`/carreras/${oc.slug}`}
                        className="text-sm font-medium text-body dark:text-white/80 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        {oc.nombre}
                      </Link>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeStyles[badgeVariant(oc.modalidad)]}`}>
                        {oc.duracion ? `${oc.duracion} a` : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-blue-600 text-white p-5 rounded-xl text-center">
              <h4 className="font-bold mb-2">¿Tenes dudas?</h4>
              <p className="text-sm text-blue-100 mb-4">Contactanos para mas informacion</p>
              <Link
                to="/contacto"
                className="inline-block px-4 py-2 border-2 border-white text-white text-sm font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                Contacto
              </Link>
            </div>
          </aside>
        </div>
      </div>
      </div>
    </div>
  )
}
