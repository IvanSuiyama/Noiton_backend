import { Connection } from 'mysql2';

export interface Workspace {
  id_workspace: number;
  nome: string;
  cpf: string;
}

export const createWorkspaceTable = (db: Connection) => {
  const query = `
    CREATE TABLE IF NOT EXISTS workspaces (
      id_workspace INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      cpf VARCHAR(11) NOT NULL,
      FOREIGN KEY (cpf) REFERENCES usuarios(cpf)
    );
  `;

  db.query(query, (err) => {
    if (err) {
      console.error('Erro ao criar a tabela de workspaces:', err);
    }
  });
};

export const createWorkspaceUsuariosTable = (db: Connection) => {
  const query = `
    CREATE TABLE IF NOT EXISTS workspace_usuarios (
      id_workspace INT NOT NULL,
      cpf VARCHAR(11) NOT NULL,
      PRIMARY KEY (id_workspace, cpf),
      FOREIGN KEY (id_workspace) REFERENCES workspaces(id_workspace),
      FOREIGN KEY (cpf) REFERENCES usuarios(cpf)
    );
  `;

  db.query(query, (err) => {
    if (err) {
      console.error('Erro ao criar a tabela workspace_usuarios:', err);
    }
  });
};

export const dropWorkspaceTable = (db: Connection) => {
  const query = `
    DROP TABLE IF EXISTS workspaces;
  `;

  db.query(query, (err) => {
    if (err) {
      console.error('Erro ao excluir tabela:', err);
    }
  });
};

export const dropWorkspaceUsuariosTable = (db: Connection) => {
  const query = `DROP TABLE IF EXISTS workspace_usuarios;`;

  db.query(query, (err) => {
    if (err) {
      console.error('Erro ao excluir a tabela workspace_usuarios:', err);
    }
  });
};
