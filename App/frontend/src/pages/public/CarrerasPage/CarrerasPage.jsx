import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Badge from '../../../components/ui/Badge/Badge'
import useCarrerasStore from '../../../stores/carrerasStore'

export default function CarrerasPage() {
  const [selectedFilter, setSelectedFilter] = useState('Todas')
  const { carreras, loading, fetchCarreras } = useCarrerasStore()

  useEffect(() => { fetchCarreras() }, [fetchCarreras])

  const modalidades = ['Todas', ...new Set(carreras.map((c) => c.modalidad))]

  const filtradas = selectedFilter === 'Todas'
    ? carreras
    : carreras.filter((c) => c.modalidad === selectedFilter)

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-gradient-to-br from-slate-900 to-blue-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Carreras</h1>
          <p className="text-blue-200 text-lg">Explora nuestras ofertas academicas</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {modalidades.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedFilter(m)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedFilter === m
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="space-y-5">
          {loading ? (
            <p className="text-slate-500 text-center py-12">Cargando carreras...</p>
          ) : filtradas.length === 0 ? (
            <p className="text-slate-500 text-center py-12">No se encontraron carreras.</p>
          ) : (
            filtradas.map((c) => (
              <Link
                key={c.id}
                to={`/carreras/${c.slug}`}
                className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row gap-5 p-5">
                  <div className={`sm:min-w-[120px] sm:w-[120px] h-24 sm:h-auto rounded-lg flex items-center justify-center text-3xl bg-gradient-to-br ${c.color} text-white`}>
                    {c.icono}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={c.badgeVariant}>{c.duracion}</Badge>
                      <span className="text-xs text-slate-400">{c.modalidad}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{c.nombre}</h3>
                    <p className="text-sm text-slate-500 mb-3 line-clamp-2">{c.descripcion}</p>
                    <span className="text-blue-600 font-semibold text-sm">Ver carrera →</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
