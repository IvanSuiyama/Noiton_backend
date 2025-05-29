import { Pool } from 'pg';


export interface Categoria {
  id_categoria: number;
  nome: string;
}


export const createCategoriaTable = async (db: Pool) => {
  const query = `
    CREATE TABLE IF NOT EXISTS categorias (
      id_categoria SERIAL PRIMARY KEY,
      nome VARCHAR(255) NOT NULL
    );
  `;
  try {
    await db.query(query);
  } catch (err) {
    console.error('Erro ao criar a tabela de categorias:', err);
  }
};


export const dropCategoriaTable = async (db: Pool) => {
  const query = `DROP TABLE IF EXISTS categorias;`;
  try {
    await db.query(query);
  } catch (err) {
    console.error('Erro ao excluir a tabela de categorias:', err);
  }
};
