import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import useCarrerasStore from '../../../stores/carrerasStore'

// genera iniciales del nombre
const iniciales = (nombre) => {
  return nombre.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
}

// capitaliza primera letra
const capitalizar = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : ''

// mapea modalidad a variante de badge
const badgeVariant = (mod) => {
  const mapa = { presencial: 'blue', virtual: 'green', hibrida: 'amber' }
  return mapa[mod] || 'gray'
}

export default function CarrerasPage() {
  const { carreras, loading, fetchCarreras } = useCarrerasStore()
  const [selectedFilter, setSelectedFilter] = useState('Todas')

  useEffect(() => { fetchCarreras() }, [])

  const modalidades = useMemo(() => {
    const mods = [...new Set(carreras.map((c) => c.modalidad).filter(Boolean))]
    return ['Todas', ...mods.map(capitalizar)]
  }, [carreras])

  const filtradas = useMemo(() => {
    if (selectedFilter === 'Todas') return carreras
    return carreras.filter((c) => capitalizar(c.modalidad) === selectedFilter)
  }, [carreras, selectedFilter])

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-gradient-to-br from-slate-900 to-blue-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Carreras</h1>
          <p className="text-blue-200 text-lg">Explora nuestras ofertas academicas</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-5 animate-pulse">
                <div className="flex gap-5">
                  <div className="w-[120px] h-24 rounded-lg bg-slate-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-6 bg-slate-200 rounded w-2/3" />
                    <div className="h-4 bg-slate-100 rounded w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
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
              {filtradas.length === 0 ? (
                <p className="text-slate-500 text-center py-12">No se encontraron carreras.</p>
              ) : (
                filtradas.map((c) => (
                  <Link
                    key={c.id}
                    to={`/carreras/${c.slug}`}
                    className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row gap-5 p-5">
                      <div
                        className="sm:min-w-[120px] sm:w-[120px] h-24 sm:h-auto rounded-lg flex items-center justify-center text-3xl text-white"
                        style={{ backgroundColor: c.color || '#3B82F6' }}
                      >
                        {iniciales(c.nombre)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            badgeVariant(c.modalidad) === 'blue' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            badgeVariant(c.modalidad) === 'green' ? 'bg-green-50 text-green-600 border-green-100' :
                            badgeVariant(c.modalidad) === 'amber' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            'bg-gray-50 text-gray-600 border-gray-100'
                          }`}>
                            {c.duracion ? `${c.duracion} anos` : ''}
                          </span>
                          {c.modalidad && (
                            <span className="text-xs text-slate-400">{capitalizar(c.modalidad)}</span>
                          )}
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
          </>
        )}
      </div>
    </div>
  )
}
