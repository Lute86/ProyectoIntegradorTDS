const COLORES = {
  Inscripciones: 'text-blue-700',
  Examenes: 'text-emerald-700',
  Evento: 'text-amber-700',
  Tecnologia: 'text-purple-700',
  Becas: 'text-rose-700',
}

const NORMALIZAR = {
  Inscripciones: 'Inscripciones',
  Examenes: 'Examenes',
  'Exámenes': 'Examenes',
  Evento: 'Evento',
  Eventos: 'Evento',
  Tecnologia: 'Tecnologia',
  'Tecnología': 'Tecnologia',
  Becas: 'Becas',
}

export function getColorCategoria(categoria) {
  const key = NORMALIZAR[categoria]
  return COLORES[key] || 'text-gray-500'
}

export function normalizarCategoria(categoria) {
  return NORMALIZAR[categoria] || categoria
}
