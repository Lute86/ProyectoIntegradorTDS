const LINKS = [
  { icon: '📚', label: 'Biblioteca Digital', href: 'http://www.bibliotecadigital.gob.ar/' },
  { icon: '💰', label: 'Becas y Beneficios', href: 'https://www.argentina.gob.ar/educacion/progresar' },
  { icon: '📋', label: 'Reglamento Estudiantil', href: '#' },
  { icon: '🆘', label: 'Soporte Tecnico', href: '#' },
  { icon: '💼', label: 'Bolsa de Trabajo', href: '#' },
  { icon: '📞', label: 'Contacto Secretaria', href: '/contacto' },
]

export default function QuickLinks({ links = LINKS }) {
  if (links.length === 0) return null

  return (
    <div>
      <div className="text-center mb-6">
        <span className="inline-block px-4 py-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] dark:bg-white/10 dark:text-blue-300 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
          Recursos
        </span>
        <h2 className="text-2xl font-bold text-body dark:text-white">Enlaces Utiles</h2>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {links.map((link) => (
          <a
            key={link.label} href={link.href}
            className="flex items-center gap-4 px-5 py-4 bg-white dark:bg-white/10 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-white/20 shadow-sm transition-all hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white group"
          >
            <span className="text-2xl">{link.icon}</span>
            <span className="text-base font-medium text-body dark:text-white/80 group-hover:text-white">{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
