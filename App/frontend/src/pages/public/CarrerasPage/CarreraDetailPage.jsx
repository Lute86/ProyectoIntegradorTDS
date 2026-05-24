import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import Badge from '../../../components/ui/Badge/Badge'
import HorariosTable from '../../../components/public/HorariosTable/HorariosTable'
import { MOCK_CARRERAS } from '../../../data/mockCarreras'

const TABS = [
  { id: 'descripcion', label: 'Descripcion' },
  { id: 'materias', label: 'Materias' },
  { id: 'requisitos', label: 'Requisitos' },
  { id: 'horarios', label: 'Horarios' },
]

export default function CarreraDetailPage() {
  const { slug } = useParams()
  const [activeTab, setActiveTab] = useState('descripcion')

  const carrera = useMemo(
    () => MOCK_CARRERAS.find((c) => c.slug === slug),
    [slug],
  )

  const otrasCarreras = useMemo(
    () => MOCK_CARRERAS.filter((c) => c.slug !== slug),
    [slug],
  )

  const materiasPorCuatri = useMemo(() => {
    if (!carrera) return []
    const grupos = {}
    carrera.materias.forEach((m) => {
      if (!grupos[m.cuatrimestre]) grupos[m.cuatrimestre] = []
      grupos[m.cuatrimestre].push(m)
    })
    return Object.entries(grupos).sort(([a], [b]) => Number(a) - Number(b))
  }, [carrera])

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

  const nombresCuatri = {
    1: 'Primer Cuatrimestre',
    2: 'Segundo Cuatrimestre',
    3: 'Tercer Cuatrimestre',
    4: 'Cuarto Cuatrimestre',
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-gradient-to-br from-slate-900 to-blue-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{carrera.nombre}</h1>
          <p className="text-blue-200">{carrera.titulo_oficial}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
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
                <p className="text-slate-700 leading-relaxed mb-6">{carrera.descripcion_larga}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {carrera.informacion.map((item, i) => (
                    <div key={i} className="bg-white p-4 rounded-lg shadow-sm text-center">
                      <h4 className="text-blue-600 font-bold text-sm mb-1">{item.label}</h4>
                      <p className="text-slate-700 text-sm">{item.valor}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'materias' && (
              <div>
                {materiasPorCuatri.map(([cuatri, materias]) => (
                  <div key={cuatri} className="mb-6">
                    <h4 className="text-blue-600 font-bold mb-3">
                      {nombresCuatri[cuatri] || `Cuatrimestre ${cuatri}`}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {materias.map((m, i) => (
                        <div
                          key={i}
                          className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-600"
                        >
                          <h5 className="font-semibold text-slate-900 text-sm">{m.nombre}</h5>
                          <p className="text-xs text-slate-500 mt-1">{m.carga_horaria}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'requisitos' && (
              <ul className="space-y-3">
                {carrera.requisitos.map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'horarios' && (
              <HorariosTable horarios={carrera.horarios} />
            )}
          </div>

          <aside className="space-y-6">
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <h4 className="font-bold text-slate-900 mb-3">Otras Carreras</h4>
              <ul className="space-y-3">
                {otrasCarreras.map((oc) => (
                  <li key={oc.id} className="flex items-center justify-between">
                    <Link
                      to={`/carreras/${oc.slug}`}
                      className="text-sm font-medium text-slate-700 hover:text-blue-600"
                    >
                      {oc.nombre}
                    </Link>
                    <Badge variant={oc.badgeVariant}>{oc.duracion}</Badge>
                  </li>
                ))}
              </ul>
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
