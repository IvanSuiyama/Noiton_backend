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

export const listarNotificacoesPorUsuario = async (cpf: string): Promise<Notificacao[]> => {
  const query = `
    SELECT n.* FROM notificacoes n
    INNER JOIN usuario_tarefas ut ON ut.id_tarefa = n.id_tarefa
    WHERE ut.cpf = $1
    ORDER BY n.data DESC;
  `;
  try {
    const { rows } = await pool.query(query, [cpf]);
    return rows;
  } catch (err) {
    console.log('Erro ao listar notificações por usuário:', err);
    return [];
  }
};
