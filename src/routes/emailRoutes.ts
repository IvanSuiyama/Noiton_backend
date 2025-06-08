import { Router } from 'express';
import { forcarMonitoramento } from '../controller/emailController';

const router = Router();

const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/monitorar-emails', asyncHandler(forcarMonitoramento));

export default router;
