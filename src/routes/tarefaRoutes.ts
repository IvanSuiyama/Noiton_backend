import { Router } from 'express';
import { createTarefa, updateTarefa, listTarefas, deleteTarefa } from '../controller/tarefaController';

const router = Router();

const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/tarefa', asyncHandler(createTarefa));
router.put('/tarefa/:id', asyncHandler(updateTarefa));
router.put('/tarefa/:id/status', asyncHandler(updateTarefa));
router.get('/tarefa/list', asyncHandler(listTarefas));
router.delete('/tarefa/:id', asyncHandler(deleteTarefa));

export default router;
