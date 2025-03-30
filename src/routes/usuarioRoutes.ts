import { Router } from 'express';
import * as usuarioController from '../controller/usuarioController';

const router = Router();

router.post('/usuario', usuarioController.cadastrarUsuario);
router.post('/login', usuarioController.loginUsuario);
router.put('/usuario/:cpf', usuarioController.atualizarUsuario);
router.delete('/usuario/:cpf', usuarioController.deletarUsuario);
router.get('/usuario/:cpf/workspace', usuarioController.verificarWorkspaceUsuario);

export default router;
