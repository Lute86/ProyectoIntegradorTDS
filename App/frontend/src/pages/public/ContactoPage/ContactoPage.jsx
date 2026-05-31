import { useState } from 'react'
import ContactForm from './ContactForm'

const infoCards = [
  { icon: '📍', title: 'Direccion', text: 'Buenos Aires, Argentina' },
  { icon: '📧', title: 'Email', text: 'dfts.ifts29@bue.edu.ar' },
  { icon: '📞', title: 'Telefono', text: '(011) 1234-5678' },
  { icon: '🕐', title: 'Horario de Atencion', text: 'Lunes a Viernes: 17:00 - 22:00' },
]

export default function ContactoPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setIsLoading(false)
  }

  return (
    <div className="bg-slate-50">
      <div className="bg-gradient-to-br from-slate-900 to-blue-700 text-white">
        <div className="max-w-content mx-auto px-4 py-12 md:py-16 text-center">
          <h1 className="text-h1 mb-3">Contacto</h1>
          <p className="text-blue-200 text-lg">Estamos para ayudarte</p>
        </div>
      </div>

      <div className="max-w-content mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Envia tu consulta</h2>
            <ContactForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>

          <div className="space-y-4">
            {infoCards.map((card) => (
              <div key={card.title}
                className="bg-white rounded-xl shadow-sm p-5 flex gap-4 items-start border border-slate-100"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-xl shrink-0">
                  {card.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{card.title}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">{card.text}</p>
                </div>
              </div>
            ))}
            <div className="h-64 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
              <iframe
                src="https://www.google.com/maps?q=-34.602693,-58.371193&output=embed&z=16"
                width="100%"
                height="100%"
                className="w-full h-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicacion IFTS 29"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
