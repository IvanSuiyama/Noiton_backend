import express from 'express';
import usuarioRoutes from './routes/usuarioRoutes';
import tarefaRoutes from './routes/tarefaRoutes';
import categoriaRoutes from './routes/categoriaRoutes';
import pool from './config/database';
import { createUsuarioTable, dropUsuarioTable } from './model/usuarioModel';
import { createCategoriaTable, dropCategoriaTable } from './model/categoriaModel';
import { CreateTarefaTable, createUsuarioTarefasTable, dropTarefaTable, dropUsuarioTarefasTable } from './model/tarefasModel';
import { AuthMiddleware } from './middleware/authMiddleware';

const app = express();
const port = parseInt(process.env.PORT || '4000', 10);

async function createTables() {
  await createUsuarioTable(pool);
  await createCategoriaTable(pool);
  await CreateTarefaTable(pool);
  await createUsuarioTarefasTable(pool);
}

// Função para excluir tabelas na ordem correta (inversa)
/// Descomente para usar quando necessário
// async function dropTables() {
//   await dropUsuarioTarefasTable(pool);
//   await dropTarefaTable(pool);
//   await dropCategoriaTable(pool);
//   await dropUsuarioTable(pool);
// }

createTables().then(() => {
  console.log('Tabelas criadas com sucesso!');
}).catch((err) => {
  console.error('Erro ao criar tabelas:', err);
});

// // Para excluir as tabelas, descomente e execute a função abaixo:
// dropTables().then(() => {
//   console.log('Tabelas excluídas com sucesso!');
// }).catch((err) => {
//   console.error('Erro ao excluir tabelas:', err);
// });

app.use(express.json());

// Rotas públicas (não exigem autenticação)
app.use('/api', usuarioRoutes);

// Rotas protegidas (exigem autenticação)
app.use(AuthMiddleware);
app.use('/api', categoriaRoutes);
app.use('/api', tarefaRoutes);



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


