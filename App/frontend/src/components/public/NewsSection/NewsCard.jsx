import Badge from '../../ui/Badge/Badge'
import IconoCategoria from '../../ui/IconoCategoria/IconoCategoria'

const badgeMap = {
  Inscripciones: 'blue',
  Examenes: 'green',
  Evento: 'amber',
  Tecnologia: 'purple',
  Becas: 'rose',
}

// Gradientes decorativos por categoria (sin imagenes reales: el header se genera con color + icono)
const gradientMap = {
  Inscripciones: 'from-blue-500 to-blue-700',
  Examenes: 'from-emerald-500 to-emerald-700',
  Evento: 'from-amber-500 to-orange-600',
  Tecnologia: 'from-violet-500 to-purple-700',
  Becas: 'from-rose-500 to-pink-700',
}

const cardClass = 'group flex flex-col h-full bg-white dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-white/20 shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300'

export default function NewsCard({ noticia, onVerDetalle }) {
  const { titulo, categoria, resumen, fecha } = noticia

  const Comp = onVerDetalle ? 'div' : 'a'
  const extraProps = onVerDetalle
    ? { onClick: () => onVerDetalle(noticia), className: `${cardClass} cursor-pointer` }
    : { href: `/noticias/${noticia.slug}`, className: cardClass }

  return (
    <Comp {...extraProps}>
      {/* Banda decorativa con gradiente + icono de categoria */}
      <div className={`relative h-24 flex items-center justify-center overflow-hidden bg-gradient-to-br ${gradientMap[categoria] || 'from-slate-500 to-slate-700'}`}>
        <div className="absolute -right-5 -top-6 w-24 h-24 rounded-full bg-white/15 blur-md" />
        <IconoCategoria
          categoria={categoria}
          selected
          className="relative w-10 h-10 opacity-90 drop-shadow-md group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge variant={badgeMap[categoria] || 'gray'} className="bg-white/90 dark:bg-white/90 backdrop-blur-sm shadow-sm">
            {categoria}
          </Badge>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-lg font-bold text-body dark:text-white mb-2 line-clamp-2">{titulo}</h3>
        <p className="text-sm text-body/70 dark:text-white/70 mb-4 line-clamp-2 flex-1">{resumen}</p>
        <div className="flex items-center justify-between text-xs text-body/50 dark:text-white/50">
          <span>{fecha}</span>
          <span className="text-blue-600 dark:text-blue-400 font-semibold inline-flex items-center gap-1">
            Leer más <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
        </div>
      </div>
    </Comp>
  )
}
