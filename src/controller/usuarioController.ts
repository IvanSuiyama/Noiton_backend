import { Request, Response } from 'express';
import * as usuarioService from '../service/usuarioService';
import connection from '../config/database';

export const cadastrarUsuario = async (req: Request, res: Response) => {
  try {
    await usuarioService.cadastrarUsuario(connection, req.body);
    res.status(201).send('Usuário cadastrado com sucesso.');
  } catch (error) {
    res.status(400).send(error);
  }
};

// Função para realizar login
export const loginUsuario = async (req: Request, res: Response) => {
  try {
    const { token, cpf } = await usuarioService.loginUsuario(connection, req.body.email, req.body.senha); // Receba o CPF
    res.status(200).json({ token, cpf }); // Inclua o CPF na resposta
  } catch (error) {
    res.status(400).send(error);
  }
};

export const atualizarUsuario = async (req: Request, res: Response) => {
  try {
    await usuarioService.atualizarUsuario(connection, req.params.cpf, req.body);
    res.status(200).send('Usuário atualizado com sucesso.');
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deletarUsuario = async (req: Request, res: Response) => {
  try {
    await usuarioService.deletarUsuario(connection, req.params.cpf);
    res.status(200).send('Usuário deletado com sucesso.');
  } catch (error) {
    res.status(400).send(error);
  }
};

export const verificarWorkspaceUsuario = async (req: Request, res: Response) => {
  try {
    const possuiWorkspace = await usuarioService.verificarWorkspaceUsuario(connection, req.params.cpf);
    res.status(200).json({ possuiWorkspace });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const listarUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await usuarioService.listarUsuarios(connection);
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const buscarUsuarioPorCPF = async (req: Request, res: Response) => {
  try {
    const usuario = await usuarioService.buscarUsuarioPorCPF(connection, req.params.cpf);
    res.status(200).json(usuario);
  } catch (error) {
    res.status(404).send(error);
  }
};
