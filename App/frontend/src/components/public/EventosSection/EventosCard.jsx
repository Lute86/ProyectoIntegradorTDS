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
    <div className="bg-white dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-white/20 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
      <div className="p-6 flex flex-col h-full">
        <h3 className="text-lg font-bold text-body dark:text-white mb-3">{titulo}</h3>
        <p className="text-sm text-slate-500 dark:text-white/70 mb-4 line-clamp-2 flex-1">{descripcion}</p>
        <div className="mt-auto pt-3 border-t border-slate-100 dark:border-white/10">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-400 dark:text-white/50">{fecha} {hora && `· ${hora}`}</span>
            <div className="flex items-center gap-2 shrink-0">
              {modalidad && (
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeMap[modalidad] || 'bg-gray-50 text-gray-600 border-gray-100 dark:bg-gray-500/20 dark:text-gray-300 dark:border-gray-400/30'}`}>
                  {modalidad}
                </span>
              )}
              <button onClick={onVerDetalle}
                className="px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/30 transition-colors"
              >
                Ver detalle →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
