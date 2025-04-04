import express from 'express';
import { createUsuarioTable } from './model/usuarioModel';
import { createWorkspaceTable } from './model/workModel';
import { CreateTarefaTable } from './model/tarefasModel';
import { createCategoriaTable } from './model/categoriaModel';
import connection from './config/database';
import workspaceRoutes from './routes/workspaceRoutes';
import usuarioRoutes from './routes/usuarioRoutes';
import tarefaRoutes from './routes/tarefaRoutes';
import categoriaRoutes from './routes/categoriaRoutes';
// import { AuthMiddleware } from './middleware/authMiddleware';

const app = express();
const port = parseInt(process.env.PORT || '4000', 10); // Converta para número

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
    console.log('Criando tabela "workspaces"...');
    createWorkspaceTable(connection);

    console.log('Criando tabela "usuario"...');
    createUsuarioTable(connection);

    console.log('Criando tabela "categorias"...');
    createCategoriaTable(connection);

    console.log('Criando tabela "tarefas"...');
    CreateTarefaTable(connection);

  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
  }
});

// const server = app.listen(port, '192.168.15.12', () => {
//   console.log(`Servidor rodando em http://192.168.15.12:${port}`); // IP WiFi
// });

const server = app.listen(port, '192.168.247.119', () => {
  console.log(`Servidor rodando em http://192.168.247.119:${port}`); // IP celular
});

server.on('error', (err) => {
  const error = err as NodeJS.ErrnoException; // Use type assertion para acessar 'code'
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
