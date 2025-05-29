import { Request, Response } from 'express';
import pool from '../config/database';
import { cadastrarTarefa, editarTarefa, listarTarefas, excluirTarefa, associarTarefaUsuario } from '../service/tarefaService';

// Função utilitária para pegar o CPF do usuário logado
const getCpfFromRequest = (req: Request): string | undefined => {
  return (req as any).user?.cpf;
};

export const createTarefa = async (req: Request, res: Response) => {
  const { id_categoria, id_workspace, titulo, data_inicio, data_fim, conteudo, status, prioridade } = req.body;

  if (!titulo || !data_inicio) {
    return res.status(400).json({ error: 'O título e a data de início são obrigatórios.' });
  }

  const cpf = getCpfFromRequest(req);
  if (!cpf) {
    return res.status(401).json({ error: 'Usuário não autenticado.' });
  }

  try {
    const id_tarefa = await cadastrarTarefa(pool, { id_categoria, id_workspace, titulo, data_inicio, data_fim, conteudo, status, prioridade });
    await associarTarefaUsuario(pool, cpf, id_tarefa);
    res.status(201).json({ message: 'Tarefa cadastrada e associada ao usuário com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: `Erro ao cadastrar a tarefa: ${error}` });
  }
};

export const updateTarefa = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { id_categoria, id_workspace, titulo, data_inicio, data_fim, conteudo, status, prioridade } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'O ID da tarefa é obrigatório.' });
  }

  try {
    await editarTarefa(pool, parseInt(id, 10), { id_categoria, id_workspace, titulo, data_inicio, data_fim, conteudo, status, prioridade });
    res.status(200).json({ message: 'Tarefa atualizada com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: `Erro ao atualizar a tarefa: ${error}` });
  }
};

export const listTarefas = async (_req: Request, res: Response) => {
  try {
    const tarefas = await listarTarefas(pool);
    res.status(200).json(tarefas);
  } catch (error) {
    res.status(500).json({ error: `Erro ao listar as tarefas: ${error}` });
  }
};

export const deleteTarefa = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'O ID da tarefa é obrigatório.' });
  }

  try {
    await excluirTarefa(pool, parseInt(id, 10));
    res.status(200).json({ message: 'Tarefa excluída com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: `Erro ao excluir a tarefa: ${error}` });
  }
};
