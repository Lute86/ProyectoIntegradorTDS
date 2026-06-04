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
      'w-full px-4 py-2.5 border-2 rounded-lg text-sm transition-colors outline-none',
      hasError ? 'border-red-400' : '',
    )

  const focusStyle = {
    boxShadow: '0 0 0 2px var(--clr-primary)',
  }

  return (
    <form onSubmit={handleSubmit(onSubmitWrapper)} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--clr-text)' }}>Nombre completo</label>
        <input
          type="text" {...register('nombre')} placeholder="Tu nombre"
          className={inputClass(!!errors.nombre)}
          style={{ borderColor: errors.nombre ? undefined : 'var(--clr-primary)' }}
          onFocus={(e) => { if (!errors.nombre) Object.assign(e.target.style, focusStyle) }}
          onBlur={(e) => { if (!errors.nombre) e.target.style.boxShadow = 'none' }}
        />
        {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--clr-text)' }}>Email</label>
        <input
          type="email" {...register('email')} placeholder="tu@email.com"
          className={inputClass(!!errors.email)}
          style={{ borderColor: errors.email ? undefined : 'var(--clr-primary)' }}
          onFocus={(e) => { if (!errors.email) Object.assign(e.target.style, focusStyle) }}
          onBlur={(e) => { if (!errors.email) e.target.style.boxShadow = 'none' }}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--clr-text)' }}>Asunto</label>
        <select {...register('asunto')}
          className={inputClass(!!errors.asunto)}
          style={{ borderColor: errors.asunto ? undefined : 'var(--clr-primary)' }}
          onFocus={(e) => { if (!errors.asunto) Object.assign(e.target.style, focusStyle) }}
          onBlur={(e) => { if (!errors.asunto) e.target.style.boxShadow = 'none' }}
        >
          <option value="">Seleccione un asunto</option>
          {asuntos.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        {errors.asunto && <p className="text-red-500 text-xs mt-1">{errors.asunto.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--clr-text)' }}>Mensaje</label>
        <textarea rows="5" {...register('mensaje')} placeholder="Escribi tu mensaje..."
          className={clsx(inputClass(!!errors.mensaje), 'resize-vertical')}
          style={{ borderColor: errors.mensaje ? undefined : 'var(--clr-primary)' }}
          onFocus={(e) => { if (!errors.mensaje) Object.assign(e.target.style, focusStyle) }}
          onBlur={(e) => { if (!errors.mensaje) e.target.style.boxShadow = 'none' }}
        />
        {errors.mensaje && <p className="text-red-500 text-xs mt-1">{errors.mensaje.message}</p>}
      </div>

      <button type="submit" disabled={isLoading}
        className="w-full py-3 text-white rounded-lg font-semibold disabled:brightness-50 disabled:cursor-not-allowed transition-colors"
        style={{ backgroundColor: 'var(--clr-primary)' }}
      >
        {isLoading ? 'Enviando...' : 'Enviar mensaje'}
      </button>
    </form>
  )
}
