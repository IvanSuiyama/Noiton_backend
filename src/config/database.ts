import { Pool } from 'pg';

const connectionString = 'postgresql://neondb_owner:npg_z8TajBX9uoGD@ep-polished-rain-a8jwhmrn-pooler.eastus2.azure.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.connect((err) => {
  if (err) {
    console.error('Erro ao conectar: ', err);
  } else {
    console.log('Conectado ao banco de dados PostgreSQL!');
  }
});


setInterval(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('Ping enviado para manter o banco ativo');
  } catch (err) {
    console.error('Erro ao enviar ping:', err);
  }
}, 10000);

export default pool;
