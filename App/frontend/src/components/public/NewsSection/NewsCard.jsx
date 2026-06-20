import Badge from '../../ui/Badge/Badge'
import IconoCategoria from '../../ui/IconoCategoria/IconoCategoria'

const badgeMap = {
  Inscripciones: 'blue',
  Examenes: 'green',
  Evento: 'amber',
  Tecnologia: 'purple',
  Becas: 'rose',
}

export default function NewsCard({ noticia, onVerDetalle }) {
  const { titulo, categoria, resumen, fecha } = noticia

  const Comp = onVerDetalle ? 'div' : 'a'
  const extraProps = onVerDetalle
    ? { onClick: () => onVerDetalle(noticia), className: 'block bg-white dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-white/20 shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer' }
    : { href: `/noticias/${noticia.slug}`, className: 'block bg-white dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-white/20 shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300' }

  return (
    <Comp {...extraProps}>
      <div className="p-6">
        <Badge variant={badgeMap[categoria] || 'gray'}>
          <IconoCategoria categoria={categoria} className="w-3.5 h-3.5 mr-1" />
          {categoria}
        </Badge>
        <h3 className="text-lg font-bold text-body dark:text-white mt-3 mb-2 line-clamp-2">{titulo}</h3>
        <p className="text-sm text-body/70 dark:text-white/70 mb-4 line-clamp-2">{resumen}</p>
        <div className="flex items-center justify-between text-xs text-body/50 dark:text-white/50">
          <span>{fecha}</span>
          <span className="text-blue-600 dark:text-blue-400 font-semibold">Leer más →</span>
        </div>
      </div>
    </Comp>
  )
}
