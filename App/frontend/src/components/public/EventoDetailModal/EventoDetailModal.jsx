import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const estadoBadge = {
  confirmado: 'bg-green-50 text-green-700 border-green-200',
  pendiente: 'bg-amber-50 text-amber-700 border-amber-200',
  finalizado: 'bg-blue-50 text-blue-700 border-blue-200',
  cancelado: 'bg-red-50 text-red-700 border-red-200',
  publicado: 'bg-green-50 text-green-700 border-green-200',
  borrador: 'bg-gray-50 text-gray-600 border-gray-200',
}

const modalidadBadge = {
  presencial: 'bg-blue-50 text-blue-600 border-blue-100',
  virtual: 'bg-emerald-50 text-emerald-600 border-emerald-100',
}

function formatFecha(fechaStr) {
  if (!fechaStr) return ''
  const [y, m, d] = fechaStr.split('-')
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  return `${parseInt(d)} de ${meses[parseInt(m) - 1]} de ${y}`
}

export default function EventoDetailModal({ evento, onClose }) {
  const titulo = evento.nombre || evento.titulo
  const descripcion = evento.descripcion
  const fecha = formatFecha(evento.fecha)
  const hora = evento.hora || ''
  const ubicacion = evento.ubicacion || ''
  const estado = evento.estado || ''
  const modalidad = evento.modalidad || ''

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/60" />

      <div className="relative rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200" style={{ backgroundColor: 'var(--clr-card)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-2xl" style={{ backgroundColor: 'var(--clr-card)' }}>
          <h2 className="text-xl font-bold text-slate-900 pr-4">{titulo}</h2>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors shrink-0"
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{fecha}</span>
            </div>

            {hora && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{hora} hs</span>
              </div>
            )}

            {ubicacion && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{ubicacion}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {estado && (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${estadoBadge[estado] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                {estado.charAt(0).toUpperCase() + estado.slice(1)}
              </span>
            )}
            {modalidad && (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${modalidadBadge[modalidad] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                {modalidad.charAt(0).toUpperCase() + modalidad.slice(1)}
              </span>
            )}
          </div>

          {descripcion && (
            <div className="pt-2">
              <h3 className="text-sm font-bold text-slate-700 mb-2">Descripcion</h3>
              <div className="text-sm text-slate-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: descripcion }}
              />
            </div>
          )}
        </div>

        <div className="sticky bottom-0 border-t border-slate-100 px-6 py-4 flex items-center justify-between rounded-b-2xl" style={{ backgroundColor: 'var(--clr-card)' }}>
          <Link to="/eventos" onClick={onClose}
            className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver eventos
          </Link>
          <button onClick={onClose}
            className="px-5 py-2 bg-slate-800 text-white text-sm font-semibold rounded-lg hover:bg-slate-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
