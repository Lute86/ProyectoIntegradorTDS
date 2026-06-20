export async function up(queryInterface, Sequelize) {
  const testimonios = [
    {
      autor_nombre: 'Maria Gonzalez',
      autor_carrera: 'Desarrollo de Software',
      texto: 'El IFTS 29 me brindo las herramientas necesarias para insertarme en el mundo laboral. Los profesores son excelentes y la formacion es de alta calidad.',
      visible: true,
    },
    {
      autor_nombre: 'Carlos Perez',
      autor_carrera: 'Administracion de Empresas',
      texto: 'Cursar en el IFTS 29 fue una experiencia transformadora. La modalidad virtual me permitio estudiar mientras trabajaba. Altamente recomendable.',
      visible: true,
    },
    {
      autor_nombre: 'Lucia Martinez',
      autor_carrera: 'Diseno Grafico',
      texto: 'La infraestructura y los recursos tecnologicos son de primer nivel. Me siento preparada para enfrentar los desafios profesionales gracias a la formacion recibida.',
      visible: true,
    },
    {
      autor_nombre: 'Juan Romero',
      autor_carrera: 'Desarrollo de Software',
      texto: 'Gracias al IFTS 29 consegui mi primer empleo en tecnologia antes de terminar la carrera. La bolsa de trabajo y los convenios con empresas son un gran plus.',
      visible: false,
    },
  ];

  for (const testimonio of testimonios) {
    const [existing] = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM testimonios WHERE autor_nombre = ? AND texto = ?',
      { replacements: [testimonio.autor_nombre, testimonio.texto], type: Sequelize.QueryTypes.SELECT },
    );

    if (Number(existing.count) === 0) {
      await queryInterface.bulkInsert('testimonios', [
        {
          ...testimonio,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
  }
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('testimonios', {
    autor_nombre: ['Maria Gonzalez', 'Carlos Perez', 'Lucia Martinez', 'Juan Romero'],
  }, {});
}
