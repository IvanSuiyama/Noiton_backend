import express from 'express';
import { createUsuarioTable, dropUsuarioTable } from './model/usuarioModel';
import { createWorkspaceTable, dropworkspace_tarefasTable, dropWorkspaceTable, dropWorkspaceUsuariosTable } from './model/workModel';
import { createWorkspaceUsuariosTable } from './model/workModel';
import { CreateTarefaTable, dropTarefaTable } from './model/tarefasModel';
import { createCategoriaTable, dropCategoriaTable } from './model/categoriaModel';
import connection from './config/database';
import workspaceRoutes from './routes/workspaceRoutes';
import usuarioRoutes from './routes/usuarioRoutes';
import tarefaRoutes from './routes/tarefaRoutes';
import categoriaRoutes from './routes/categoriaRoutes';
// import { AuthMiddleware } from './middleware/authMiddleware';

const app = express();
const port = parseInt(process.env.PORT || '4000', 10);

app.use(express.json());
// app.use(AuthMiddleware); // Aplicar middleware de autenticação
app.use('/api', workspaceRoutes);
app.use('/api', usuarioRoutes);
app.use('/api', categoriaRoutes);
app.use('/api', tarefaRoutes);

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar no banco de dados:', err);
    return;
  }
  console.log('Conectado com sucesso no banco de dados');

  try {
    // console.log('Excluindo tabelas existentes...');
    // dropworkspace_tarefasTable(connection); // Tabela que depende de tarefas e workspaces
    // dropTarefaTable(connection); // Tabela que depende de categorias e workspaces
    // dropWorkspaceUsuariosTable(connection); // Tabela que depende de workspaces e usuários
    // dropWorkspaceTable(connection); // Tabela que depende de usuários
    // dropCategoriaTable(connection); // Tabela independente
    // dropUsuarioTable(connection); // Tabela independente

    console.log('Criando tabelas...');
    createUsuarioTable(connection); // Tabela independente
    createCategoriaTable(connection); // Tabela independente
    createWorkspaceTable(connection); // Tabela que depende de usuários
    createWorkspaceUsuariosTable(connection); // Tabela que depende de workspaces e usuários
    CreateTarefaTable(connection); // Tabela que depende de categorias e workspaces

  } catch (error) {
    console.error('Erro ao recriar tabelas:', error);
  }
});

const server = app.listen(port, '192.168.15.5', () => {
  console.log(`Servidor rodando em http://192.168.15.5:${port}`); // IP WiFi
});

// const server = app.listen(port, '192.168.247.119', () => {
//   console.log(`Servidor rodando em http://192.168.247.119:${port}`); // IP celular
// });

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


