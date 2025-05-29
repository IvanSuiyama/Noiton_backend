import { Pool } from 'pg';


export interface Usuario {
  cpf: string;
  email: string;
  nome: string;
  telefone: string;
  senha: string;

}


export const createUsuarioTable = async (db: Pool) => {
  const query = `
    CREATE TABLE IF NOT EXISTS usuarios (
      cpf VARCHAR(11) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      nome VARCHAR(255) NOT NULL,
      telefone VARCHAR(20),
      senha VARCHAR(255) NOT NULL
    );
  `;
  try {
    await db.query(query);
  } catch (err) {
    console.error('Erro ao criar a tabela de usuários:', err);
  }
};

export const dropUsuarioTable = async (db: Pool) => {
  const query = `DROP TABLE IF EXISTS usuarios;`;
  try {
    await db.query(query);
  } catch (err) {
    console.error('Erro ao excluir a tabela de usuários:', err);
  }
};
