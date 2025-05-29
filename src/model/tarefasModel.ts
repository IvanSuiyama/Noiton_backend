import { Pool } from 'pg';

export interface Tarefa {
  id_tarefa: number;
  id_categoria: number;
  titulo: string;
  data_inicio: Date;
  data_fim: Date;
  conteudo: string;
  status: string;
  prioridade: 'baixa' | 'media' | 'alta';
}

export const CreateTarefaTable = async (db: Pool) => {
  const createQuery = `
    CREATE TABLE IF NOT EXISTS tarefas (
      id_tarefa SERIAL PRIMARY KEY,
      id_categoria INTEGER,
      titulo VARCHAR(255) NOT NULL,
      data_inicio TIMESTAMP NOT NULL,
      data_fim TIMESTAMP,
      conteudo TEXT,
      status VARCHAR(50),
      prioridade VARCHAR(10)
    );
  `;
  try {
    await db.query(createQuery);
  } catch (err) {
    console.error("Erro ao criar a tabela de tarefas:", err);
  }
};


export const createUsuarioTarefasTable = async (db: Pool) => {
  const query = `
    CREATE TABLE IF NOT EXISTS usuario_tarefas (
      id SERIAL PRIMARY KEY,
      cpf VARCHAR(11) NOT NULL,
      id_tarefa INTEGER NOT NULL
    );
  `;
  try {
    await db.query(query);
  } catch (err) {
    console.error('Erro ao criar a tabela usuario_tarefas:', err);
  }
};

export const dropTarefaTable = async (db: Pool) => {
  const query = `DROP TABLE IF EXISTS tarefas;`;
  try {
    await db.query(query);
  } catch (err) {
    console.error("Erro ao excluir a tabela de tarefas:", err);
  }
};

export const dropUsuarioTarefasTable = async (db: Pool) => {
  const query = `DROP TABLE IF EXISTS usuario_tarefas;`;
  try {
    await db.query(query);
  } catch (err) {
    console.error('Erro ao excluir a tabela usuario_tarefas:', err);
  }
};
