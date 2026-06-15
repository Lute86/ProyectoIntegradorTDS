import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import IconoCategoria from '../../ui/IconoCategoria/IconoCategoria'

const BADGE_COLORS = {
  Inscripciones: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
  'Exámenes': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  Examenes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  Evento: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  Tecnología: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300',
  Tecnologia: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300',
  Becas: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
}

export default function NoticiaDetailModal({ noticia, onClose }) {
  const titulo = noticia.titulo
  const contenido = noticia.contenido
  const categoria = noticia.categoria || 'Sin categoria'
  const autor = noticia.autor || 'Admin'
  const fecha = noticia.fecha || ''

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const badgeColor = BADGE_COLORS[categoria] || 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/60" />

      <div className="relative bg-white dark:bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl w-full sm:min-w-[36rem] max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 border-b border-slate-100 dark:border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 ${badgeColor}`}>
              <IconoCategoria categoria={categoria} className="w-3 h-3" />
              {categoria}
            </span>
            <h2 className="text-xl font-bold text-body dark:text-white truncate">{titulo}</h2>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors shrink-0"
          >
            <svg className="w-5 h-5 text-body/50 dark:text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1 min-h-0 modal-scrollbar">
          <div className="flex items-center gap-3 text-sm text-body/70 dark:text-white/70">
            <span>Por {autor}</span>
            <span className="w-1 h-1 bg-body/30 dark:bg-white/30 rounded-full" />
            <span>{fecha}</span>
          </div>

          {contenido && (
            <div className="text-sm text-body leading-relaxed dark:text-white/80"
              dangerouslySetInnerHTML={{ __html: contenido }}
            />
          )}
        </div>

        <div className="shrink-0 border-t border-slate-100 dark:border-white/10 px-6 py-4 flex items-center justify-between">
          <Link to="/noticias" onClick={onClose}
            className="px-5 py-2.5 bg-blue-600 dark:bg-blue-500/20 dark:text-blue-400 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 dark:hover:bg-blue-500/30 hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Ver noticias
          </Link>
          <button onClick={onClose}
            className="px-5 py-2.5 bg-gray-900 dark:bg-white/10 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-white/20 hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
