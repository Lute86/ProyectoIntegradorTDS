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
      <h2 className="text-2xl font-bold text-center text-slate-900 mb-6">Enlaces Utiles</h2>
      <div className="grid grid-cols-3 gap-4">
        {links.map((link) => (
          <a
            key={link.label} href={link.href}
            className="flex items-center gap-4 px-5 py-4 bg-white rounded-lg shadow-sm border border-slate-100 transition-all hover:bg-blue-600 hover:text-white group"
          >
            <span className="text-2xl">{link.icon}</span>
            <span className="text-base font-medium text-slate-700 group-hover:text-white">{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
