import { Router, Request, Response, NextFunction } from 'express';
import multer, { StorageEngine } from 'multer';
import path from 'path';
import { uploadArquivoTarefa, listarArquivosTarefa, downloadArquivoTarefa, deletarArquivo } from '../controller/tarefaArquivoController';

const router = Router();

const storage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, path.resolve('uploads'));
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

router.post('/tarefa/:id_tarefa/upload', upload.single('pdf'), asyncHandler(uploadArquivoTarefa));
router.get('/tarefa/:id_tarefa/arquivos', asyncHandler(listarArquivosTarefa));
router.get('/tarefa/arquivo/download', asyncHandler(downloadArquivoTarefa));
router.delete('/tarefa/arquivo/:id_arquivo', asyncHandler(deletarArquivo));

export default router;
