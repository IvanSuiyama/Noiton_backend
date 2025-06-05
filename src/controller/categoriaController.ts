import { Request, Response } from 'express';
import pool from '../config/database';
import { cadastrarCategoria, excluirCategoria, editarNomeCategoria, obterCategoriaPorId, listarCategorias, criarCategoria, listarCategoriasPorUsuario } from '../service/categoriaService';

// Função utilitária para pegar o CPF do usuário logado
const getCpfFromRequest = (req: Request): string | undefined => {
  return (req as any).user?.cpf;
};

export const createCategoria = async (req: Request, res: Response) => {
  const { nome } = req.body;
  const cpf_user = getCpfFromRequest(req);

  if (!nome) {
    return res.status(400).json({ error: 'O nome da categoria é obrigatório.' });
  }
  if (!cpf_user) {
    return res.status(401).json({ error: 'Usuário não autenticado.' });
  }

  try {
    const id_categoria = await criarCategoria(pool, { nome, cpf_user });
    res.status(201).json({ message: 'Categoria criada com sucesso.', id_categoria });
  } catch (error) {
    res.status(500).json({ error: `Erro ao criar a categoria: ${error}` });
  }
};

export const deleteCategoria = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'O ID da categoria é obrigatório.' });
  }

  try {
    await excluirCategoria(pool, parseInt(id, 10));
    res.status(200).json({ message: 'Categoria excluída com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: `Erro ao excluir a categoria: ${error}` });
  }
};

export const updateCategoriaName = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { novoNome } = req.body;

  if (!id || !novoNome) {
    return res.status(400).json({ error: 'O ID da categoria e o novo nome são obrigatórios.' });
  }

  try {
    await editarNomeCategoria(pool, parseInt(id, 10), novoNome);
    res.status(200).json({ message: 'Nome da categoria atualizado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: `Erro ao atualizar o nome da categoria: ${error}` });
  }
};

export const getCategoriaById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'O ID da categoria é obrigatório.' });
  }

  try {
    const categoria = await obterCategoriaPorId(pool, parseInt(id, 10));
    res.status(200).json(categoria);
  } catch (error) {
    res.status(500).json({ error: `Erro ao obter a categoria: ${error}` });
  }
};

export const listCategorias = async (req: Request, res: Response) => {
  const cpf_user = getCpfFromRequest(req);
  if (!cpf_user) {
    return res.status(401).json({ error: 'Usuário não autenticado.' });
  }
  try {
    const categorias = await listarCategoriasPorUsuario(pool, cpf_user);
    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).json({ error: `Erro ao listar as categorias: ${error}` });
  }
};
