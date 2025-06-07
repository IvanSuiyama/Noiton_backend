import { Request, Response } from 'express';
import pool from '../config/database';
import {
  cadastrarRotina,
  listarRotinasPorUsuario,
  excluirRotina,
  buscarRotinaPorId
} from '../service/rotinaService';
import { associarTarefaUsuario } from '../service/tarefaService';

// Utilitário para pegar o CPF do usuário autenticado
const getCpfFromRequest = (req: Request): string | undefined => {
  return (req as any).user?.cpf;
};

export const createRotina = async (req: Request, res: Response) => {
  const { id_tarefa_base, dias_semana, data_fim } = req.body;
  if (!id_tarefa_base || !dias_semana) {
    return res.status(400).json({ error: 'id_tarefa_base e dias_semana são obrigatórios.' });
  }
  const cpf = getCpfFromRequest(req);
  if (!cpf) {
    return res.status(401).json({ error: 'Usuário não autenticado.' });
  }
  try {
    const id_rotina = await cadastrarRotina(pool, { id_tarefa_base, dias_semana, data_fim });
    // Associa rotina ao usuário na tabela usuario_tarefas (id_tarefa = id_rotina)
    await associarTarefaUsuario(pool, cpf, id_rotina);
    res.status(201).json({ message: 'Rotina cadastrada com sucesso.', id_rotina });
  } catch (error) {
    res.status(500).json({ error: `Erro ao cadastrar a rotina: ${error}` });
  }
};

export const listRotinas = async (req: Request, res: Response) => {
  const cpf = req.query.cpf || getCpfFromRequest(req);
  if (!cpf) {
    return res.status(401).json({ error: 'Usuário não autenticado.' });
  }
  try {
    const rotinas = await listarRotinasPorUsuario(pool, String(cpf));
    res.status(200).json(rotinas);
  } catch (error) {
    res.status(500).json({ error: `Erro ao listar rotinas: ${error}` });
  }
};

export const deleteRotina = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'O ID da rotina é obrigatório.' });
  }
  try {
    await excluirRotina(pool, parseInt(id, 10));
    res.status(200).json({ message: 'Rotina excluída com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: `Erro ao excluir a rotina: ${error}` });
  }
};

export const getRotinaById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'O ID da rotina é obrigatório.' });
  }
  try {
    const rotina = await buscarRotinaPorId(pool, parseInt(id, 10));
    if (!rotina) {
      return res.status(404).json({ error: 'Rotina não encontrada.' });
    }
    res.status(200).json(rotina);
  } catch (error) {
    res.status(500).json({ error: `Erro ao buscar a rotina: ${error}` });
  }
};
