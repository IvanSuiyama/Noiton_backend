import { Router } from 'express';
import { getProgressoUsuario } from '../controller/usuarioProgressoController';

const router = Router();

const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/usuario/progresso', asyncHandler(getProgressoUsuario));

export default router;
