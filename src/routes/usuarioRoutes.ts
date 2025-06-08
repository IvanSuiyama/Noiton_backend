import { Router } from 'express';
import * as usuarioController from '../controller/usuarioController';

const router = Router();

const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/usuario', usuarioController.cadastrarUsuario);
router.post('/login', usuarioController.loginUsuario);
router.put('/usuario/:cpf', usuarioController.atualizarUsuario);
router.delete('/usuario/:cpf', usuarioController.deletarUsuario);
router.get('/usuario/:cpf/workspace', usuarioController.verificarWorkspaceUsuario);
router.get('/usuario/list', usuarioController.listarUsuarios);
router.get('/usuario/:cpf', usuarioController.buscarUsuarioPorCPF);
router.get('/usuario/por-email/:email', asyncHandler(usuarioController.buscarUsuarioPorEmail));

export default router;
