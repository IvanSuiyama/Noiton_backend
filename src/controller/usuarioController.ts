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

export const loginUsuario = async (req: Request, res: Response) => {
  try {
    const token = await usuarioService.loginUsuario(connection, req.body.email, req.body.senha);
    res.status(200).json({ token });
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
