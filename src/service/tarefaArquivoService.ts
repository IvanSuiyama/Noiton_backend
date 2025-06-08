import { Pool } from 'pg';
import { TarefaArquivo } from '../model/tarefaArquivoModel';

export const salvarArquivoTarefa = async (
  db: Pool,
  id_tarefa: number,
  nome_arquivo: string,
  caminho_servidor: string
): Promise<TarefaArquivo> => {
  const query = `
    INSERT INTO tarefa_arquivos (id_tarefa, nome_arquivo, caminho_servidor)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const { rows } = await db.query(query, [id_tarefa, nome_arquivo, caminho_servidor]);
  return rows[0];
};

export const listarArquivosPorTarefa = async (
  db: Pool,
  id_tarefa: number
): Promise<TarefaArquivo[]> => {
  const query = `SELECT * FROM tarefa_arquivos WHERE id_tarefa = $1`;
  const { rows } = await db.query(query, [id_tarefa]);
  return rows;
};

export const deletarArquivoTarefa = async (
  db: Pool,
  id_arquivo: number
): Promise<void> => {
  const query = `DELETE FROM tarefa_arquivos WHERE id_arquivo = $1`;
  await db.query(query, [id_arquivo]);
};
