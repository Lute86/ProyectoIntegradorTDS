import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '../../ui/Input/Input'
import Textarea from '../../ui/Textarea/Textarea'
import Select from '../../ui/Select/Select'

const contactSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email invalido'),
  asunto: z.string().min(1, 'Selecciona un asunto'),
  mensaje: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
})

const ASUNTOS = [
  { value: 'consulta', label: 'Consulta general' },
  { value: 'inscripciones', label: 'Inscripciones' },
  { value: 'carreras', label: 'Informacion de carreras' },
  { value: 'becas', label: 'Becas' },
  { value: 'otro', label: 'Otro' },
]

export default function ContactForm() {
  const [enviado, setEnviado] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async () => {
    // Simula envio (backend no disponible aun)
    await new Promise((r) => setTimeout(r, 1000))
    setEnviado(true)
    reset()
  }

  if (enviado) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Mensaje enviado</h3>
        <p className="text-slate-500 mb-6">Gracias por contactarte. Te responderemos a la brevedad.</p>
        <button onClick={() => setEnviado(false)}
          className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >Enviar otro mensaje</button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Envia tu consulta</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Nombre completo"
          placeholder="Tu nombre"
          error={errors.nombre?.message}
          {...register('nombre')}
        />
        <Input
          label="Email"
          type="email"
          placeholder="tu@email.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Select
          label="Asunto"
          placeholder="Selecciona un asunto"
          options={ASUNTOS}
          error={errors.asunto?.message}
          {...register('asunto')}
        />
        <Textarea
          label="Mensaje"
          placeholder="Escribi tu mensaje..."
          rows={5}
          error={errors.mensaje?.message}
          {...register('mensaje')}
        />
        <button type="submit" disabled={isSubmitting}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
        </button>
      </form>
    </div>
  )
}
