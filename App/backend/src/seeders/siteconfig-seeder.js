export async function up(queryInterface, Sequelize) {
  const [existing] = await queryInterface.sequelize.query(
    'SELECT COUNT(*) as count FROM site_config',
    { type: Sequelize.QueryTypes.SELECT }
  );

  if (existing.count === 0) {
    await queryInterface.bulkInsert('site_config', [
      {
        site_name: 'IFTS 29',
        site_subtitle: 'Nueva Web',
        contact_email: 'contacto@ifts29.edu.ar',
        contact_phone: '+54 11 1234-5678',
        address: 'Buenos Aires, Argentina',
        seo_description: 'Instituto de Formación Técnico Superior 29',
        footer_text: '© 2026 IFTS 29 - Todos los derechos reservados',
        colors: JSON.stringify({
          primary: '#3B82F6',
          secondary: '#10B981',
          accent: '#F59E0B',
        }),
        layout: JSON.stringify({
          header: 'default',
          sidebar: true,
        }),
        sections: JSON.stringify([
          { name: 'hero', enabled: true },
          { name: 'about', enabled: true },
          { name: 'courses', enabled: true },
        ]),
        typography: JSON.stringify({
          fontFamily: 'Inter',
          fontSize: '16px',
        }),
        theme_preset: 'default',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  }
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('site_config', null, {});
}
