export async function up(queryInterface, Sequelize) {
  // Elimina el duplicado viejo "Desarrollo de Software (a distancia)"
  await queryInterface.sequelize.query(
    `DELETE FROM materias WHERE carrera_id IN (SELECT id FROM carreras WHERE slug = 'desarrollo-de-software-a-distancia')`
  )
  await queryInterface.sequelize.query(
    `DELETE FROM carreras WHERE slug = 'desarrollo-de-software-a-distancia'`
  )

  const slugs = ['desarrollo-de-software', 'seguridad-informatica', 'analisis-de-datos']

  const existingRows = await queryInterface.sequelize.query(
    `SELECT slug FROM carreras WHERE slug IN (:slugs)`,
    { replacements: { slugs }, type: Sequelize.QueryTypes.SELECT }
  )

  const existingSlugs = (existingRows || []).map((r) => r.slug)

  const carrerasData = []

  const REQS = [
    'Titulo secundario completo',
    'DNI original y copia',
    'Certificado de estudios secundarios',
    'Partida de nacimiento',
    '2 fotos 4x4',
    'Constancia de CUIL',
  ]

  const HORARIOS_DS = [
    { dia: 'Lunes', horario: '18:00 - 22:00', aula: 'Aula 5' },
    { dia: 'Miercoles', horario: '18:00 - 22:00', aula: 'Aula 5' },
    { dia: 'Viernes', horario: '18:00 - 22:00', aula: 'Lab. Computacion' },
  ]

  const HORARIOS_SI = [
    { dia: 'Martes', horario: '18:00 - 22:00', aula: 'Aula 7' },
    { dia: 'Jueves', horario: '18:00 - 22:00', aula: 'Aula 7' },
    { dia: 'Sabado', horario: '09:00 - 13:00', aula: 'Lab. Redes' },
  ]

  const HORARIOS_AD = [
    { dia: 'Lunes', horario: '18:00 - 22:00', aula: 'Aula 3' },
    { dia: 'Miercoles', horario: '18:00 - 22:00', aula: 'Lab. Computacion' },
    { dia: 'Viernes', horario: '18:00 - 21:00', aula: 'Aula 3' },
  ]

  if (!existingSlugs.includes('desarrollo-de-software')) {
    carrerasData.push({
      nombre: 'Desarrollo de Software',
      slug: 'desarrollo-de-software',
      descripcion: 'La Tecnicatura en Desarrollo de Software forma profesionales capaces de analizar, disenar, desarrollar e implementar soluciones de software utilizando las tecnologias y metodologias mas actuales del mercado.',
      duracion: 2,
      modalidad: 'virtual',
      requisitos: JSON.stringify(REQS),
      horarios: JSON.stringify(HORARIOS_DS),
      icono: 'DS',
      color: 'from-blue-500 to-blue-700',
      activa: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  if (!existingSlugs.includes('seguridad-informatica')) {
    carrerasData.push({
      nombre: 'Seguridad Informatica',
      slug: 'seguridad-informatica',
      descripcion: 'La Tecnicatura en Seguridad Informatica forma profesionales capaces de proteger sistemas, redes y datos contra amenazas y ataques ciberneticos.',
      duracion: 2,
      modalidad: 'presencial',
      requisitos: JSON.stringify(REQS),
      horarios: JSON.stringify(HORARIOS_SI),
      icono: 'SI',
      color: 'from-emerald-500 to-emerald-700',
      activa: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  if (!existingSlugs.includes('analisis-de-datos')) {
    carrerasData.push({
      nombre: 'Analisis de Datos',
      slug: 'analisis-de-datos',
      descripcion: 'La Tecnicatura en Analisis de Datos forma profesionales capacitados para recolectar, procesar, analizar y visualizar grandes volumenes de datos.',
      duracion: 2,
      modalidad: 'hibrida',
      requisitos: JSON.stringify(REQS),
      horarios: JSON.stringify(HORARIOS_AD),
      icono: 'AD',
      color: 'from-amber-500 to-amber-700',
      activa: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  if (carrerasData.length === 0) return

  await queryInterface.bulkInsert('carreras', carrerasData)

  const inserted = await queryInterface.sequelize.query(
    `SELECT id, slug FROM carreras WHERE slug IN (:slugs)`,
    { replacements: { slugs: carrerasData.map((c) => c.slug) }, type: Sequelize.QueryTypes.SELECT }
  )

  const carrerasMap = {}
  ;(inserted || []).forEach((c) => { carrerasMap[c.slug] = c.id })

  const materiasPorCarrera = {
    'desarrollo-de-software': [
      { nombre: 'Programacion I', cuatrimestre: 1, carga_horaria_semanal: 6 },
      { nombre: 'Matematica', cuatrimestre: 1, carga_horaria_semanal: 4 },
      { nombre: 'Ingles Tecnico I', cuatrimestre: 1, carga_horaria_semanal: 3 },
      { nombre: 'Introduccion a la Informatica', cuatrimestre: 1, carga_horaria_semanal: 3 },
      { nombre: 'Programacion II', cuatrimestre: 2, carga_horaria_semanal: 6 },
      { nombre: 'Bases de Datos I', cuatrimestre: 2, carga_horaria_semanal: 4 },
      { nombre: 'Ingles Tecnico II', cuatrimestre: 2, carga_horaria_semanal: 3 },
      { nombre: 'Logica Computacional', cuatrimestre: 2, carga_horaria_semanal: 3 },
      { nombre: 'Desarrollo Web', cuatrimestre: 3, carga_horaria_semanal: 6 },
      { nombre: 'Bases de Datos II', cuatrimestre: 3, carga_horaria_semanal: 4 },
      { nombre: 'Ingenieria de Software I', cuatrimestre: 3, carga_horaria_semanal: 4 },
      { nombre: 'Estadistica', cuatrimestre: 3, carga_horaria_semanal: 3 },
      { nombre: 'Desarrollo Movil', cuatrimestre: 4, carga_horaria_semanal: 6 },
      { nombre: 'Ingenieria de Software II', cuatrimestre: 4, carga_horaria_semanal: 4 },
      { nombre: 'Practica Profesionalizante', cuatrimestre: 4, carga_horaria_semanal: 6 },
      { nombre: 'Etica Profesional', cuatrimestre: 4, carga_horaria_semanal: 2 },
    ],
    'seguridad-informatica': [
      { nombre: 'Redes I', cuatrimestre: 1, carga_horaria_semanal: 6 },
      { nombre: 'Sistemas Operativos', cuatrimestre: 1, carga_horaria_semanal: 4 },
      { nombre: 'Programacion I', cuatrimestre: 1, carga_horaria_semanal: 4 },
      { nombre: 'Matematica Discreta', cuatrimestre: 1, carga_horaria_semanal: 3 },
      { nombre: 'Redes II', cuatrimestre: 2, carga_horaria_semanal: 6 },
      { nombre: 'Criptografia', cuatrimestre: 2, carga_horaria_semanal: 4 },
      { nombre: 'Programacion II', cuatrimestre: 2, carga_horaria_semanal: 4 },
      { nombre: 'Base de Datos', cuatrimestre: 2, carga_horaria_semanal: 3 },
      { nombre: 'Seguridad en Redes', cuatrimestre: 3, carga_horaria_semanal: 6 },
      { nombre: 'Analisis de Vulnerabilidades', cuatrimestre: 3, carga_horaria_semanal: 4 },
      { nombre: 'Legislacion Informatica', cuatrimestre: 3, carga_horaria_semanal: 3 },
      { nombre: 'Ingles Tecnico', cuatrimestre: 3, carga_horaria_semanal: 3 },
      { nombre: 'Respuesta a Incidentes', cuatrimestre: 4, carga_horaria_semanal: 6 },
      { nombre: 'Seguridad en Aplicaciones', cuatrimestre: 4, carga_horaria_semanal: 4 },
      { nombre: 'Practica Profesionalizante', cuatrimestre: 4, carga_horaria_semanal: 6 },
    ],
    'analisis-de-datos': [
      { nombre: 'Estadistica I', cuatrimestre: 1, carga_horaria_semanal: 6 },
      { nombre: 'Programacion I', cuatrimestre: 1, carga_horaria_semanal: 4 },
      { nombre: 'Matematica', cuatrimestre: 1, carga_horaria_semanal: 4 },
      { nombre: 'Introduccion a Base de Datos', cuatrimestre: 1, carga_horaria_semanal: 3 },
      { nombre: 'Estadistica II', cuatrimestre: 2, carga_horaria_semanal: 6 },
      { nombre: 'Programacion II', cuatrimestre: 2, carga_horaria_semanal: 4 },
      { nombre: 'Base de Datos Avanzada', cuatrimestre: 2, carga_horaria_semanal: 4 },
      { nombre: 'Visualizacion de Datos', cuatrimestre: 2, carga_horaria_semanal: 3 },
      { nombre: 'Machine Learning I', cuatrimestre: 3, carga_horaria_semanal: 6 },
      { nombre: 'Big Data', cuatrimestre: 3, carga_horaria_semanal: 4 },
      { nombre: 'Etica y Datos', cuatrimestre: 3, carga_horaria_semanal: 3 },
      { nombre: 'Ingles Tecnico', cuatrimestre: 3, carga_horaria_semanal: 3 },
      { nombre: 'Machine Learning II', cuatrimestre: 4, carga_horaria_semanal: 6 },
      { nombre: 'Proyecto Integrador', cuatrimestre: 4, carga_horaria_semanal: 6 },
      { nombre: 'Practica Profesionalizante', cuatrimestre: 4, carga_horaria_semanal: 4 },
    ],
  }

  const materiasToInsert = []
  Object.entries(carrerasMap).forEach(([slug, carreraId]) => {
    const materias = materiasPorCarrera[slug] || []
    materias.forEach((m) => {
      materiasToInsert.push({
        nombre: m.nombre,
        carrera_id: carreraId,
        cuatrimestre: m.cuatrimestre,
        carga_horaria_semanal: m.carga_horaria_semanal,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    })
  })

  if (materiasToInsert.length > 0) {
    await queryInterface.bulkInsert('materias', materiasToInsert)
  }
}

export async function down(queryInterface) {
  const slugs = ['desarrollo-de-software', 'seguridad-informatica', 'analisis-de-datos']

  await queryInterface.sequelize.query(
    `DELETE FROM materias WHERE carrera_id IN (SELECT id FROM carreras WHERE slug IN (:slugs))`,
    { replacements: { slugs } }
  )

  await queryInterface.sequelize.query(
    `DELETE FROM carreras WHERE slug IN (:slugs)`,
    { replacements: { slugs } }
  )
}
