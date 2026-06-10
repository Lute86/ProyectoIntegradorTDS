import { Link } from 'react-router-dom'
import Badge from '../../ui/Badge/Badge'
import IconoCategoria from '../../ui/IconoCategoria/IconoCategoria'

const badgeMap = {
  Inscripciones: 'blue',
  Examenes: 'green',
  Evento: 'amber',
  Tecnologia: 'purple',
  Becas: 'rose',
}

export default function NewsCard({ noticia }) {
  const { titulo, slug, categoria, resumen, fecha } = noticia

  return (
    <Link to={`/noticias/${slug}`} className="block border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden" style={{ backgroundColor: 'var(--clr-card)' }}>
      <div className="p-6">
        <Badge variant={badgeMap[categoria] || 'gray'}>
          <IconoCategoria categoria={categoria} className="w-3.5 h-3.5 mr-1" />
          {categoria}
        </Badge>
        <h3 className="text-lg font-bold text-slate-900 mt-3 mb-2 line-clamp-2">{titulo}</h3>
        <p className="text-sm text-slate-500 mb-4 line-clamp-2">{resumen}</p>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{fecha}</span>
          <span className="text-blue-600 font-semibold">Leer más →</span>
        </div>
      </div>
    </Link>
  )
}
