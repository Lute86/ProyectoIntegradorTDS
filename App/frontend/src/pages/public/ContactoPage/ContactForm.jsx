import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import clsx from 'clsx'

const schema = z.object({
  nombre: z.string().min(2, 'Minimo 2 caracteres'),
  email: z.string().email('Email invalido'),
  asunto: z.string().min(1, 'Seleccione un asunto'),
  mensaje: z.string().min(10, 'Minimo 10 caracteres'),
})

const asuntos = [
  'Consulta general',
  'Inscripciones',
  'Informacion de carreras',
  'Becas',
  'Otro',
]

export default function ContactForm({ onSubmit, isLoading }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmitWrapper = async (data) => {
    await onSubmit(data)
    reset()
  }

  const inputClass = (hasError) =>
    clsx(
      'w-full px-4 py-2.5 border-2 rounded-lg text-sm transition-colors outline-none bg-white dark:bg-white/5 dark:text-white',
      hasError ? 'border-red-400' : 'border-blue-200 dark:border-blue-400/30 focus:border-blue-500 dark:focus:border-blue-400',
    )

  return (
    <form onSubmit={handleSubmit(onSubmitWrapper)} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold mb-1.5 text-body dark:text-white/90">Nombre completo</label>
        <input
          type="text" {...register('nombre')} placeholder="Tu nombre"
          className={inputClass(!!errors.nombre)}
        />
        {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5 text-body dark:text-white/90">Email</label>
        <input
          type="email" {...register('email')} placeholder="tu@email.com"
          className={inputClass(!!errors.email)}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5 text-body dark:text-white/90">Asunto</label>
        <select {...register('asunto')}
          className={inputClass(!!errors.asunto)}
        >
          <option value="">Seleccione un asunto</option>
          {asuntos.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        {errors.asunto && <p className="text-red-500 text-xs mt-1">{errors.asunto.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5 text-body dark:text-white/90">Mensaje</label>
        <textarea rows="5" {...register('mensaje')} placeholder="Escribi tu mensaje..."
          className={clsx(inputClass(!!errors.mensaje), 'resize-vertical')}
        />
        {errors.mensaje && <p className="text-red-500 text-xs mt-1">{errors.mensaje.message}</p>}
      </div>

      <button type="submit" disabled={isLoading}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:brightness-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Enviando...' : 'Enviar mensaje'}
      </button>
    </form>
  )
}
