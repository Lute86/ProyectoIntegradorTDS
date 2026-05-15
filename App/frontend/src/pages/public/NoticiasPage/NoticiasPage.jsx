import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BADGE_COLORS } from '../../../data/mockNoticias'
import useNoticiasStore from '../../../stores/noticiasStore'
import NewsSidebar from '../../../components/public/NewsSidebar/NewsSidebar'

const ITEMS_PER_PAGE = 4

export default function NoticiasPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const { noticias, loading, fetchNoticias } = useNoticiasStore()

  useEffect(() => { fetchNoticias() }, [fetchNoticias])

  const noticiasFiltradas = useMemo(() => {
    let result = [...noticias]
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((n) =>
        n.titulo.toLowerCase().includes(q) || n.resumen.toLowerCase().includes(q),
      )
    }
    if (selectedCategory) result = result.filter((n) => n.categoria === selectedCategory)
    return result
  }, [noticias, search, selectedCategory])

  const totalPages = Math.max(1, Math.ceil(noticiasFiltradas.length / ITEMS_PER_PAGE))
  const paginatedNoticias = noticiasFiltradas.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  const handleSearch = (e) => { setSearch(e.target.value); setCurrentPage(1) }
  const handleCategoryFilter = (cat) => { setSelectedCategory(cat === selectedCategory ? '' : cat); setCurrentPage(1) }

  const gradientMap = {
    Inscripciones: 'from-blue-400 to-blue-600',
    Exámenes: 'from-emerald-400 to-emerald-600',
    Evento: 'from-amber-400 to-amber-600',
    Tecnología: 'from-purple-400 to-purple-600',
    Becas: 'from-rose-400 to-rose-600',
  }

  // texto corto para mostrar en la imagen de cada noticia
  const initialMap = {
    Inscripciones: 'INS', Exámenes: 'EXA', Evento: 'EVT', Tecnología: 'TEC', Becas: 'BEC',
  }

  const GRADIENT_BG = 'bg-gradient-to-br'

  return (
    <div className="bg-slate-50">
      <div className="bg-gradient-to-br from-slate-900 to-blue-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Noticias</h1>
          <p className="text-blue-200 text-lg">Mantenete informado sobre las novedades del instituto</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <input
                  type="text" placeholder="Buscar noticias..." value={search} onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg className="absolute left-3 top-3 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {(search || selectedCategory) && (
                <button onClick={() => { setSearch(''); setSelectedCategory(''); setCurrentPage(1) }}
                  className="px-4 py-2.5 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
                >Limpiar filtros</button>
              )}
            </div>

            <p className="text-sm text-slate-500 mb-4">
              {noticiasFiltradas.length === 0
                ? 'No se encontraron noticias'
                : `Mostrando ${paginatedNoticias.length} de ${noticiasFiltradas.length} noticia${noticiasFiltradas.length !== 1 ? 's' : ''}`}
            </p>

            <div className="space-y-5">
              {paginatedNoticias.map((n) => (
                <Link key={n.id} to={`/noticias/${n.slug}`}
                  className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="flex flex-col sm:flex-row gap-5 p-5">
                    <div className={`sm:min-w-[140px] sm:w-[140px] h-28 sm:h-auto rounded-lg flex items-center justify-center text-4xl ${GRADIENT_BG} ${gradientMap[n.categoria] || 'from-slate-400 to-slate-600'} text-white`}>
                      {initialMap[n.categoria] || 'NOT'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2 ${BADGE_COLORS[n.categoria] || 'bg-gray-100 text-gray-700'}`}>{n.categoria}</span>
                      <h3 className="text-lg font-bold text-slate-900 mb-1.5 line-clamp-2">{n.titulo}</h3>
                      <p className="text-sm text-slate-500 mb-3 line-clamp-2">{n.resumen}</p>
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Por {n.autor} · {n.fecha}</span>
                        <span className="text-blue-600 font-semibold">Leer más →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center border border-slate-300 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100">◀</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${p === currentPage ? 'bg-blue-600 text-white' : 'border border-slate-300 hover:bg-slate-100'}`}>{p}</button>
                ))}
                <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center border border-slate-300 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100">▶</button>
              </div>
            )}
          </div>

          <NewsSidebar
            noticias={noticias}
            search={search} setSearch={handleSearch}
            selectedCategory={selectedCategory} onCategoryChange={handleCategoryFilter}
          />
        </div>
      </div>
    </div>
  )
}
