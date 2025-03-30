import { Connection } from 'mysql2';

// Define a interface para o modelo de workspace
export interface Workspace {
  id_workspace: number;
  nome: string;
}

// Função para criar a tabela de workspaces, caso ainda não exista
export const createWorkspaceTable = (db: Connection) => {
  const query = `
    CREATE TABLE IF NOT EXISTS workspaces (
      id_workspace INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(255) NOT NULL
    );
  `;

  db.query(query, (err) => {
    if (err) {
      console.error('Erro ao criar a tabela de workspaces:', err);
    }
  });
};
