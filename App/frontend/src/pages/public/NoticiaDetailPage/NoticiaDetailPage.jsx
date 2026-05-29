import { useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MOCK_NOTICIAS, BADGE_COLORS } from '../../../data/mockNoticias'
import { useNoticiasStore } from '../../../stores/noticiasStore'

const gradientMap = {
  Inscripciones: 'from-blue-400 to-blue-600',
  Examenes: 'from-emerald-400 to-emerald-600',
  'Exámenes': 'from-emerald-400 to-emerald-600',
  Evento: 'from-amber-400 to-amber-600',
  Tecnologia: 'from-purple-400 to-purple-600',
  'Tecnología': 'from-purple-400 to-purple-600',
  Becas: 'from-rose-400 to-rose-600',
}

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
  }
}

export default function NoticiaDetailPage() {
  const { slug } = useParams()
  const { noticias, selectedNoticia, isLoading, fetchNoticiaBySlug } = useNoticiasStore()

  useEffect(() => {
    const fromCache = noticias.find((n) => n.slug === slug || n.slug === decodeURIComponent(slug))
    if (!fromCache) {
      fetchNoticiaBySlug(slug)
    }
  }, [slug, fetchNoticiaBySlug, noticias])

  const noticia = useMemo(() => {
    const lista = Array.isArray(noticias) ? noticias : []
    const storeHit = lista.find((n) => n.slug === slug || n.slug === decodeURIComponent(slug))
      || selectedNoticia
    if (storeHit) return adaptNoticia(storeHit)
    return MOCK_NOTICIAS.find((n) => n.slug === slug || n.slug === decodeURIComponent(slug)) || null
  }, [slug, noticias, selectedNoticia])

  if (isLoading && !noticia) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-gradient-to-br from-slate-900 to-blue-700 text-white">
          <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
            <div className="h-6 bg-blue-300/30 rounded w-24 mb-4 animate-pulse" />
            <div className="h-10 bg-blue-300/30 rounded w-2/3 mb-4 animate-pulse" />
            <div className="h-4 bg-blue-300/20 rounded w-1/3 animate-pulse" />
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 -mt-8 mb-8">
          <div className="h-56 md:h-72 rounded-xl bg-slate-200 animate-pulse" />
        </div>
        <div className="max-w-4xl mx-auto px-4 pb-16">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-10 space-y-3 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-5/6" />
            <div className="h-4 bg-slate-200 rounded w-4/6" />
          </div>
        </div>
      </div>
    )
  }

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
          <div className="flex items-center gap-4 text-blue-200 text-sm">
            <span>Por {noticia.autor}</span>
            <span className="w-1 h-1 bg-blue-300 rounded-full" />
            <span>{noticia.fecha}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8 mb-8">
        <div className={`h-56 md:h-72 rounded-xl bg-gradient-to-br ${gradientMap[noticia.categoria] || 'from-blue-500 to-purple-600'} flex flex-col items-center justify-center text-white shadow-lg`}>
          <h1 className="text-2xl md:text-3xl font-bold px-6 text-center leading-tight">{noticia.titulo}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16">
        <article className="bg-white rounded-xl shadow-sm p-6 md:p-10">
          <div className="font-serif text-lg md:text-xl leading-loose text-slate-800 prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: noticia.contenido }} />
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
