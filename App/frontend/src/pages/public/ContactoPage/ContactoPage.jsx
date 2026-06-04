import { useState } from 'react'
import api from '../../../services/api'
import ContactForm from './ContactForm'
import { useSiteConfigStore } from '../../../stores/siteConfigStore'

import contacBg from '../../../assets/fonts/contac.png'

export default function ContactoPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const { config } = useSiteConfigStore()

  const infoCards = [
    { icon: '📍', title: 'Direccion', text: config.address || 'Buenos Aires, Argentina' },
    { icon: '📧', title: 'Email', text: config.contactEmail || 'dfts.ifts29@bue.edu.ar' },
    { icon: '📞', title: 'Telefono', text: config.contactPhone || '(011) 1234-5678' },
    { icon: '🕐', title: 'Horario de Atencion', text: 'Lunes a Viernes: 17:00 - 22:00' },
  ]

  const handleSubmit = async (data) => {
    setIsLoading(true)
    setError('')
    setSuccess(false)
    try {
      await api.post('/consultas', data)
      setSuccess(true)
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al enviar la consulta'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ backgroundColor: 'var(--clr-bg)' }}>
      <div
        className="text-white bg-cover bg-center"
        style={{ backgroundImage: `url(${contacBg})` }}
      >
        <div className="max-w-content mx-auto px-4 py-12 md:py-16 text-center" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <h1 className="text-h1 mb-3" style={{ color: '#fff' }}>Contacto</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)' }} className="text-lg">Estamos para ayudarte</p>
        </div>
      </div>

      <div className="max-w-content mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-xl shadow-sm p-6 md:p-8 border" style={{ backgroundColor: '#fff', borderColor: 'var(--clr-primary)' }}>
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--clr-text)' }}>Envia tu consulta</h2>
            <ContactForm onSubmit={handleSubmit} isLoading={isLoading} />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {success && <p className="text-green-600 text-sm mt-2">Consulta enviada exitosamente</p>}
          </div>

          <div className="space-y-4">
            {infoCards.map((card) => (
              <div key={card.title}
                className="rounded-xl shadow-sm p-5 flex gap-4 items-start border" style={{ backgroundColor: '#fff', borderColor: 'var(--clr-primary)' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ backgroundColor: 'var(--clr-primary)' }}>
                  {card.icon}
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--clr-text)' }}>{card.title}</h3>
                  <p className="text-sm mt-0.5" style={{ color: 'rgba(0,0,0,0.5)' }}>{card.text}</p>
                </div>
              </div>
            ))}
            <div className="h-64 rounded-xl overflow-hidden border shadow-sm" style={{ borderColor: 'var(--clr-primary)' }}>
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
