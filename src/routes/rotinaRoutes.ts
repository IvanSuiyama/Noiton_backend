import { Router } from 'express';
import {
  createRotina,
  listRotinas,
  deleteRotina,
  getRotinaById
} from '../controller/rotinaController';

const router = Router();

const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/rotinas', asyncHandler(createRotina));
router.get('/rotinas', asyncHandler(listRotinas));
router.delete('/rotinas/:id', asyncHandler(deleteRotina));
router.get('/rotinas/:id', asyncHandler(getRotinaById));

export default router;
