export async function up(queryInterface, Sequelize) {
  const slug = 'desarrollo-de-software-a-distancia';
  const [existing] = await queryInterface.sequelize.query(
    'SELECT COUNT(*) as count FROM carreras WHERE slug = ?',
    { replacements: [slug], type: Sequelize.QueryTypes.SELECT }
  );
  if (existing.count === 0) {
    await queryInterface.bulkInsert('carreras', [
      {
        nombre: 'Desarrollo de Software (a distancia)',
        slug,
        descripcion: 'Carrera técnica en desarrollo de software con modalidad virtual',
        duracion: 3,
        modalidad: 'virtual',
        icono: null,
        color: '#3B82F6',
        activa: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  }
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('carreras', { slug: 'desarrollo-de-software-a-distancia' }, {});
}
