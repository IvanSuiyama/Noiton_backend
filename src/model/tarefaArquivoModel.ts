import { Pool } from 'pg';

export interface TarefaArquivo {
  id_arquivo: number;
  id_tarefa: number;
  nome_arquivo: string;
  caminho_servidor: string;
}

export const createTarefaArquivosTable = async (db: Pool) => {
  const query = `
    CREATE TABLE IF NOT EXISTS tarefa_arquivos (
      id_arquivo SERIAL PRIMARY KEY,
      id_tarefa INTEGER REFERENCES tarefas(id_tarefa),
      nome_arquivo VARCHAR(255),
      caminho_servidor VARCHAR(512)
    );
  `;
  try {
    await db.query(query);
  } catch (err) {
    console.error('Erro ao criar a tabela tarefa_arquivos:', err);
  }
};

export const dropTarefaArquivosTable = async (db: Pool) => {
  const query = `DROP TABLE IF EXISTS tarefa_arquivos;`;
  try {
    await db.query(query);
  } catch (err) {
    console.error('Erro ao excluir a tabela tarefa_arquivos:', err);
  }
};
