export async function up(queryInterface, Sequelize) {
  const tables = await queryInterface.showAllTables();
  const tableInfo = await queryInterface.describeTable('comisiones');

  // 1. Create junction table
  if (!tables.includes('comision_carrera_materias')) {
    await queryInterface.createTable('comision_carrera_materias', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      comision_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'comisiones', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      carrera_materia_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'carrera_materias', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('comision_carrera_materias',
      ['comision_id', 'carrera_materia_id'],
      { unique: true }
    );
  }

  // 2. Migrate existing data into junction table (before dropping carrera_materia_id)
  const comisiones = await queryInterface.sequelize.query(
    'SELECT id, carrera_materia_id FROM comisiones WHERE carrera_materia_id IS NOT NULL',
    { type: Sequelize.QueryTypes.SELECT }
  );

  if (comisiones.length > 0) {
    const now = new Date();
    const junctionRows = comisiones.map((c) => ({
      comision_id: c.id,
      carrera_materia_id: c.carrera_materia_id,
      createdAt: now,
      updatedAt: now,
    }));
    await queryInterface.bulkInsert('comision_carrera_materias', junctionRows);
  }

  // 3. Recreate comisiones table (SQLite-safe: avoid removeColumn/changeColumn)
  //    Drop old unique index first
  const indexes = await queryInterface.showIndex('comisiones');
  const oldUnique = indexes.find(
    (idx) => idx.unique && idx.fields.some((f) => f.attribute === 'carrera_materia_id')
  );
  if (oldUnique) {
    await queryInterface.removeIndex('comisiones', oldUnique.fields.map((f) => f.attribute));
  }

  //    Read existing data
  const dialect = queryInterface.sequelize.getDialect();
  const quote = (col) => dialect === 'postgres' ? `"${col}"` : col;
  const allComisiones = await queryInterface.sequelize.query(
    `SELECT id, nombre, anio_lectivo, semestre, encargado_id, activo, ${quote('createdAt')}, ${quote('updatedAt')}, ${quote('deletedAt')} FROM comisiones`,
    { type: Sequelize.QueryTypes.SELECT }
  );

  //    Derive carrera_id from junction or carrera_materia_id
  const comisionCmMap = {};
  for (const c of comisiones) {
    comisionCmMap[c.id] = c.carrera_materia_id;
  }

  //    Get carrera_id from carrera_materias
  const carreraIds = {};
  if (comisiones.length > 0) {
    const cmIds = [...new Set(comisiones.map((c) => c.carrera_materia_id))];
    const placeholders = cmIds.map(() => '?').join(',');
    const cms = await queryInterface.sequelize.query(
      `SELECT id, carrera_id FROM carrera_materias WHERE id IN (${placeholders})`,
      { replacements: cmIds, type: Sequelize.QueryTypes.SELECT }
    );
    for (const cm of cms) {
      carreraIds[cm.id] = cm.carrera_id;
    }
  }

  //    Drop old table and recreate with new schema
  //    PostgreSQL requires removing FK constraints before drop
  if (dialect === 'postgres') {
    await queryInterface.sequelize.query('ALTER TABLE horarios DROP CONSTRAINT IF EXISTS horarios_comision_id_fkey');
    await queryInterface.sequelize.query('ALTER TABLE comision_carrera_materias DROP CONSTRAINT IF EXISTS comision_carrera_materias_comision_id_fkey');
  }
  await queryInterface.dropTable('comisiones');

  await queryInterface.createTable('comisiones', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    carrera_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'carreras', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    nombre: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    anio_lectivo: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    semestre: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    encargado_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    activo: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    deletedAt: {
      type: Sequelize.DATE,
    },
  });

  //    Insert data with carrera_id
  const now = new Date();
  for (const c of allComisiones) {
    const cmId = comisionCmMap[c.id];
    const carreraId = cmId ? carreraIds[cmId] : null;

    const activoValue = dialect === 'postgres' ? c.activo : (c.activo ? 1 : 0);

    await queryInterface.sequelize.query(`
      INSERT INTO comisiones (id, carrera_id, nombre, anio_lectivo, semestre, encargado_id, activo, ${quote('createdAt')}, ${quote('updatedAt')}, ${quote('deletedAt')})
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, {
      replacements: [c.id, carreraId, c.nombre, c.anio_lectivo, c.semestre, c.encargado_id, activoValue, c.createdAt, c.updatedAt, c.deletedAt],
    });
  }

  //    Restore autoincrement offset (SQLite only)
  if (allComisiones.length > 0 && dialect === 'sqlite') {
    const maxId = Math.max(...allComisiones.map((c) => c.id));
    await queryInterface.sequelize.query(
      `DELETE FROM sqlite_sequence WHERE name = 'comisiones'`
    ).catch(() => {});
    await queryInterface.sequelize.query(
      `INSERT INTO sqlite_sequence (name, seq) VALUES ('comisiones', ${maxId})`
    ).catch(() => {});
  }

  //    Add unique index
  await queryInterface.addIndex('comisiones',
    ['carrera_id', 'nombre', 'anio_lectivo', 'semestre'],
    { unique: true }
  );
}

export async function down(queryInterface, Sequelize) {
  const tableInfo = await queryInterface.describeTable('comisiones');
  const indexes = await queryInterface.showIndex('comisiones');
  const newUnique = indexes.find(
    (idx) => idx.unique && idx.fields.some((f) => f.attribute === 'carrera_id')
  );
  if (newUnique) {
    await queryInterface.removeIndex('comisiones', newUnique.fields.map((f) => f.attribute));
  }

  // Read current data
  const dialectDown = queryInterface.sequelize.getDialect();
  const quoteDown = (col) => dialectDown === 'postgres' ? `"${col}"` : col;
  const allComisiones = await queryInterface.sequelize.query(
    `SELECT id, nombre, anio_lectivo, semestre, encargado_id, activo, ${quoteDown('createdAt')}, ${quoteDown('updatedAt')}, ${quoteDown('deletedAt')} FROM comisiones`,
    { type: Sequelize.QueryTypes.SELECT }
  );

  // Get carrera_materia_id from junction
  const junctionRows = await queryInterface.sequelize.query(
    'SELECT comision_id, carrera_materia_id FROM comision_carrera_materias',
    { type: Sequelize.QueryTypes.SELECT }
  );
  const cmMap = {};
  for (const j of junctionRows) {
    if (!cmMap[j.comision_id]) {
      cmMap[j.comision_id] = j.carrera_materia_id;
    }
  }

  // Drop and recreate with old schema
  if (dialectDown === 'postgres') {
    await queryInterface.sequelize.query('ALTER TABLE horarios DROP CONSTRAINT IF EXISTS horarios_comision_id_fkey');
    await queryInterface.sequelize.query('ALTER TABLE comision_carrera_materias DROP CONSTRAINT IF EXISTS comision_carrera_materias_comision_id_fkey');
  }
  await queryInterface.dropTable('comisiones');

  await queryInterface.createTable('comisiones', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    carrera_materia_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'carrera_materias', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    nombre: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    anio_lectivo: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    semestre: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    encargado_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    activo: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    deletedAt: {
      type: Sequelize.DATE,
    },
  });

  for (const c of allComisiones) {
    const cmId = cmMap[c.id];
    const activoValueDown = dialectDown === 'postgres' ? c.activo : (c.activo ? 1 : 0);
    await queryInterface.sequelize.query(`
      INSERT INTO comisiones (id, carrera_materia_id, nombre, anio_lectivo, semestre, encargado_id, activo, ${quoteDown('createdAt')}, ${quoteDown('updatedAt')}, ${quoteDown('deletedAt')})
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, {
      replacements: [c.id, cmId, c.nombre, c.anio_lectivo, c.semestre, c.encargado_id, activoValueDown, c.createdAt, c.updatedAt, c.deletedAt],
    });
  }

  if (allComisiones.length > 0 && dialectDown === 'sqlite') {
    const maxId = Math.max(...allComisiones.map((c) => c.id));
    await queryInterface.sequelize.query(
      `DELETE FROM sqlite_sequence WHERE name = 'comisiones'`
    ).catch(() => {});
    await queryInterface.sequelize.query(
      `INSERT INTO sqlite_sequence (name, seq) VALUES ('comisiones', ${maxId})`
    ).catch(() => {});
  }

  await queryInterface.addIndex('comisiones',
    ['carrera_materia_id', 'nombre', 'anio_lectivo', 'semestre'],
    { unique: true }
  );

  await queryInterface.dropTable('comision_carrera_materias');
}
