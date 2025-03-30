import { Request, Response } from 'express';
import connection from '../config/database';
import { cadastrarWorkspace, verificarUsuarioLogado, editarNomeWorkspace, excluirWorkspace } from '../service/workspaceService';

export const createWorkspace = async (req: Request, res: Response) => {
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({ error: 'O nome do workspace é obrigatório.' });
  }

  try {
    await cadastrarWorkspace(connection, nome);
    res.status(201).json({ message: 'Workspace cadastrado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: `Erro ao cadastrar o workspace: ${error}` });
  }
};

export const checkUserLoggedIn = async (req: Request, res: Response) => {
  const { cpf } = req.body;

  if (!cpf) {
    return res.status(400).json({ error: 'O CPF do usuário é obrigatório.' });
  }

  try {
    const isLoggedIn = await verificarUsuarioLogado(connection, cpf);
    res.status(200).json({ loggedIn: isLoggedIn });
  } catch (error) {
    res.status(500).json({ error: `Erro ao verificar se o usuário está logado: ${error}` });
  }
};

export const updateWorkspaceName = async (req: Request, res: Response) => {
  const { id } = req.params; // Obtém o ID do parâmetro da rota
  const { novoNome } = req.body;

  if (!id || !novoNome) {
    return res.status(400).json({ error: 'O ID do workspace e o novo nome são obrigatórios.' });
  }

  try {
    await editarNomeWorkspace(connection, parseInt(id, 10), novoNome); // Converte o ID para número
    res.status(200).json({ message: 'Nome do workspace atualizado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: `Erro ao atualizar o nome do workspace: ${error}` });
  }
};

export const deleteWorkspace = async (req: Request, res: Response) => {
  const { id } = req.params; // Obtém o ID do parâmetro da rota

  if (!id) {
    return res.status(400).json({ error: 'O ID do workspace é obrigatório.' });
  }

  try {
    await excluirWorkspace(connection, parseInt(id, 10)); // Converte o ID para número
    res.status(200).json({ message: 'Workspace excluído com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: `Erro ao excluir o workspace: ${error}` });
  }
};
