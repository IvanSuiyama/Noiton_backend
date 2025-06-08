import pool from '../config/database';
import { Notificacao } from '../model/notificacaoModel';

export const criarNotificacao = async (id_tarefa: number, mensagem: string): Promise<Notificacao | null> => {
  const query = `INSERT INTO notificacoes (id_tarefa, mensagem) VALUES ($1, $2) RETURNING *;`;
  try {
    const { rows } = await pool.query(query, [id_tarefa, mensagem]);
    return rows[0];
  } catch (err) {
    console.error('Erro ao criar notificação:', err);
    return null;
  }
};

export const listarNotificacoes = async (): Promise<Notificacao[]> => {
  const query = `SELECT * FROM notificacoes ORDER BY data DESC;`;
  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch (err) {
    console.error('Erro ao listar notificações:', err);
    return [];
  }
};
