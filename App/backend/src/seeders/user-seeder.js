import bcrypt from 'bcryptjs';

export async function up(queryInterface, Sequelize) {
  const email = 'admin@ifts29.edu.ar';
  const [existing] = await queryInterface.sequelize.query(
    'SELECT COUNT(*) as count FROM users WHERE email = ?',
    { replacements: [email], type: Sequelize.QueryTypes.SELECT }
  );
  if (existing.count === 0) {
    const passwordHash = await bcrypt.hash('admin1234', 10);
    await queryInterface.bulkInsert('users', [
      {
        nombre: 'Admin',
        apellido: 'IFTS29',
        email,
        password_hash: passwordHash,
        rol: 'admin',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  }
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('users', { email: 'admin@ifts29.edu.ar' }, {});
}
