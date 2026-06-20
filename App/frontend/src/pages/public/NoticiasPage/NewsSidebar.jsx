import { Link } from 'react-router-dom'
import clsx from 'clsx'
import IconoCategoria from '../../../components/ui/IconoCategoria/IconoCategoria'

export default function NewsSidebar({
  categorias = [],
  selectedCategory = '',
  onCategoryChange,
  destacadas = [],
}) {
  return (
    <aside className="space-y-6">
      <div className="bg-white dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-white/20 shadow-sm p-5">
        <h3 className="text-sm font-bold text-body dark:text-white mb-3 pb-2 border-b-2 border-blue-600">
          Categorias
        </h3>
        {categorias.length === 0 ? (
          <p className="text-sm text-body/50 dark:text-white/50">Sin categorias</p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-white/10">
            {categorias.map((cat) => (
              <li key={cat.nombre}>
                  <button
                    onClick={() => onCategoryChange?.(cat.nombre)}
                    className={clsx(
                      'w-full flex items-center justify-between py-2.5 text-sm transition-colors',
                      selectedCategory === cat.nombre
                        ? 'text-blue-700 dark:text-blue-400 font-semibold'
                        : 'text-body dark:text-white/70 hover:text-blue-600 dark:hover:text-blue-400',
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <IconoCategoria categoria={cat.nombre} className="w-4 h-4" selected={selectedCategory === cat.nombre} />
                      {cat.nombre}
                    </span>
                  <span className={clsx(
                    'text-xs px-2.5 py-0.5 rounded-full font-medium',
                    selectedCategory === cat.nombre
                      ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300'
                      : 'bg-slate-100 dark:bg-white/10 text-body/70 dark:text-white/50',
                  )}>
                    {cat.count}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-white/20 shadow-sm p-5">
        <h3 className="text-sm font-bold text-body dark:text-white mb-3 pb-2 border-b-2 border-blue-600">
          Noticias Destacadas
        </h3>
        {destacadas.length === 0 ? (
          <p className="text-sm text-body/50 dark:text-white/50">Sin noticias destacadas</p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-white/10">
            {destacadas.slice(0, 5).map((n, i) => (
              <li key={n.slug}>
                <Link
                  to={`/noticias/${n.slug}`}
                  className="flex items-start gap-2.5 py-3 text-sm font-medium text-body dark:text-white/80 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                >
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-2" />
                  <span className="group-hover:text-blue-600 leading-snug">{n.titulo}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  )
}
