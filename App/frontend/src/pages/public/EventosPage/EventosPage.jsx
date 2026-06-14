import { useState, useMemo, useEffect } from 'react'
import { useEventosStore } from '../../../stores/eventosStore'
import { useSiteConfigStore } from '../../../stores/siteConfigStore'
import EventoDetailModal from '../../../components/public/EventoDetailModal/EventoDetailModal'
import noticiaBg from '../../../assets/fonts/noticia1.png'

const estadoBadgeMap = {
  confirmado: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-300 dark:border-green-400/30',
  pendiente: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-400/30',
  finalizado: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-400/30',
  cancelado: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-400/30',
  publicado: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-300 dark:border-green-400/30',
  borrador: 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-500/20 dark:text-gray-300 dark:border-gray-400/30',
}

const modalidadAccentMap = {
  presencial: 'border-l-blue-500 bg-blue-50/30 dark:bg-blue-500/10',
  virtual: 'border-l-emerald-500 bg-emerald-50/30 dark:bg-emerald-500/10',
}

const modalidadBadgeMap = {
  presencial: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-400/30',
  virtual: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-400/30',
}

const modalidadIconMap = {
  presencial: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  virtual: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
}

function formatFecha(fechaStr) {
  if (!fechaStr) return ''
  const [y, m, d] = fechaStr.split('-')
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl font-bold text-body dark:text-white leading-none">{parseInt(d)}</span>
      <span className="text-xs text-body/50 dark:text-white/50 uppercase tracking-wider whitespace-nowrap">{meses[parseInt(m) - 1]} {y}</span>
    </div>
  )
}

const ITEMS_PER_PAGE = 5

export default function EventosPage() {
  const { eventos, isLoading, fetchEventos } = useEventosStore()
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedEvento, setSelectedEvento] = useState(null)

  useEffect(() => { fetchEventos() }, [fetchEventos])

  const filtrados = useMemo(() => {
    let result = eventos || []
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((e) => {
        const titulo = e.nombre || e.titulo || ''
        return titulo.toLowerCase().includes(q) ||
          (e.descripcion || '').toLowerCase().includes(q)
      })
    }
    return result
  }, [search, eventos])

  const totalPages = Math.max(1, Math.ceil(filtrados.length / ITEMS_PER_PAGE))
  const paginados = filtrados.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  const layout = useSiteConfigStore((s) => s.config.layout)

  return (
    <div className="min-h-screen dark:bg-gradient-to-b dark:from-slate-600 dark:to-slate-500 bg-site-bg">
      <div className={layout === 'boxed' ? 'max-w-[1280px] mx-auto' : ''}>
      <div
        className="bg-gradient-to-br from-slate-900 to-blue-700 text-white bg-cover bg-center min-h-[220px] md:min-h-[280px] flex items-center"
        style={{ backgroundImage: `url(${noticiaBg})` }}
      >
        <div className="max-w-content mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-h1 mb-3">Eventos</h1>
          <p className="text-white text-xl">Actividades y novedades del instituto</p>
        </div>
      </div>

      <div className={`${layout === 'boxed' ? '' : 'max-w-content'} mx-auto px-4 py-8`}>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-white/20 shadow-sm p-5 mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text" placeholder="Buscar eventos..." value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-white/30 rounded-lg text-sm bg-white dark:bg-white/10 text-body dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-body/50 dark:placeholder:text-white/40"
                />
                <svg className="absolute left-3 top-3 w-4 h-4 text-body/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {search && (
                <button onClick={() => { setSearch(''); setCurrentPage(1) }}
                  className="px-4 py-2.5 text-sm text-body dark:text-white/70 border border-slate-300 dark:border-white/30 rounded-lg hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
                >Limpiar filtros</button>
              )}
            </div>
          </div>

          {isLoading && eventos.length === 0 ? (
            <div className="space-y-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-white/10 rounded-xl shadow-sm p-6 animate-pulse">
                  <div className="flex gap-5">
                    <div className="w-16 shrink-0 space-y-1">
                      <div className="h-6 bg-slate-200 dark:bg-slate-600 rounded" />
                      <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded" />
                    </div>
                    <div className="flex-1">
                      <div className="h-5 bg-slate-200 dark:bg-slate-600 rounded w-2/3 mb-3" />
                      <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-full mb-2" />
                      <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filtrados.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-slate-300 dark:text-white/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-body/70 dark:text-white/70 text-lg font-medium">No se encontraron eventos</p>
              <p className="text-body/50 dark:text-white/50 text-sm mt-1">Proba con otros terminos de busqueda</p>
            </div>
          ) : (
            <>
              <div className="space-y-5">
                {paginados.map((e) => {
                  const titulo = e.nombre || e.titulo
                  const descripcion = e.descripcion
                  const fecha = e.fecha
                  const hora = e.hora || ''
                  const modalidad = e.modalidad || ''
                  const estado = e.estado || ''
                  const ubicacion = e.ubicacion || ''
                  const accent = modalidad ? (modalidadAccentMap[modalidad] || 'border-l-slate-300 dark:border-l-slate-500') : 'border-l-slate-300 dark:border-l-slate-500'
                  const badge = modalidad ? (modalidadBadgeMap[modalidad] || 'bg-slate-50 text-body border-slate-200 dark:bg-slate-500/20 dark:text-slate-300 dark:border-slate-400/30') : null
                  const icon = modalidad ? (modalidadIconMap[modalidad] || null) : null
                  return (
                    <div key={e.id}
                      onClick={() => setSelectedEvento(e)}
                      className={`bg-white dark:bg-white/10 backdrop-blur-sm rounded-2xl border-l-4 ${accent} border border-gray-100 dark:border-white/20 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer`}
                    >
                      <div className="p-6 md:p-8">
                        <div className="flex gap-5">
                          <div className="hidden sm:flex flex-col items-center justify-center w-20 shrink-0 border-r border-slate-100 dark:border-white/10 pr-5">
                            {formatFecha(fecha)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-body dark:text-white mb-3 leading-snug">{titulo}</h3>
                            <p className="text-sm text-body/70 dark:text-white/70 mb-5 leading-relaxed line-clamp-2">
                              {descripcion?.replace(/<[^>]*>/g, '')}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100 dark:border-white/10">
                              {badge && icon && (
                                <div className="flex items-center gap-2 text-sm text-body/50 dark:text-white/50">
                                  {icon}
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badge}`}>
                                    {modalidad}
                                  </span>
                                </div>
                              )}
                              {estado && (
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${estadoBadgeMap[estado] || 'bg-slate-50 text-body border-slate-200 dark:bg-slate-500/20 dark:text-slate-300 dark:border-slate-400/30'}`}>
                                  {estado.charAt(0).toUpperCase() + estado.slice(1)}
                                </span>
                              )}
                              {ubicacion && (
                                <span className="text-sm text-body/50 dark:text-white/50 flex items-center gap-1">
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  {ubicacion}
                                </span>
                              )}
                              <span className="text-sm text-body/50 dark:text-white/50">
                                {hora && `${hora} hs`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center border border-slate-300 dark:border-white/30 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                  >◀</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                      className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${p === currentPage ? 'bg-blue-600 text-white shadow-sm' : 'border border-slate-300 dark:border-white/30 hover:bg-slate-100 dark:hover:bg-white/10'}`}
                    >{p}</button>
                  ))}
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                    className="w-10 h-10 flex items-center justify-center border border-slate-300 dark:border-white/30 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                  >▶</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {selectedEvento && (
        <EventoDetailModal
          evento={selectedEvento}
          onClose={() => setSelectedEvento(null)}
        />
      )}
      </div>
    </div>
  )
}
