import { Router } from 'express';
import { criarNotificacaoController, listarNotificacoesController } from '../controller/notificacaoController';

const router = Router();

const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/notificacoes', asyncHandler(criarNotificacaoController));
router.get('/notificacoes', asyncHandler(listarNotificacoesController));

export default router;
