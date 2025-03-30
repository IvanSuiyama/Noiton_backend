import { Request, Response } from 'express';
import connection from '../config/database';
import { cadastrarTarefa, editarTarefa, listarTarefas, excluirTarefa } from '../service/tarefaService';

export const createTarefa = async (req: Request, res: Response) => {
  const { id_categoria, id_workspace, titulo, data_inicio, data_fim, conteudo, status, prioridade } = req.body;

  if (!titulo || !data_inicio) {
    return res.status(400).json({ error: 'O título e a data de início são obrigatórios.' });
  }

  try {
    await cadastrarTarefa(connection, { id_categoria, id_workspace, titulo, data_inicio, data_fim, conteudo, status, prioridade });
    res.status(201).json({ message: 'Tarefa cadastrada com sucesso.' });
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
    await editarTarefa(connection, parseInt(id, 10), { id_categoria, id_workspace, titulo, data_inicio, data_fim, conteudo, status, prioridade });
    res.status(200).json({ message: 'Tarefa atualizada com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: `Erro ao atualizar a tarefa: ${error}` });
  }
};

export const listTarefas = async (_req: Request, res: Response) => {
  try {
    const tarefas = await listarTarefas(connection);
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
    await excluirTarefa(connection, parseInt(id, 10));
    res.status(200).json({ message: 'Tarefa excluída com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: `Erro ao excluir a tarefa: ${error}` });
  }
};
