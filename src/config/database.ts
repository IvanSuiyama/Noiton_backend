import { Pool } from 'pg';
import * as url from 'url';


const connectionString = 'postgresql://neondb_owner:npg_z8TajBX9uoGD@ep-polished-rain-a8jwhmrn-pooler.eastus2.azure.neon.tech/neondb?sslmode=require';


const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect((err) => {
  if (err) {
    console.error('Erro ao conectar: ', err);
  } else {
    console.log('Conectado ao banco de dados PostgreSQL!');
  }
});

export default pool;

