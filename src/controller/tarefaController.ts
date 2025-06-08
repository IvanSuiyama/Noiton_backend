import { Request, Response } from 'express';
import pool from '../config/database';
import { cadastrarTarefa, editarTarefa, listarTarefas, excluirTarefa, associarTarefaUsuario, atualizarStatusTarefa, buscarTarefaPorId, associarTarefaCategoria, removerAssociacoesTarefaCategoria, buscarCategoriasPorTarefa, listarSubtarefas } from '../service/tarefaService';

// Função utilitária para pegar o CPF do usuário logado
const getCpfFromRequest = (req: Request): string | undefined => {
  return (req as any).user?.cpf;
};

export const createTarefa = async (req: Request, res: Response) => {
  let { categorias, titulo, data_inicio, data_fim, conteudo, status, prioridade, id_pai } = req.body;

  if (!titulo) {
    return res.status(400).json({ error: 'O título é obrigatório.' });
  }
  if (!categorias || !Array.isArray(categorias) || categorias.length === 0) {
    return res.status(400).json({ error: 'A tarefa deve estar associada a pelo menos uma categoria.' });
  }
  if (!categorias.every((cat: any) => cat.id_categoria)) {
    return res.status(400).json({ error: 'Cada categoria deve conter um id_categoria.' });
  }

  // Se data_inicio não vier do frontend, define como agora (horário de Brasília)
  if (!data_inicio) {
    const now = new Date();
    // Ajusta para horário de Brasília (UTC-3)
    now.setHours(now.getHours() - 3, 0, 0, 0);
    data_inicio = now.toISOString().slice(0, 19); // yyyy-mm-ddTHH:MM:SS
  }

  const cpf = getCpfFromRequest(req);
  if (!cpf) {
    return res.status(401).json({ error: 'Usuário não autenticado.' });
  }

  try {
    // Cria a tarefa
    const id_tarefa = await cadastrarTarefa(pool, { titulo, data_inicio, data_fim, conteudo, status, prioridade, id_pai });
    // Associa tarefa ao usuário
    await associarTarefaUsuario(pool, cpf, id_tarefa);
    // Associa tarefa a todas as categorias informadas
    for (const cat of categorias) {
      await associarTarefaCategoria(pool, cat.id_categoria, id_tarefa);
    }
    res.status(201).json({ message: 'Tarefa cadastrada e associada ao usuário e categorias com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: `Erro ao cadastrar a tarefa: ${error}` });
  }
};

export const updateTarefa = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { categorias, titulo, data_inicio, data_fim, conteudo, status, prioridade } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'O ID da tarefa é obrigatório.' });
  }
  if (!categorias || !Array.isArray(categorias) || categorias.length === 0) {
    return res.status(400).json({ error: 'A tarefa deve estar associada a pelo menos uma categoria.' });
  }
  if (!categorias.every((cat: any) => cat.id_categoria)) {
    return res.status(400).json({ error: 'Cada categoria deve conter um id_categoria.' });
  }

  try {
    // Atualiza os dados da tarefa
    await editarTarefa(pool, parseInt(id, 10), { titulo, data_inicio, data_fim, conteudo, status, prioridade });
    // Remove associações antigas da tarefa com categorias
    await removerAssociacoesTarefaCategoria(pool, parseInt(id, 10));
    // Associa tarefa às novas categorias informadas
    for (const cat of categorias) {
      await associarTarefaCategoria(pool, cat.id_categoria, parseInt(id, 10));
    }
    res.status(200).json({ message: 'Tarefa atualizada e categorias associadas com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: `Erro ao atualizar a tarefa: ${error}` });
  }
};

export const listTarefas = async (req: Request, res: Response) => {
  try {
    // Filtros de query string
    const { prazoFinal, semPrazo } = req.query;
    const filtros: any = {};
    if (prazoFinal) filtros.prazoFinal = prazoFinal;
    if (typeof semPrazo === 'string' && semPrazo === 'true') filtros.semPrazo = true;

    const tarefas = await listarTarefas(pool, filtros);
    // Para cada tarefa, buscar as categorias associadas
    const tarefasComCategorias = await Promise.all(
      tarefas.map(async (tarefa) => {
        const categorias = await buscarCategoriasPorTarefa(pool, tarefa.id_tarefa);
        return { ...tarefa, categorias: categorias || [] };
      })
    );
    res.status(200).json(tarefasComCategorias);
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

export const updateTarefaStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id || !status) {
    return res.status(400).json({ error: 'O ID da tarefa e o novo status são obrigatórios.' });
  }

  try {
    await atualizarStatusTarefa(pool, parseInt(id, 10), status);
    res.status(200).json({ message: 'Status da tarefa atualizado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: `Erro ao atualizar o status da tarefa: ${error}` });
  }
};

export const getTarefaById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'O ID da tarefa é obrigatório.' });
  }
  try {
    const tarefa = await buscarTarefaPorId(pool, parseInt(id, 10));
    if (!tarefa) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }
    res.status(200).json(tarefa);
  } catch (error) {
    res.status(500).json({ error: `Erro ao buscar a tarefa: ${error}` });
  }
};

export const getSubtarefas = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'O ID da tarefa pai é obrigatório.' });
  }
  try {
    const subtarefas = await listarSubtarefas(pool, Number(id));
    res.status(200).json(subtarefas);
  } catch (error) {
    res.status(500).json({ error: `Erro ao listar subtarefas: ${error}` });
  }
};
