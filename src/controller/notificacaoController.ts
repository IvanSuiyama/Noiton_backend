import { Request, Response } from 'express';
import { criarNotificacao, listarNotificacoesPorUsuario } from '../service/notificacaoService';

export const criarNotificacaoController = async (req: Request, res: Response) => {
  const { id_tarefa, mensagem } = req.body;
  if (!id_tarefa || !mensagem) {
    return res.status(400).json({ error: 'id_tarefa e mensagem são obrigatórios.' });
  }
  const notificacao = await criarNotificacao(id_tarefa, mensagem);
  if (notificacao) {
    return res.status(201).json(notificacao);
  } else {
    return res.status(500).json({ error: 'Erro ao criar notificação.' });
  }
};

export const listarNotificacoesController = async (req: Request, res: Response) => {
  const cpf = req.query.cpf || (req as any).user?.cpf;
  if (!cpf) {
    return res.status(401).json({ error: 'Usuário não autenticado.' });
  }
  const notificacoes = await listarNotificacoesPorUsuario(String(cpf));
  return res.status(200).json(notificacoes);
};
