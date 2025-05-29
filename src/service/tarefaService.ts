import { Pool } from 'pg';

interface Tarefa {
  id_categoria?: number;
  id_workspace?: number;
  titulo: string;
  data_inicio: Date;
  data_fim?: Date;
  conteudo?: string;
  status?: string;
  prioridade?: 'baixa' | 'media' | 'alta';
}

export const cadastrarTarefa = async (db: Pool, tarefa: Tarefa): Promise<number> => {
  const query = `
    INSERT INTO tarefas (id_categoria, id_workspace, titulo, data_inicio, data_fim, conteudo, status, prioridade)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id_tarefa
  `;
  const result = await db.query(query, [
    tarefa.id_categoria ?? null,
    tarefa.id_workspace ?? null,
    tarefa.titulo,
    tarefa.data_inicio,
    tarefa.data_fim ?? null,
    tarefa.conteudo ?? null,
    tarefa.status ?? null,
    tarefa.prioridade ?? null
  ]);
  return result.rows[0].id_tarefa;
};

// Função para associar tarefa ao usuário na tabela intermediária
export const associarTarefaUsuario = async (db: Pool, cpf: string, id_tarefa: number): Promise<void> => {
  const query = `
    INSERT INTO usuario_tarefas (cpf, id_tarefa)
    VALUES ($1, $2)
  `;
  await db.query(query, [cpf, id_tarefa]);
};

export const editarTarefa = async (db: Pool, id_tarefa: number, tarefa: Tarefa): Promise<void> => {
  const query = `
    UPDATE tarefas
    SET id_categoria = $1, id_workspace = $2, titulo = $3, data_inicio = $4, data_fim = $5, conteudo = $6, status = $7, prioridade = $8
    WHERE id_tarefa = $9
  `;
  await db.query(query, [
    tarefa.id_categoria ?? null,
    tarefa.id_workspace ?? null,
    tarefa.titulo,
    tarefa.data_inicio,
    tarefa.data_fim ?? null,
    tarefa.conteudo ?? null,
    tarefa.status ?? null,
    tarefa.prioridade ?? null,
    id_tarefa
  ]);
};

export const listarTarefas = async (db: Pool): Promise<any[]> => {
  const query = 'SELECT * FROM tarefas';
  const result = await db.query(query);
  return result.rows;
};

export const excluirTarefa = async (db: Pool, id_tarefa: number): Promise<void> => {
  const query = 'DELETE FROM tarefas WHERE id_tarefa = $1';
  await db.query(query, [id_tarefa]);
};
