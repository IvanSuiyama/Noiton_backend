import { Request, Response } from 'express';
import pool from '../config/database';
import { buscarTarefaPorId, associarTarefaUsuario } from '../service/tarefaService';
import { buscarUsuarioPorCPF } from '../service/usuarioService';

// Utilitário para pegar o CPF do usuário autenticado
const getCpfFromRequest = (req: Request): string | undefined => {
  return (req as any).user?.cpf;
};

export const compartilharTarefa = async (req: Request, res: Response) => {
  const { id_tarefa, cpf } = req.body;
  const cpfRemetente = getCpfFromRequest(req);

  if (!id_tarefa || !cpf) {
    return res.status(400).json({ error: 'id_tarefa e cpf são obrigatórios.' });
  }
  if (!cpfRemetente) {
    return res.status(401).json({ error: 'Usuário não autenticado.' });
  }

  try {
    // Verifica se a tarefa existe
    const tarefa = await buscarTarefaPorId(pool, Number(id_tarefa));
    if (!tarefa) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }
    // Verifica se o remetente tem permissão (é dono ou já está associado)
    const result = await pool.query('SELECT 1 FROM usuario_tarefas WHERE cpf = $1 AND id_tarefa = $2', [cpfRemetente, id_tarefa]);
    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Você não tem permissão para compartilhar esta tarefa.' });
    }
    // Verifica se o CPF destinatário existe
    let usuarioDestinatario;
    try {
      usuarioDestinatario = await buscarUsuarioPorCPF(pool, cpf);
    } catch {
      return res.status(404).json({ error: 'Usuário destinatário não encontrado.' });
    }
    // Evita duplicidade
    const existe = await pool.query('SELECT 1 FROM usuario_tarefas WHERE cpf = $1 AND id_tarefa = $2', [cpf, id_tarefa]);
    if (existe.rows.length > 0) {
      return res.status(409).json({ error: 'Esta tarefa já foi compartilhada com este usuário.' });
    }
    // Associa tarefa ao destinatário
    await associarTarefaUsuario(pool, cpf, id_tarefa);
    return res.status(201).json({ message: 'Tarefa compartilhada com sucesso.' });
  } catch (error) {
    return res.status(500).json({ error: `Erro ao compartilhar tarefa: ${error}` });
  }
};
