import { Router } from 'express';
import { createWorkspace, checkUserLoggedIn, updateWorkspaceName, deleteWorkspace } from '../controller/workspaceController';

const router = Router();

const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.use('/workspace', (req, res, next) => {
  router.post('/workspace', asyncHandler(createWorkspace));
  router.post('/checkuser', asyncHandler(checkUserLoggedIn));
  router.put('workspace/:id', asyncHandler(updateWorkspaceName));
  router.delete('workspace/:id', asyncHandler(deleteWorkspace));
  next();
});

export default router;
