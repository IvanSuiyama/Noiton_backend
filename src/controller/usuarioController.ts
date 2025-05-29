import { Request, Response } from 'express';
import pool from '../config/database';
import * as usuarioService from '../service/usuarioService';

export const cadastrarUsuario = async (req: Request, res: Response) => {
  try {
    await usuarioService.cadastrarUsuario(pool, req.body);
    res.status(201).send('Usuário cadastrado com sucesso.');
  } catch (error) {
    res.status(400).send(error);
  }
};

export const loginUsuario = async (req: Request, res: Response) => {
  try {
    const { token, cpf } = await usuarioService.loginUsuario(pool, req.body.email, req.body.senha);
    res.status(200).json({ token, cpf });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const atualizarUsuario = async (req: Request, res: Response) => {
  try {
    await usuarioService.atualizarUsuario(pool, req.params.cpf, req.body);
    res.status(200).send('Usuário atualizado com sucesso.');
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deletarUsuario = async (req: Request, res: Response) => {
  try {
    await usuarioService.deletarUsuario(pool, req.params.cpf);
    res.status(200).send('Usuário deletado com sucesso.');
  } catch (error) {
    res.status(400).send(error);
  }
};

export const verificarWorkspaceUsuario = async (req: Request, res: Response) => {
  try {
    const possuiWorkspace = await usuarioService.verificarWorkspaceUsuario(pool, req.params.cpf);
    res.status(200).json({ possuiWorkspace });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const listarUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await usuarioService.listarUsuarios(pool);
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const buscarUsuarioPorCPF = async (req: Request, res: Response) => {
  try {
    const usuario = await usuarioService.buscarUsuarioPorCPF(pool, req.params.cpf);
    res.status(200).json(usuario);
  } catch (error) {
    res.status(404).send(error);
  }
};
