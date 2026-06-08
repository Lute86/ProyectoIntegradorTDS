import bcrypt from 'bcryptjs';

export async function up(queryInterface, Sequelize) {
  const users = [
    { email: 'admin@ifts29.edu.ar', nombre: 'Admin', rol: 'admin', password: 'admin1234' },
    { email: 'profesor@ifts29.edu.ar', nombre: 'Profesor', rol: 'profesor', password: 'profesor123' },
    { email: 'tutor@ifts29.edu.ar', nombre: 'Tutor', rol: 'tutor', password: 'tutor123' },
  ];

  for (const user of users) {
    const [existing] = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM users WHERE email = ?',
      { replacements: [user.email], type: Sequelize.QueryTypes.SELECT }
    );

    if (Number(existing.count) === 0) {
      const passwordHash = await bcrypt.hash(user.password, 10);
      await queryInterface.bulkInsert('users', [
        {
          nombre: user.nombre,
          apellido: 'IFTS29',
          email: user.email,
          password_hash: passwordHash,
          rol: user.rol,
          activo: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
  }
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('users', {
    email: ['admin@ifts29.edu.ar', 'profesor@ifts29.edu.ar', 'tutor@ifts29.edu.ar']
  }, {});
}
