import { Link } from 'react-router-dom'
import NewsCard from './NewsCard'

export default function NewsSection({ noticias }) {
  if (!noticias || noticias.length === 0) return null

  const ultimas = noticias.slice(0, 3)

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Ultimas Noticias</h2>
          <p className="text-slate-500 mt-2">Mantenete informado sobre las novedades del instituto</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ultimas.map((n) => (
            <NewsCard key={n.id} noticia={n} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            to="/noticias"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver todas las noticias
          </Link>
        </div>
      </div>
    </section>
  )
}
