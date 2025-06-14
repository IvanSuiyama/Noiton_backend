import { Pool } from 'pg';

interface Tarefa {
  id_categoria?: number;
  titulo: string;
  data_inicio: Date;
  data_fim?: Date;
  conteudo?: string;
  status?: string;
  prioridade?: 'baixa' | 'media' | 'alta';
  id_pai?: number; // id da tarefa pai para subtarefas
}

function parseDateToBrazil(date: string | Date | undefined): Date | null {
  if (!date) return null;
  if (typeof date === 'string') {
    // Se vier só a data (ex: '2025-06-06'), trata como meia-noite no horário de Brasília (UTC-3)
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      // Cria a data como local Brasil (UTC-3)
      const [year, month, day] = date.split('-').map(Number);
      // Ajusta para UTC considerando o fuso de Brasília
      return new Date(Date.UTC(year, month - 1, day, 3, 0, 0));
    }
    // Se vier ISO já com hora, converte para Date normal
    return new Date(date);
  }
  return date;
}

export const cadastrarTarefa = async (db: Pool, tarefa: Omit<Tarefa, 'id_categoria'> & { id_pai?: number }): Promise<number> => {
  const data_inicio = parseDateToBrazil(tarefa.data_inicio);
  const data_fim = parseDateToBrazil(tarefa.data_fim);
  const query = `
    INSERT INTO tarefas (titulo, data_inicio, data_fim, conteudo, status, prioridade, id_pai)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id_tarefa
  `;
  const result = await db.query(query, [
    tarefa.titulo,
    data_inicio,
    data_fim,
    tarefa.conteudo ?? null,
    tarefa.status ?? null,
    tarefa.prioridade ?? null,
    tarefa.id_pai ?? null
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

// Função para associar tarefa à categoria na tabela categoria_tarefas
export const associarTarefaCategoria = async (db: Pool, id_categoria: number, id_tarefa: number): Promise<void> => {
  const query = `
    INSERT INTO categoria_tarefas (id_categoria, id_tarefa)
    VALUES ($1, $2)
  `;
  await db.query(query, [id_categoria, id_tarefa]);
};

export const editarTarefa = async (db: Pool, id_tarefa: number, tarefa: Omit<Tarefa, 'id_categoria'>): Promise<void> => {
  const data_inicio = parseDateToBrazil(tarefa.data_inicio);
  const data_fim = parseDateToBrazil(tarefa.data_fim);
  const query = `
    UPDATE tarefas
    SET titulo = $1, data_inicio = $2, data_fim = $3, conteudo = $4, status = $5, prioridade = $6
    WHERE id_tarefa = $7
  `;
  await db.query(query, [
    tarefa.titulo,
    data_inicio,
    data_fim,
    tarefa.conteudo ?? null,
    tarefa.status ?? null,
    tarefa.prioridade ?? null,
    id_tarefa
  ]);
};

export const listarTarefas = async (db: Pool, filtros?: { prazoFinal?: string, semPrazo?: boolean }): Promise<any[]> => {
  let query = 'SELECT * FROM tarefas';
  const params: any[] = [];
  const where: string[] = [];

  if (filtros) {
    if (filtros.prazoFinal) {
      where.push('data_fim::date = $' + (params.length + 1));
      params.push(filtros.prazoFinal);
    }
    if (filtros.semPrazo) {
      where.push('data_fim IS NULL');
    }
  }

  if (where.length > 0) {
    query += ' WHERE ' + where.join(' AND ');
  }

  const result = await db.query(query, params);
  return result.rows;
};

export const excluirTarefa = async (db: Pool, id_tarefa: number): Promise<void> => {
  const query = 'DELETE FROM tarefas WHERE id_tarefa = $1';
  await db.query(query, [id_tarefa]);
};

export const atualizarStatusTarefa = async (db: Pool, id_tarefa: number, status: string): Promise<void> => {
  const query = `
    UPDATE tarefas
    SET status = $1
    WHERE id_tarefa = $2
  `;
  await db.query(query, [status, id_tarefa]);
};

export const buscarTarefaPorId = async (db: Pool, id_tarefa: number): Promise<any | null> => {
  const query = 'SELECT * FROM tarefas WHERE id_tarefa = $1';
  const result = await db.query(query, [id_tarefa]);
  return result.rows[0] ?? null;
};

// Função para remover todas as associações de uma tarefa com categorias
export const removerAssociacoesTarefaCategoria = async (db: Pool, id_tarefa: number): Promise<void> => {
  const query = 'DELETE FROM categoria_tarefas WHERE id_tarefa = $1';
  await db.query(query, [id_tarefa]);
};

// Buscar categorias de uma tarefa
export const buscarCategoriasPorTarefa = async (db: Pool, id_tarefa: number): Promise<any[]> => {
  const query = `
    SELECT c.id_categoria, c.nome
    FROM categoria_tarefas ct
    JOIN categorias c ON ct.id_categoria = c.id_categoria
    WHERE ct.id_tarefa = $1
  `;
  const result = await db.query(query, [id_tarefa]);
  return result.rows;
};

// Listar subtarefas de uma tarefa pai
export const listarSubtarefas = async (db: Pool, id_pai: number): Promise<any[]> => {
  const query = 'SELECT * FROM tarefas WHERE id_pai = $1';
  const result = await db.query(query, [id_pai]);
  return result.rows;
};

export const listarTarefasPorUsuario = async (db: Pool, cpf: string, filtros?: { prazoFinal?: string, semPrazo?: boolean }): Promise<any[]> => {
  let query = `SELECT t.* FROM tarefas t
    INNER JOIN usuario_tarefas ut ON ut.id_tarefa = t.id_tarefa
    WHERE ut.cpf = $1`;
  const params: any[] = [cpf];

  if (filtros) {
    if (filtros.prazoFinal) {
      query += ' AND t.data_fim::date = $' + (params.length + 1);
      params.push(filtros.prazoFinal);
    }
    if (filtros.semPrazo) {
      query += ' AND t.data_fim IS NULL';
    }
  }

  const result = await db.query(query, params);
  return result.rows;
};
