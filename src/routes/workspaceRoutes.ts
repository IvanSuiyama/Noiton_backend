import express from 'express';
import {
  createWorkspace,
  checkUserLoggedIn,
  updateWorkspaceName,
  deleteWorkspace,
  getAllWorkspaces,
  getWorkspacesByCPF
} from '../controller/workspaceController';

const router = express.Router();


const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};


router.post('/workspace', asyncHandler(createWorkspace));
router.post('/checkuser', asyncHandler(checkUserLoggedIn));
router.put('/workspace/:id', asyncHandler(updateWorkspaceName)); 
router.delete('/workspace/:id', asyncHandler(deleteWorkspace)); 
router.get('/workspaces', asyncHandler(getAllWorkspaces));
router.get('/workspaces/:cpf', asyncHandler(getWorkspacesByCPF)); 

export default router;
