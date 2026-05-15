import { useParams, Link } from 'react-router-dom'
import { MOCK_NOTICIAS, BADGE_COLORS } from '../../../data/mockNoticias'

const gradientMap = {
  Inscripciones: 'from-blue-400 to-blue-600',
  Exámenes: 'from-emerald-400 to-emerald-600',
  Evento: 'from-amber-400 to-amber-600',
  Tecnología: 'from-purple-400 to-purple-600',
  Becas: 'from-rose-400 to-rose-600',
}

export default function NoticiaDetailPage() {
  const { slug } = useParams()
  const noticia = MOCK_NOTICIAS.find((n) => n.slug === slug)

  if (!noticia) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Noticia no encontrada</h1>
          <p className="text-slate-500 mb-6">La noticia que buscas no existe o ha sido eliminada.</p>
          <Link to="/noticias" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            ← Volver a Noticias
          </Link>
        </div>
      </div>
    )
  }

  const badgeColor = BADGE_COLORS[noticia.categoria] || 'bg-gray-100 text-gray-700'

  return (
    <div className="bg-slate-50">
      <div className="bg-gradient-to-br from-slate-900 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${badgeColor}`}>{noticia.categoria}</span>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{noticia.titulo}</h1>
          <div className="flex items-center gap-4 text-blue-200 text-sm">
            <span>Por {noticia.autor}</span>
            <span className="w-1 h-1 bg-blue-300 rounded-full" />
            <span>{noticia.fecha}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8 mb-8">
        <div className={`h-56 md:h-72 rounded-xl bg-gradient-to-br ${gradientMap[noticia.categoria] || 'from-blue-500 to-purple-600'} flex items-center justify-center text-white text-5xl font-bold shadow-lg`}>
          NOT
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16">
        <article className="bg-white rounded-xl shadow-sm p-6 md:p-10">
          <div className="text-slate-700 leading-relaxed whitespace-pre-line">
            {noticia.contenido}
          </div>
        </article>
        <div className="mt-8 text-center">
          <Link to="/noticias" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold">
            ← Volver a todas las noticias
          </Link>
        </div>
      </div>
    </div>
  )
}
