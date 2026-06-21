import { useState } from 'react'
import api from '../../../services/api'
import ContactForm from './ContactForm'
import { useSiteConfigStore } from '../../../stores/siteConfigStore'
import PageHero from '../../../components/public/PageHero/PageHero'

import contacBg from '../../../assets/fonts/contac.png'

export default function ContactoPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const { config } = useSiteConfigStore()
  const layout = useSiteConfigStore((s) => s.config.layout)

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
    <div className="dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-700 dark:to-slate-500 bg-slate-100">
      <div className={layout === 'boxed' ? 'max-w-[1280px] mx-auto' : ''}>
      <PageHero
        eyebrow="Estamos en contacto"
        title="Contacto"
        subtitle="Estamos para ayudarte"
        image={contacBg}
      />

      <div className={`${layout === 'boxed' ? '' : 'max-w-content'} mx-auto px-4 py-8`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-white/20 shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6 text-body dark:text-white">Envia tu consulta</h2>
            <ContactForm onSubmit={handleSubmit} isLoading={isLoading} />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {success && <p className="text-green-600 text-sm mt-2">Consulta enviada exitosamente</p>}
          </div>

          <div className="space-y-4">
            {infoCards.map((card) => (
              <div key={card.title}
                className="bg-white dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-white/20 shadow-sm p-5 flex gap-4 items-start"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 bg-blue-100 dark:bg-blue-500/20">
                  {card.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-body dark:text-white">{card.title}</h3>
                  <p className="text-sm mt-0.5 text-body/70 dark:text-white/50">{card.text}</p>
                </div>
              </div>
            ))}
            <div className="h-64 rounded-xl overflow-hidden border border-gray-200 dark:border-white/20 shadow-sm">
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
    </div>
  )
}
