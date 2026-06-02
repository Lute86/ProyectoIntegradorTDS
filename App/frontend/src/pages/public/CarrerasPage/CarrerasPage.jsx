import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import useCarrerasStore from '../../../stores/carrerasStore'
import carreraImg from '../../../assets/fonts/carrera1.png'

const capitalizar = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : ''

const badgeVariant = (mod) => {
  const mapa = { presencial: 'blue', virtual: 'green', hibrida: 'amber' }
  return mapa[mod] || 'gray'
}

const IconAcademico = () => (
  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
  </svg>
)

export default function CarrerasPage() {
  const { carreras, loading, fetchCarreras } = useCarrerasStore()
  const [selectedFilter, setSelectedFilter] = useState('Todas')

  useEffect(() => { fetchCarreras() }, [fetchCarreras])

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
      <div
        className="bg-gradient-to-br from-slate-900 to-blue-700 text-white bg-cover bg-center"
        style={{ backgroundImage: `url(${carreraImg})` }}
      >
        <div className="max-w-content mx-auto px-4 py-12 md:py-16 text-center bg-slate-900/50">
          <h1 className="text-h1 mb-3">Carreras</h1>
          <p className="text-blue-200 text-lg">Explora nuestras ofertas academicas</p>
        </div>
      </div>

      <div className="max-w-content mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="h-32 bg-slate-200" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-slate-200 rounded w-2/3" />
                  <div className="h-4 bg-slate-100 rounded w-full" />
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
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

            {filtradas.length === 0 ? (
              <p className="text-slate-500 text-center py-12">No se encontraron carreras.</p>
            ) : (
              <div className="flex flex-wrap gap-6 justify-center items-stretch">
                {filtradas.map((c) => (
                  <Link
                    key={c.id}
                    to={`/carreras/${c.slug}`}
                    className="w-full md:w-[calc(50%-12px)] max-w-lg bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                  >
                    <div
                      className="h-24 flex items-center justify-center text-white"
                      style={{ backgroundColor: c.color || '#3B82F6' }}
                    >
                      <div className="text-white/90 group-hover:scale-110 transition-transform duration-300">
                        <IconAcademico />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-bold text-slate-900 mb-1.5">{c.nombre}</h3>
                      <p className="text-sm text-slate-500 mb-3 line-clamp-2">{c.descripcion}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            badgeVariant(c.modalidad) === 'blue' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            badgeVariant(c.modalidad) === 'green' ? 'bg-green-50 text-green-600 border-green-100' :
                            badgeVariant(c.modalidad) === 'amber' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            'bg-gray-50 text-gray-600 border-gray-100'
                          }`}>
                            {c.duracion ? `${c.duracion} años` : ''}
                          </span>
                          {c.modalidad && (
                            <span className="text-xs text-slate-400">{capitalizar(c.modalidad)}</span>
                          )}
                        </div>
                        <span className="text-blue-600 font-semibold text-sm group-hover:underline">Ver carrera →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
