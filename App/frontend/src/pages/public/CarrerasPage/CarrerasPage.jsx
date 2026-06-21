import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import useCarrerasStore from '../../../stores/carrerasStore'
import { useSiteConfigStore } from '../../../stores/siteConfigStore'
import PageHero from '../../../components/public/PageHero/PageHero'
import CareerIcon from '../../../components/ui/CareerIcon/CareerIcon'
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

  useEffect(() => { fetchCarreras({ activa: true }) }, [fetchCarreras])

  const modalidades = useMemo(() => {
    const mods = [...new Set(carreras.map((c) => c.modalidad).filter(Boolean))]
    return ['Todas', ...mods.map(capitalizar)]
  }, [carreras])

  const filtradas = useMemo(() => {
    if (selectedFilter === 'Todas') return carreras
    return carreras.filter((c) => capitalizar(c.modalidad) === selectedFilter)
  }, [carreras, selectedFilter])

  return (
    <div className="min-h-screen dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-700 dark:to-slate-500 bg-slate-100">
      <div className={layout === 'boxed' ? 'max-w-[1280px] mx-auto' : ''}>
      <PageHero
        eyebrow="Oferta academica"
        title="Carreras"
        subtitle="Explora nuestras ofertas academicas"
        image={carreraImg}
      />

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
                    className="w-full md:w-[calc(50%-12px)] max-w-lg flex flex-col bg-white dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-white/20 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden group"
                  >
                    <div
                      className="relative h-28 flex items-center gap-4 px-6 overflow-hidden"
                      style={{ background: `linear-gradient(135deg, ${c.color || '#3B82F6'} 0%, ${c.color || '#3B82F6'}cc 55%, ${c.color || '#3B82F6'}80 100%)` }}
                    >
                      <div className="absolute -right-6 -top-8 w-28 h-28 rounded-full bg-white/15 blur-md" />
                      <div className="absolute -left-8 -bottom-10 w-32 h-32 rounded-full bg-black/10 blur-md" />
                      <CareerIcon
                        name={c.icono || 'graduation'}
                        className="relative w-12 h-12 shrink-0 [&_svg]:fill-white drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                      />
                      <h3 className="relative text-white text-lg font-bold leading-tight text-shadow-hero line-clamp-2">{c.nombre}</h3>
                    </div>
                    <div className="flex flex-col flex-1 p-4">
                      <p className="text-sm text-body/70 dark:text-white/70 mb-3 line-clamp-2 flex-1">{c.descripcion}</p>
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
