import { Pool } from 'pg';

export interface Notificacao {
  id: number;
  data: Date;
  id_tarefa: number;
  mensagem: string;
}

export const createNotificacoesTable = async (db: Pool) => {
  const query = `
    CREATE TABLE IF NOT EXISTS notificacoes (
      id SERIAL PRIMARY KEY,
      data TIMESTAMP NOT NULL DEFAULT NOW(),
      id_tarefa INTEGER NOT NULL,
      mensagem TEXT NOT NULL,
      CONSTRAINT notificacoes_id_tarefa_fkey FOREIGN KEY (id_tarefa) REFERENCES tarefas(id_tarefa) ON DELETE CASCADE
    );
  `;
  try {
    await db.query(query);
  } catch (err) {
    console.error('Erro ao criar a tabela de notificações:', err);
  }
};

export const dropNotificacoesTable = async (db: Pool) => {
  const query = `DROP TABLE IF EXISTS notificacoes CASCADE;`;
  try {
    await db.query(query);
  } catch (err) {
    console.error('Erro ao excluir a tabela de notificações:', err);
  }
};
