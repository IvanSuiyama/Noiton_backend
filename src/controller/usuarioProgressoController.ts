import { Request, Response } from 'express';
import pool from '../config/database';
import { getUsuarioProgresso } from '../service/usuarioProgressoService';

export const getProgressoUsuario = async (req: Request, res: Response) => {
  const cpf = (req as any).user?.cpf || req.query.cpf;
  if (!cpf) {
    return res.status(401).json({ error: 'Usuário não autenticado.' });
  }
  try {
    const progresso = await getUsuarioProgresso(pool, String(cpf));
    if (!progresso) {
      return res.status(404).json({ error: 'Progresso não encontrado.' });
    }
    res.status(200).json(progresso);
  } catch (error) {
    res.status(500).json({ error: `Erro ao buscar progresso: ${error}` });
  }
};
