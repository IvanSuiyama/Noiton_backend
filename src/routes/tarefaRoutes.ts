import { Router } from 'express';
import { createTarefa, updateTarefa, listTarefas, deleteTarefa, getTarefaById, updateTarefaStatus, getSubtarefas } from '../controller/tarefaController';

const router = Router();

const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/tarefa', asyncHandler(createTarefa));
router.put('/tarefa/:id', asyncHandler(updateTarefa));
router.put('/tarefa/:id/status', asyncHandler(updateTarefaStatus));
router.get('/tarefa/list', asyncHandler(listTarefas));
router.delete('/tarefa/:id', asyncHandler(deleteTarefa));
router.get('/tarefa/:id', asyncHandler(getTarefaById));
router.get('/tarefa/:id/subtarefas', asyncHandler(getSubtarefas));

export default router;
