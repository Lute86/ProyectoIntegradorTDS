import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import useCarrerasStore from '../../../stores/carrerasStore'
import { useSiteConfigStore } from '../../../stores/siteConfigStore'
import carreraImg from '../../../assets/fonts/carrera1.png'

const capitalizar = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : ''

const badgeVariant = (mod) => {
  const mapa = { presencial: 'blue', virtual: 'green', hibrida: 'amber' }
  return mapa[mod] || 'gray'
}

export default function CarrerasPage() {
  const { carreras, loading, fetchCarreras } = useCarrerasStore()
  const layout = useSiteConfigStore((s) => s.config.layout)
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
    <div className="min-h-screen dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-500 bg-site-bg">
      <div className={layout === 'boxed' ? 'max-w-[1280px] mx-auto' : ''}>
      <div
        className="relative bg-gradient-to-br from-slate-900 to-blue-700 text-white bg-cover bg-center min-h-[220px] md:min-h-[280px] flex items-center"
        style={{ backgroundImage: `url(${carreraImg})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-content mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-h1 mb-3">Carreras</h1>
          <p className="text-white text-xl">Explora nuestras ofertas academicas</p>
        </div>
      </div>

      <div className={`${layout === 'boxed' ? '' : 'max-w-content'} mx-auto px-4 py-8`}>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-white/10 rounded-2xl shadow-sm overflow-hidden animate-pulse">
                <div className="h-32 bg-slate-200 dark:bg-slate-600" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-slate-200 dark:bg-slate-600 rounded w-2/3" />
                  <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-full" />
                  <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-3/4" />
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
                      : 'bg-white dark:bg-white/10 border border-slate-300 dark:border-white/30 text-body dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/20'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {filtradas.length === 0 ? (
              <p className="text-body/70 dark:text-white/50 text-center py-12">No se encontraron carreras.</p>
            ) : (
              <div className="flex flex-wrap gap-6 justify-center items-stretch">
                {filtradas.map((c) => (
                  <Link
                    key={c.id}
                    to={`/carreras/${c.slug}`}
                    className="w-full md:w-[calc(50%-12px)] max-w-lg bg-white dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-white/20 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
                  >
                    <div
                      className="h-24 flex items-center justify-center text-white text-base font-bold px-4 text-center leading-tight"
                      style={{ backgroundColor: c.color || '#3B82F6' }}
                    >
                      {c.nombre}
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-body/70 dark:text-white/70 mb-3 line-clamp-2">{c.descripcion}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/10">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            badgeVariant(c.modalidad) === 'blue' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-400/30' :
                            badgeVariant(c.modalidad) === 'green' ? 'bg-green-50 text-green-600 border-green-100 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-400/30' :
                            badgeVariant(c.modalidad) === 'amber' ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-400/30' :
                            'bg-gray-50 text-gray-600 border-gray-100 dark:bg-gray-500/20 dark:text-gray-300 dark:border-gray-400/30'
                          }`}>
                            {c.duracion ? `${c.duracion} años` : ''}
                          </span>
                          {c.modalidad && (
                            <span className="text-xs text-body/50 dark:text-white/50">{capitalizar(c.modalidad)}</span>
                          )}
                        </div>
                        <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm group-hover:underline">Ver carrera →</span>
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
    </div>
  )
}
