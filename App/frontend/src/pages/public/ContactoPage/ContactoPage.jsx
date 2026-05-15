import ContactForm from '../../../components/public/ContactForm/ContactForm'

const INFO_CARDS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    titulo: 'Direccion',
    texto: 'Buenos Aires, Argentina',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    titulo: 'Email',
    texto: 'dfts.ifts29@bue.edu.ar',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    titulo: 'Telefono',
    texto: '(011) 1234-5678',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    titulo: 'Horario de Atencion',
    texto: 'Lunes a Viernes: 17:00 - 22:00',
  },
]

export default function ContactoPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-gradient-to-br from-slate-900 to-blue-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Contacto</h1>
          <p className="text-blue-200 text-lg">Estamos para ayudarte</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ContactForm />

          <div className="space-y-4">
            {INFO_CARDS.map((card, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-5 flex gap-4 items-start">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                  {card.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{card.titulo}</h3>
                  <p className="text-sm text-slate-500">{card.texto}</p>
                </div>
              </div>
            ))}

            <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl flex items-center justify-center">
              <p className="text-slate-500 font-medium">Mapa de ubicacion</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
