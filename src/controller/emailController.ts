import { Request, Response } from 'express';
import { listarNotificacoes } from '../service/notificacaoService';
import { buscarUsuarioPorCPF } from '../service/usuarioService';
import { enviarEmail } from '../service/emailService';
import pool from '../config/database';

// Função para monitorar notificações e verificar envio de email
export async function monitorarNotificacoes() {
  let ultimoId = 0;
  setInterval(async () => {
    try {
      const notificacoes = await listarNotificacoes();
      // Filtra notificações novas
      const novas = notificacoes.filter(n => n.id > ultimoId);
      if (novas.length === 0) return; // Só envia email se houver novas notificações
      for (const notificacao of novas) {
        // Busca o usuário relacionado à tarefa
        const tarefa = await pool.query('SELECT * FROM tarefas WHERE id_tarefa = $1', [notificacao.id_tarefa]);
        if (tarefa.rows.length === 0) continue;
        const usuarioTarefa = await pool.query('SELECT cpf FROM usuario_tarefas WHERE id_tarefa = $1', [notificacao.id_tarefa]);
        if (usuarioTarefa.rows.length === 0) continue;
        const cpf = usuarioTarefa.rows[0].cpf;
        const usuario = await buscarUsuarioPorCPF(pool, cpf);
        if (!usuario || !usuario.email) continue;
        // Tenta enviar email
        const enviado = await enviarEmail({
          to: usuario.email,
          subject: 'Nova Notificação',
          text: notificacao.mensagem,
        });
        if (enviado) {
          console.log(`email recebido: ${usuario.email}`);
        } else {
          console.log(`email não recebido: ${usuario.email}`);
        }
      }
      if (novas.length > 0) {
        ultimoId = Math.max(...novas.map(n => n.id));
      }
    } catch (err) {
      console.error('Erro ao monitorar notificações:', err);
    }
  }, 30 * 1000); // 30 segundos
}

// Controller opcional para forçar monitoramento manual
export const forcarMonitoramento = async (_req: Request, res: Response) => {
  try {
    await monitorarNotificacoes();
    res.status(200).json({ message: 'Monitoramento iniciado.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao iniciar monitoramento.' });
  }
};
