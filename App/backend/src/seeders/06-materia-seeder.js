export async function up(queryInterface, Sequelize) {
  const [existingCount] = await queryInterface.sequelize.query(
    'SELECT COUNT(*) as count FROM materias'
  );

  if (existingCount[0].count > 0) {
    return;
  }

  const now = new Date();

  const materias = [
    { nombre: 'Programacion I', descripcion: 'Fundamentos de programacion', createdAt: now, updatedAt: now },
    { nombre: 'Matematica', descripcion: 'Matematica general', createdAt: now, updatedAt: now },
    { nombre: 'Ingles Tecnico I', descripcion: 'Ingles tecnico para informatica', createdAt: now, updatedAt: now },
    { nombre: 'Introduccion a la Informatica', descripcion: 'Introduccion a las ciencias de la computacion', createdAt: now, updatedAt: now },
    { nombre: 'Programacion II', descripcion: 'Programacion orientada a objetos', createdAt: now, updatedAt: now },
    { nombre: 'Bases de Datos I', descripcion: 'Modelado y consultas SQL', createdAt: now, updatedAt: now },
    { nombre: 'Ingles Tecnico II', descripcion: 'Ingles tecnico avanzado', createdAt: now, updatedAt: now },
    { nombre: 'Logica Computacional', descripcion: 'Logica y teoria de la computacion', createdAt: now, updatedAt: now },
    { nombre: 'Desarrollo Web', descripcion: 'Desarrollo de aplicaciones web', createdAt: now, updatedAt: now },
    { nombre: 'Bases de Datos II', descripcion: 'Bases de datos avanzadas', createdAt: now, updatedAt: now },
    { nombre: 'Ingenieria de Software I', descripcion: 'Metodologias de desarrollo', createdAt: now, updatedAt: now },
    { nombre: 'Estadistica', descripcion: 'Estadistica aplicada', createdAt: now, updatedAt: now },
    { nombre: 'Desarrollo Movil', descripcion: 'Desarrollo de apps moviles', createdAt: now, updatedAt: now },
    { nombre: 'Ingenieria de Software II', descripcion: 'Gestion de proyectos de software', createdAt: now, updatedAt: now },
    { nombre: 'Practica Profesionalizante', descripcion: 'Practica en empresa', createdAt: now, updatedAt: now },
    { nombre: 'Etica Profesional', descripcion: 'Etica en el ejercicio profesional', createdAt: now, updatedAt: now },
  ];

  await queryInterface.bulkInsert('materias', materias);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('materias', {}, {});
}
