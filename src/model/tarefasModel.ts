import { Pool } from 'pg';

// --- TAREFAS ---
export interface Tarefa {
  id_tarefa: number;
  titulo: string;
  data_inicio: Date;
  data_fim: Date;
  conteudo: string;
  status: string;
  prioridade: 'baixa' | 'media' | 'alta';
  id_pai?: number; // id da tarefa pai para subtarefas
}

export const CreateTarefaTable = async (db: Pool) => {
  const createQuery = `
    CREATE TABLE IF NOT EXISTS tarefas (
      id_tarefa SERIAL PRIMARY KEY,
      titulo VARCHAR(255) NOT NULL,
      data_inicio TIMESTAMP NOT NULL,
      data_fim TIMESTAMP,
      conteudo TEXT,
      status VARCHAR(50),
      prioridade VARCHAR(10),
      id_pai INTEGER REFERENCES tarefas(id_tarefa)
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

// --- ROTINAS ---
export interface Rotina {
  id_rotina: number;
  id_tarefa_base: number;
  dias_semana: string; // Ex: "seg,ter,qua"
  data_fim?: Date;
  ativa: boolean;
}

export const createRotinasTable = async (db: Pool) => {
  const query = `
    CREATE TABLE IF NOT EXISTS rotinas (
      id_rotina SERIAL PRIMARY KEY,
      id_tarefa_base INTEGER REFERENCES tarefas(id_tarefa) ON DELETE CASCADE,
      dias_semana VARCHAR(20) NOT NULL,
      data_fim DATE,
      ativa BOOLEAN DEFAULT TRUE
    );
  `;
  try {
    await db.query(query);
  } catch (err) {
    console.error('Erro ao criar a tabela rotinas:', err);
  }
};

export const dropRotinasTable = async (db: Pool) => {
  const query = `DROP TABLE IF EXISTS rotinas;`;
  try {
    await db.query(query);
  } catch (err) {
    console.error('Erro ao excluir a tabela rotinas:', err);
  }
};
