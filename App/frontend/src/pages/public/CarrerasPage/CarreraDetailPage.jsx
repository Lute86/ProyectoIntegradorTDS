import { useState, useMemo, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import useCarrerasStore from '../../../stores/carrerasStore'

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
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  green: 'bg-green-50 text-green-600 border-green-100',
  amber: 'bg-amber-50 text-amber-600 border-amber-100',
  gray: 'bg-gray-50 text-gray-600 border-gray-100',
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
  const [activeTab, setActiveTab] = useState('descripcion')

  useEffect(() => {
    const fromCache = carreras.find((c) => c.slug === slug)
    if (!fromCache) {
      fetchCarreraBySlug(slug)
    }
  }, [slug, carreras, fetchCarreraBySlug])

  const carrera = useMemo(() => {
    return carreras.find((c) => c.slug === slug) || selectedCarrera || null
  }, [slug, carreras, selectedCarrera])

  const otrasCarreras = useMemo(() => {
    if (!carrera) return []
    return carreras.filter((c) => c.slug !== slug)
  }, [carrera, carreras, slug])

  const materiasPorCuatri = useMemo(() => {
    if (!carrera?.materias) return []
    const grupos = {}
    carrera.materias.forEach((m) => {
      if (!grupos[m.cuatrimestre]) grupos[m.cuatrimestre] = []
      grupos[m.cuatrimestre].push(m)
    })
    return Object.entries(grupos).sort(([a], [b]) => Number(a) - Number(b))
  }, [carrera])

  if (loading && !carrera) {
    return (
      <div className="bg-slate-50 min-h-screen">
        <div className="bg-gradient-to-br from-slate-900 to-blue-700 text-white">
          <div className="max-w-content mx-auto px-4 py-12 md:py-16 animate-pulse">
            <div className="h-8 bg-blue-300/30 rounded w-2/3 mb-2" />
            <div className="h-4 bg-blue-300/20 rounded w-1/3" />
          </div>
        </div>
        <div className="max-w-content mx-auto px-4 py-8">
          <div className="h-96 bg-slate-200 rounded-xl animate-pulse" />
        </div>
      </div>
    )
  }

  if (!carrera) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Carrera no encontrada</h1>
          <Link to="/carreras" className="text-blue-600 hover:underline">Volver a carreras</Link>
        </div>
      </div>
    )
  }

  const infoCards = [
    { label: 'Duracion', valor: carrera.duracion ? `${carrera.duracion} anos` : '—' },
    { label: 'Modalidad', valor: carrera.modalidad ? capitalizar(carrera.modalidad) : '—' },
    // FALTA: titulo_oficial no existe en BD
    { label: 'Titulo', valor: `Tecnicatura en ${carrera.nombre}` },
  ]

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-gradient-to-br from-slate-900 to-blue-700 text-white">
        <div className="max-w-content mx-auto px-4 py-12 md:py-16">
          <h1 className="text-h1 mb-2">{carrera.nombre}</h1>
          <p className="text-blue-200">Tecnicatura en {carrera.nombre}</p>
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
                      : 'text-slate-500 border-transparent hover:text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'descripcion' && (
              <div>
                <p className="text-slate-700 leading-relaxed mb-6">
                  {carrera.descripcion || 'Sin descripcion disponible.'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {infoCards.map((item, i) => (
                    <div key={i} className="bg-white p-4 rounded-lg shadow-sm text-center">
                      <h4 className="text-blue-600 font-bold text-sm mb-1">{item.label}</h4>
                      <p className="text-slate-700 text-sm">{item.valor}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'requisitos' && (
              <div className="text-center py-12">
                <p className="text-slate-400 text-sm">Proximamente.</p>
              </div>
            )}

            {activeTab === 'horarios' && (
              <div className="text-center py-12">
                <p className="text-slate-400 text-sm">Proximamente.</p>
              </div>
            )}

            {activeTab === 'materias' && (
              <div>
                {materiasPorCuatri.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">Sin materias registradas.</p>
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
                            className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-600"
                          >
                            <h5 className="font-semibold text-slate-900 text-sm">{m.nombre}</h5>
                            {m.carga_horaria_semanal && (
                              <p className="text-xs text-slate-500 mt-1">{m.carga_horaria_semanal}hs semanales</p>
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
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <h4 className="font-bold text-slate-900 mb-3">Otras Carreras</h4>
              {otrasCarreras.length === 0 ? (
                <p className="text-sm text-slate-400">No hay otras carreras.</p>
              ) : (
                <ul className="space-y-3">
                  {otrasCarreras.map((oc) => (
                    <li key={oc.id} className="flex items-center justify-between">
                      <Link
                        to={`/carreras/${oc.slug}`}
                        className="text-sm font-medium text-slate-700 hover:text-blue-600"
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
  )
}
