import { Pool } from 'pg';
import { Rotina } from '../model/tarefasModel';

export const cadastrarRotina = async (
  db: Pool,
  rotina: Omit<Rotina, 'id_rotina' | 'ativa'>
): Promise<number> => {
  const query = `
    INSERT INTO rotinas (id_tarefa_base, dias_semana, data_fim)
    VALUES ($1, $2, $3)
    RETURNING id_rotina
  `;
  const result = await db.query(query, [
    rotina.id_tarefa_base,
    rotina.dias_semana,
    rotina.data_fim ?? null
  ]);
  return result.rows[0].id_rotina;
};

export const listarRotinasPorUsuario = async (db: Pool, cpf: string): Promise<any[]> => {
  // Busca rotinas associadas ao usuário pela tabela usuario_tarefas
  const query = `
    SELECT r.*
    FROM rotinas r
    JOIN usuario_tarefas ut ON ut.id_tarefa = r.id_rotina
    WHERE ut.cpf = $1
  `;
  const result = await db.query(query, [cpf]);
  return result.rows;
};

export const excluirRotina = async (db: Pool, id_rotina: number): Promise<void> => {
  const query = `DELETE FROM rotinas WHERE id_rotina = $1`;
  await db.query(query, [id_rotina]);
};

export const buscarRotinaPorId = async (db: Pool, id_rotina: number): Promise<any | null> => {
  const query = `SELECT * FROM rotinas WHERE id_rotina = $1`;
  const result = await db.query(query, [id_rotina]);
  return result.rows[0] ?? null;
};
