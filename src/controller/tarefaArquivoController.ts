import { Request, Response } from 'express';
import pool from '../config/database';
import path from 'path';
import fs from 'fs';
import { salvarArquivoTarefa, listarArquivosPorTarefa, deletarArquivoTarefa } from '../service/tarefaArquivoService';

// Upload de arquivo PDF
export const uploadArquivoTarefa = async (req: Request, res: Response): Promise<void> => {
  const { id_tarefa } = req.params;
  const file = req.file as Express.Multer.File | undefined;
  if (!file || !id_tarefa) {
    res.status(400).json({ error: 'Arquivo PDF e id_tarefa são obrigatórios.' });
    return;
  }
  try {
    const arquivo = await salvarArquivoTarefa(
      pool,
      Number(id_tarefa),
      file.originalname,
      file.path
    );
    res.status(201).json(arquivo);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar arquivo.' });
  }
};

// Listar arquivos de uma tarefa
export const listarArquivosTarefa = async (req: Request, res: Response) => {
  const { id_tarefa } = req.params;
  try {
    const arquivos = await listarArquivosPorTarefa(pool, Number(id_tarefa));
    res.status(200).json(arquivos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar arquivos.' });
  }
};

// Baixar arquivo
export const downloadArquivoTarefa = async (req: Request, res: Response) => {
  const { caminho } = req.query;
  if (!caminho) return res.status(400).json({ error: 'Caminho do arquivo é obrigatório.' });
  const filePath = path.resolve(String(caminho));
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Arquivo não encontrado.' });
  res.download(filePath);
};

// Deletar arquivo
export const deletarArquivo = async (req: Request, res: Response) => {
  const { id_arquivo } = req.params;
  try {
    await deletarArquivoTarefa(pool, Number(id_arquivo));
    res.status(200).json({ message: 'Arquivo deletado com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar arquivo.' });
  }
};
