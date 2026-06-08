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
          surface: '#F3F4F6',
          background: '#FFFFFF',
          text: '#111827',
        }),
        layout: JSON.stringify({
          header: 'default',
          sidebar: true,
        }),
        sections: JSON.stringify([
          { id: 'hero', visible: true, order: 1 },
          { id: 'statistics', visible: true, order: 2 },
          { id: 'careers', visible: true, order: 3 },
          { id: 'news', visible: true, order: 4 },
          { id: 'events', visible: true, order: 5 },
          { id: 'testimonials', visible: true, order: 6 },
          { id: 'gallery', visible: false, order: 7 },
        ]),
        typography: JSON.stringify({
          fontFamily: 'Inter',
          headingFont: 'Inter',
          bodyFont: 'Inter',
          fontSize: '16px',
          baseSize: '16px',
        }),
        social_links: JSON.stringify({
          instagram: '',
          facebook: '',
          tiktok:'',
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
