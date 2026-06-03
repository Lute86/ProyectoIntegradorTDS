import clsx from 'clsx'
import { normalizarCategoria } from './categoriaUtils'

const COLORES = {
  Inscripciones: 'text-blue-700',
  Examenes: 'text-emerald-700',
  Evento: 'text-amber-700',
  Tecnologia: 'text-purple-700',
  Becas: 'text-rose-700',
}

const CATEGORIA_SLUG = {
  Inscripciones: 'inscripciones',
  Examenes: 'examenes',
  Evento: 'eventos',
  Tecnologia: 'tecnologia',
  Becas: 'becas',
}

const iconModules = import.meta.glob('../../../assets/icons/*.svg', {
  eager: true,
  query: '?raw',
})

const iconMap = {}
for (const [path, mod] of Object.entries(iconModules)) {
  const name = path.split('/').pop().replace('.svg', '')
  iconMap[name] = (mod.default || '').replace(/stroke="#[0-9A-Fa-f]+"/g, 'stroke="currentColor"')
}

export default function IconoCategoria({ categoria, className, selected }) {
  const key = normalizarCategoria(categoria)
  const slug = CATEGORIA_SLUG[key]
  const svg = slug ? iconMap[slug] : null
  if (!svg) return null

  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center shrink-0 [&_svg]:w-full [&_svg]:h-full',
        selected ? 'text-white' : COLORES[key] || 'text-gray-500',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
