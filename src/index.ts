import 'dotenv/config';
import express from 'express';
import usuarioRoutes from './routes/usuarioRoutes';
import tarefaRoutes from './routes/tarefaRoutes';
import categoriaRoutes from './routes/categoriaRoutes';
import rotinaRoutes from './routes/rotinaRoutes';
import notificacaoRoutes from './routes/notificacaoRoutes';
import emailRoutes from './routes/emailRoutes';
import tarefaArquivoRoutes from './routes/tarefaArquivoRoutes';
import usuarioProgressoRoutes from './routes/usuarioProgressoRoutes';
import pool from './config/database';
import { createUsuarioTable, dropUsuarioTable } from './model/usuarioModel';
import { createCategoriaTable, dropCategoriaTable, createCategoriaTarefasTable, dropCategoriaTarefasTable } from './model/categoriaModel';
import { CreateTarefaTable, createUsuarioTarefasTable, dropTarefaTable, dropUsuarioTarefasTable, createRotinasTable, dropRotinasTable } from './model/tarefasModel';
import { createNotificacoesTable, dropNotificacoesTable } from './model/notificacaoModel';
import { AuthMiddleware } from './middleware/authMiddleware';
import { monitorarNotificacoes } from './controller/emailController';
import { createTarefaArquivosTable, dropTarefaArquivosTable } from './model/tarefaArquivoModel';
import { createUsuarioProgressoTable, dropUsuarioProgressoTable } from './model/usuarioProgressoModel';

const app = express();
const port = parseInt(process.env.PORT || '4000', 10);

async function createTables() {
  await createUsuarioTable(pool);
  await createCategoriaTable(pool);
  await CreateTarefaTable(pool);
  await createRotinasTable(pool); // <-- criar rotinas ANTES da usuario_tarefas
  await createUsuarioTarefasTable(pool);
  await createCategoriaTarefasTable(pool);
  await createNotificacoesTable(pool); // criar notificações por último
  await createTarefaArquivosTable(pool); // criar tabela de arquivos de tarefas
  await createUsuarioProgressoTable(pool); // criar progresso do usuário após usuários
}

// Função para excluir tabelas na ordem correta (inversa)
// / Descomente para usar quando necessário

async function dropTables() {
  await dropNotificacoesTable(pool); // dropar notificações primeiro
  await dropUsuarioTarefasTable(pool);
  await dropCategoriaTarefasTable(pool);
  await dropRotinasTable(pool); // <-- dropar rotinas ANTES de tarefas
  await dropTarefaArquivosTable(pool); // dropar arquivos antes de tarefas
  await dropTarefaTable(pool);
  await dropUsuarioProgressoTable(pool); // dropar progresso do usuário antes de usuarios
  await dropCategoriaTable(pool);
  await dropUsuarioTable(pool);
}

createTables().then(() => {
  console.log('Tabelas criadas com sucesso!');
}).catch((err) => {
  console.error('Erro ao criar tabelas:', err);
});



// dropTables().then(() => {
//   console.log('Tabelas excluídas com sucesso!');
// }).catch((err) => {
//   console.error('Erro ao excluir tabelas:', err);
// });

app.use(express.json());

// Rotas públicas (não exigem autenticação)
app.use('/api', usuarioRoutes);

app.use(AuthMiddleware);
app.use('/api', categoriaRoutes);
app.use('/api', tarefaRoutes);
app.use('/api', rotinaRoutes); // <-- adicionar rotinas
app.use('/api', notificacaoRoutes); // <-- adicionar rotas de notificações
app.use('/api', emailRoutes); // adicionar rotas de email
app.use('/api', tarefaArquivoRoutes); // adicionar rotas de arquivos de tarefas
app.use('/api', usuarioProgressoRoutes); // adicionar rotas de progresso do usuário

monitorarNotificacoes(); // inicia monitoramento automático



const server = app.listen(port, '192.168.85.119', () => {
  console.log(`Servidor rodando em http://192.168.85.119:${port}`);
});



server.on('error', (err) => {
  const error = err as NodeJS.ErrnoException;
  if (error.code === 'EADDRINUSE') {
    console.error(`Porta ${port} já está em uso. Tentando outra porta...`);
    const fallbackServer = app.listen(0, () => {
      const newPort = (fallbackServer.address() as any).port;
      console.log(`Servidor rodando na porta alternativa ${newPort}`);
    });
  } else {
    console.error('Erro ao iniciar o servidor:', error);
  }
});




