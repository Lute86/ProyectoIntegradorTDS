import { Link } from 'react-router-dom'

const LINKS = [
  { label: 'Biblioteca Digital', href: '#', icon: '📚' },
  { label: 'Becas y Beneficios', href: '#', icon: '💰' },
  { label: 'Reglamento Estudiantil', href: '#', icon: '📋' },
  { label: 'Soporte Tecnico', href: '#', icon: '🆘' },
  { label: 'Bolsa de Trabajo', href: '#', icon: '💼' },
  { label: 'Contacto Secretaria', href: '/contacto', icon: '📞' },
]

export default function QuickLinks() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
      {LINKS.map((link) => (
        <Link key={link.label} to={link.href}
          className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:bg-blue-600 hover:text-white transition-all group"
        >
          <span className="text-2xl group-hover:scale-110 transition-transform">{link.icon}</span>
          <span className="font-medium text-sm group-hover:text-white">{link.label}</span>
        </Link>
      ))}
    </div>
  )
}
