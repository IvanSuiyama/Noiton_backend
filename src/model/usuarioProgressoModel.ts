import { Pool } from 'pg';

export interface UsuarioProgresso {
  id: number;
  cpf: string;
  tarefas_criadas: number;
  tarefas_concluidas: number;
  tarefas_apagadas: number;
  tarefas_em_aberto: number;
  datas_criacao: Date[];
  datas_conclusao: Date[];
  datas_exclusao: Date[];
}

export const createUsuarioProgressoTable = async (db: Pool) => {
  const query = `
    CREATE TABLE IF NOT EXISTS usuario_progresso (
      id SERIAL PRIMARY KEY,
      cpf VARCHAR(11) NOT NULL UNIQUE,
      tarefas_criadas INTEGER DEFAULT 0,
      tarefas_concluidas INTEGER DEFAULT 0,
      tarefas_apagadas INTEGER DEFAULT 0,
      tarefas_em_aberto INTEGER DEFAULT 0,
      datas_criacao TIMESTAMP[],
      datas_conclusao TIMESTAMP[],
      datas_exclusao TIMESTAMP[],
      FOREIGN KEY (cpf) REFERENCES usuarios(cpf) ON DELETE CASCADE
    );
  `;
  try {
    await db.query(query);
  } catch (err) {
    console.error('Erro ao criar a tabela usuario_progresso:', err);
  }
};

export const dropUsuarioProgressoTable = async (db: Pool) => {
  const query = `DROP TABLE IF EXISTS usuario_progresso;`;
  try {
    await db.query(query);
  } catch (err) {
    console.error('Erro ao excluir a tabela usuario_progresso:', err);
  }
};
