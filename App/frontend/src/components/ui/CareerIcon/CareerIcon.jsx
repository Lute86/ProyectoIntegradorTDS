const iconModules = import.meta.glob('../../../assets/icons/*.svg', {
  eager: true,
  query: '?raw',
})

const iconoMap = {}
for (const [path, mod] of Object.entries(iconModules)) {
  const name = path.split('/').pop().replace('.svg', '')
  iconoMap[name] = mod.default
}

export default function CareerIcon({ name, className = 'w-10 h-10' }) {
  if (!name) return null

  const svg = iconoMap[name]
  if (!svg) return null

  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
