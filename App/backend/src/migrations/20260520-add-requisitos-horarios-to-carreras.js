export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('carreras', 'requisitos', {
    type: Sequelize.TEXT,
    allowNull: true,
  })

  await queryInterface.addColumn('carreras', 'horarios', {
    type: Sequelize.TEXT,
    allowNull: true,
  })

  await queryInterface.sequelize.query(
    `UPDATE carreras SET modalidad = 'virtual' WHERE slug = 'desarrollo-de-software'`
  )

  await queryInterface.sequelize.query(
    `UPDATE carreras SET modalidad = 'hibrida' WHERE slug = 'analisis-de-datos'`
  )
}

export async function down(queryInterface) {
  await queryInterface.removeColumn('carreras', 'requisitos')
  await queryInterface.removeColumn('carreras', 'horarios')
}
