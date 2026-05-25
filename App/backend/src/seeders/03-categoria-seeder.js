export async function up(queryInterface, Sequelize) {
  const categorias = [
    { nombre: 'Inscripciones', slug: 'inscripciones', color: '#3B82F6' },
    { nombre: 'Exámenes', slug: 'examenes', color: '#EF4444' },
    { nombre: 'Eventos', slug: 'eventos', color: '#10B981' },
    { nombre: 'Tecnología', slug: 'tecnologia', color: '#8B5CF6' },
    { nombre: 'Becas', slug: 'becas', color: '#F59E0B' },
  ];

  for (const cat of categorias) {
    const [existing] = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM categorias WHERE slug = ?',
      { replacements: [cat.slug], type: Sequelize.QueryTypes.SELECT },
    );

    if (existing.count === 0) {
      await queryInterface.bulkInsert('categorias', [
        {
          ...cat,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
  }
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('categorias', {
    slug: ['inscripciones', 'examenes', 'eventos', 'tecnologia', 'becas'],
  }, {});
}
