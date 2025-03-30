import { Router } from 'express';
import { createCategoria, deleteCategoria, updateCategoriaName, getCategoriaById, listCategorias } from '../controller/categoriaController';

const router = Router();

const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/categoria', asyncHandler(createCategoria));
router.delete('/categoria:id', asyncHandler(deleteCategoria));
router.put('/categoria:id', asyncHandler(updateCategoriaName));
router.get('/categoria:id', asyncHandler(getCategoriaById));
router.get('/categorialist', asyncHandler(listCategorias));

export default router;
