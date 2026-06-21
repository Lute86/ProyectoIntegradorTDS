import IconoCategoria from '../../ui/IconoCategoria/IconoCategoria'

const badgeMap = {
  presencial: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-400/30',
  virtual: 'bg-green-50 text-green-600 border-green-100 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-400/30',
}

export default function EventosCard({ evento, onVerDetalle }) {
  const titulo = evento.nombre || evento.titulo
  const descripcion = evento.descripcion
  const fecha = evento.fecha
  const hora = evento.hora || ''
  const modalidad = evento.modalidad || (evento.ubicacion ? 'presencial' : '')

  return (
    <div onClick={onVerDetalle}
      className="group relative bg-white dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-white/20 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full cursor-pointer overflow-hidden">
      {/* Acento superior con gradiente */}
      <div className="h-1.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]" />
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-start gap-3 mb-3">
          <span className="inline-flex items-center justify-center w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] shadow-sm group-hover:scale-110 transition-transform duration-300">
            <IconoCategoria categoria="Evento" selected className="w-5 h-5" />
          </span>
          <h3 className="text-lg font-bold text-body dark:text-white leading-tight pt-0.5">{titulo}</h3>
        </div>
        <p className="text-sm text-body/70 dark:text-white/70 mb-4 line-clamp-2 flex-1">{descripcion}</p>
        <div className="mt-auto pt-3 border-t border-slate-100 dark:border-white/10">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-body/60 dark:text-white/60">
              <span className="text-[var(--color-primary)] dark:text-blue-300">📅</span>
              {fecha} {hora && `· ${hora}`}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              {modalidad && (
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeMap[modalidad] || 'bg-gray-50 text-gray-600 border-gray-100 dark:bg-gray-500/20 dark:text-gray-300 dark:border-gray-400/30'}`}>
                  {modalidad}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
