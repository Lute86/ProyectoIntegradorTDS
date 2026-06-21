import { useState, useMemo, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useSiteConfigStore } from '../../../stores/siteConfigStore'
const BADGE_COLORS = {
  Inscripciones: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
  'Exámenes': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  Examenes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  Evento: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  Tecnología: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300',
  Tecnologia: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300',
  Becas: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
}
import { useNoticiasStore } from '../../../stores/noticiasStore'
import IconoCategoria from '../../../components/ui/IconoCategoria/IconoCategoria'
import NoticiaDetailModal from '../../../components/public/NoticiaDetailModal/NoticiaDetailModal'
import NewsSidebar from './NewsSidebar'
import noticiaBg from '../../../assets/fonts/noticia1.png'


const ITEMS_PER_PAGE = 4

function adaptNoticia(n) {
  return {
    id: n.id,
    slug: n.slug,
    titulo: n.titulo,
    contenido: n.contenido,
    categoria: n.categoria?.nombre || n.categoria || 'Sin categoria',
    autor: n.autor
      ? `${n.autor.nombre || ''} ${n.autor.apellido || ''}`.trim() || 'Admin'
      : n.autor || 'Admin',
    fecha: n.fecha_publicacion
      ? new Date(n.fecha_publicacion).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
      : n.fecha || '',
    resumen: n.resumen || n.contenido?.replace(/<[^>]*>/g, '').replace(/[#*]/g, '').trim().substring(0, 120) + '...' || '',
  }
}

export default function NoticiasPage() {
  const { noticias: storeNoticias, isLoading, fetchNoticias } = useNoticiasStore()
  const [searchParams] = useSearchParams()
  const layout = useSiteConfigStore((s) => s.config.layout)

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categoria') || '')
  const selectedCategoryRef = useRef(selectedCategory)
  selectedCategoryRef.current = selectedCategory
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedNoticia, setSelectedNoticia] = useState(null)

  useEffect(() => { fetchNoticias({ estado: 'publicado' }) }, [fetchNoticias])

  useEffect(() => {
    const cat = searchParams.get('categoria')
    if (cat && cat !== selectedCategoryRef.current) {
      setSelectedCategory(cat)
      setCurrentPage(1)
    }
  }, [searchParams])

  const displayNoticias = useMemo(() => {
    const lista = Array.isArray(storeNoticias) ? storeNoticias : []
    return lista.map(adaptNoticia)
  }, [storeNoticias])

  const categorias = useMemo(() => {
    const counts = {}
    displayNoticias.forEach((n) => { counts[n.categoria] = (counts[n.categoria] || 0) + 1 })
    return Object.entries(counts)
      .filter(([nombre]) => nombre !== 'Evento')
      .map(([nombre, count]) => ({ nombre, count }))
  }, [displayNoticias])

  const noticiasFiltradas = useMemo(() => {
    let result = [...displayNoticias]
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((n) =>
        n.titulo.toLowerCase().includes(q) || n.resumen.toLowerCase().includes(q),
      )
    }
    if (selectedCategory) result = result.filter((n) => n.categoria === selectedCategory)
    return result
  }, [search, selectedCategory, displayNoticias])

  const totalPages = Math.max(1, Math.ceil(noticiasFiltradas.length / ITEMS_PER_PAGE))
  const paginatedNoticias = noticiasFiltradas.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  const handleSearch = (e) => { setSearch(e.target.value); setCurrentPage(1) }
  const handleCategoryFilter = (cat) => { setSelectedCategory(cat === selectedCategory ? '' : cat); setCurrentPage(1) }

  return (
    <div className="dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-700 dark:to-slate-500 bg-slate-50">
      <div className={layout === 'boxed' ? 'max-w-[1280px] mx-auto' : ''}>
      <div
        className="relative bg-gradient-to-br from-slate-900 to-blue-700 text-white bg-cover bg-center min-h-[220px] md:min-h-[280px] flex items-center"
        style={{ backgroundImage: `url(${noticiaBg})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-content mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-h1 mb-3 animate-fade-in-up text-shadow-hero">Noticias</h1>
          <p className="text-white text-xl animate-fade-in-up delay-150">Mantenete informado sobre las novedades del instituto</p>
        </div>
      </div>

      <div className={`${layout === 'boxed' ? '' : 'max-w-content-narrow'} mx-auto px-6 lg:px-8 py-8`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <div className="lg:col-span-2 xl:col-span-3">
            <div className="bg-white dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-white/20 shadow-sm p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-5">
                <div className="flex-1 relative">
                  <input
                    type="text" placeholder="Buscar noticias..." value={search} onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-white/30 rounded-lg text-sm bg-white dark:bg-white/10 text-body dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-body/50 dark:placeholder:text-white/40"
                  />
                  <svg className="absolute left-3 top-3 w-4 h-4 text-body/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {(search || selectedCategory) && (
                  <button onClick={() => { setSearch(''); setSelectedCategory(''); setCurrentPage(1) }}
                    className="px-4 py-2.5 text-sm text-body dark:text-white/70 border border-slate-300 dark:border-white/30 rounded-lg hover:bg-slate-50 dark:hover:bg-white/10"
                  >Limpiar filtros</button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {categorias.map((cat) => (
                  <button key={cat.nombre} onClick={() => handleCategoryFilter(cat.nombre)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      selectedCategory === cat.nombre ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-white/10 text-body dark:text-white/70 hover:bg-slate-200 dark:hover:bg-white/20'
                    }`}>
                    <IconoCategoria categoria={cat.nombre} className="w-3.5 h-3.5" selected={selectedCategory === cat.nombre} />
                    {cat.nombre} ({cat.count})
                  </button>
                ))}
              </div>
            </div>

            {isLoading && storeNoticias.length === 0 ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white dark:bg-white/10 rounded-xl shadow-sm p-5 animate-pulse">
                    <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-1/3 mb-3" />
                    <div className="h-6 bg-slate-200 dark:bg-slate-600 rounded w-2/3 mb-2" />
                    <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {noticiasFiltradas.length === 0 && (
                  <p className="text-sm text-body/70 dark:text-white/50 mb-4">No se encontraron noticias</p>
                )}

                <div className="space-y-5">
                  {paginatedNoticias.map((n) => (
                    <div key={n.id} onClick={() => setSelectedNoticia(n)}
                      className="block bg-white dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-white/20 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer">
                      <div className="flex flex-col sm:flex-row gap-5 p-5">
                        <div className="sm:min-w-[140px] sm:w-[140px] h-28 sm:h-auto rounded-lg flex items-center justify-center bg-gradient-to-br from-slate-400 to-slate-600 text-white">
                          <IconoCategoria categoria={n.categoria} className="w-10 h-10" selected />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2 ${BADGE_COLORS[n.categoria] || 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300'}`}>
                            <IconoCategoria categoria={n.categoria} className="w-3 h-3" />
                            {n.categoria}
                          </span>
                          <h3 className="text-lg font-bold text-body dark:text-white mb-1.5 line-clamp-2">{n.titulo}</h3>
                          <p className="text-sm text-body/70 dark:text-white/70 mb-3 line-clamp-2">{n.resumen}</p>
                          <div className="flex items-center justify-between text-xs text-body/50 dark:text-white/50">
                            <span>Por {n.autor} · {n.fecha}</span>
                            <span className="text-blue-600 dark:text-blue-400 font-semibold">Leer mas →</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}
                      className="w-10 h-10 flex items-center justify-center border border-slate-300 dark:border-white/30 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-white/10">◀</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button key={p} onClick={() => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                        className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${p === currentPage ? 'bg-blue-600 text-white' : 'border border-slate-300 dark:border-white/30 hover:bg-slate-100 dark:hover:bg-white/10'}`}>{p}</button>
                    ))}
                    <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}
                      className="w-10 h-10 flex items-center justify-center border border-slate-300 dark:border-white/30 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-white/10">▶</button>
                  </div>
                )}
              </>
            )}
          </div>
          <NewsSidebar
            categorias={categorias}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryFilter}
            destacadas={displayNoticias.slice(0, 5)}
          />
        </div>
      </div>
      </div>
      {selectedNoticia && (
        <NoticiaDetailModal
          noticia={selectedNoticia}
          onClose={() => setSelectedNoticia(null)}
          showLinkToNoticias={false}
        />
      )}
    </div>
  )
}
