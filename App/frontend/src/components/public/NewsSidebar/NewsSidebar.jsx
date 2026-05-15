import { useMemo } from 'react'
import { Link } from 'react-router-dom'

const CATEGORY_COLORS = {
  Inscripciones: 'text-blue-600 bg-blue-100',
  Exámenes: 'text-emerald-600 bg-emerald-100',
  Evento: 'text-amber-600 bg-amber-100',
  Tecnología: 'text-purple-600 bg-purple-100',
  Becas: 'text-rose-600 bg-rose-100',
}

export default function NewsSidebar({ noticias = [], search, setSearch, selectedCategory, onCategoryChange }) {
  const categorias = useMemo(() => {
    const counts = {}
    noticias.forEach((n) => { counts[n.categoria] = (counts[n.categoria] || 0) + 1 })
    return Object.entries(counts).map(([nombre, count]) => ({ nombre, count }))
  }, [noticias])

  const ultimasNoticias = useMemo(() => {
    return [...noticias].slice(0, 4)
  }, [noticias])

  return (
    <aside className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">Buscar</h3>
        <div className="relative">
          <input
            type="text" placeholder="Buscar noticias..." value={search}
            onChange={(e) => { setSearch(e.target.value) }}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg className="absolute left-3 top-3 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">Categorias</h3>
        <ul className="space-y-1">
          {categorias.map((cat) => (
            <li key={cat.nombre}>
              <button onClick={() => onCategoryChange(cat.nombre)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === cat.nombre
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{cat.nombre}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  CATEGORY_COLORS[cat.nombre] || 'text-slate-500 bg-slate-100'
                }`}>{cat.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">Ultimas Noticias</h3>
        <ul className="space-y-3">
          {ultimasNoticias.map((n) => (
            <li key={n.id}>
              <Link to={`/noticias/${n.slug}`}
                className="block text-sm text-slate-700 hover:text-blue-600 font-medium leading-snug transition-colors"
              >
                {n.titulo}
              </Link>
              <span className="text-xs text-slate-400">{n.fecha}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
