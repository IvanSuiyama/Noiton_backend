import { Connection } from 'mysql2';

// Define a interface para o modelo de usuário
export interface Usuario {
  cpf: string;
  email: string;
  nome: string;
  telefone: string;
  senha: string;
  id_workspace: number;
}

// Função para criar a tabela de usuários, caso ainda não exista
export const createUsuarioTable = (db: Connection) => {
  const query = `
    CREATE TABLE IF NOT EXISTS usuarios (
      cpf VARCHAR(11) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      nome VARCHAR(255) NOT NULL,
      telefone VARCHAR(20),
      senha VARCHAR(255) NOT NULL,
      id_workspace INT,
      FOREIGN KEY (id_workspace) REFERENCES workspaces(id_workspace)
    );
  `;

  db.query(query, (err) => {
    if (err) {
      console.error('Erro ao criar a tabela de usuários:', err);
    }
  });
};
