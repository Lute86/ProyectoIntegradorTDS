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
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-1.5">Nombre completo</label>
        <input
          type="text" {...register('nombre')} placeholder="Tu nombre"
          className={clsx('w-full px-4 py-2.5 border-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors',
            errors.nombre ? 'border-red-400' : 'border-slate-300',
          )}
        />
        {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-1.5">Email</label>
        <input
          type="email" {...register('email')} placeholder="tu@email.com"
          className={clsx('w-full px-4 py-2.5 border-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors',
            errors.email ? 'border-red-400' : 'border-slate-300',
          )}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-1.5">Asunto</label>
        <select {...register('asunto')}
          className={clsx('w-full px-4 py-2.5 border-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors',
            errors.asunto ? 'border-red-400' : 'border-slate-300',
          )}
        >
          <option value="">Seleccione un asunto</option>
          {asuntos.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        {errors.asunto && <p className="text-red-500 text-xs mt-1">{errors.asunto.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-1.5">Mensaje</label>
        <textarea rows="5" {...register('mensaje')} placeholder="Escribi tu mensaje..."
          className={clsx('w-full px-4 py-2.5 border-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-vertical',
            errors.mensaje ? 'border-red-400' : 'border-slate-300',
          )}
        />
        {errors.mensaje && <p className="text-red-500 text-xs mt-1">{errors.mensaje.message}</p>}
      </div>

      <button type="submit" disabled={isLoading}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Enviando...' : 'Enviar mensaje'}
      </button>
    </form>
  )
}
