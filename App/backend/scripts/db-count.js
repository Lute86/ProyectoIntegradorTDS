import models from '../src/models/index.js';

const dialect = models.sequelize.getDialect();

let query;
if (dialect === 'postgres') {
  query = `
    SELECT tablename as tbl
    FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY tablename
  `;
} else {
  query = `
    SELECT name as tbl FROM sqlite_master
    WHERE type='table' AND name NOT LIKE 'sqlite_%'
    ORDER BY name
  `;
}

const [rows] = await models.sequelize.query(query);

console.log(`${'tbl'.padEnd(22)}| count`);
console.log(`${'-'.repeat(22)}+-------`);

for (const row of rows) {
  const [count] = await models.sequelize.query(`SELECT COUNT(*) as c FROM "${row.tbl}"`);
  console.log(`${row.tbl.padEnd(22)}| ${String(count[0].c).padStart(5)}`);
}

process.exit(0);
