import { Connection } from 'mysql2';

// Função para cadastrar um novo workspace
export const cadastrarWorkspace = (db: Connection, nome: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO workspaces (nome) VALUES (?)';
    db.query(query, [nome], (err) => {
      if (err) {
        return reject(`Erro ao cadastrar o workspace: ${err.message}`);
      }
      resolve();
    });
  });
};

// Função para verificar se um usuário está logado no sistema
export const verificarUsuarioLogado = (db: Connection, cpf: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT COUNT(*) AS count FROM usuarios WHERE cpf = ?';
    db.query(query, [cpf], (err, results: any) => {
      if (err) {
        return reject(`Erro ao verificar se o usuário está logado: ${err.message}`);
      }
      const count = results[0]?.count || 0; // Corrige o acesso ao primeiro elemento
      resolve(count > 0);
    });
  });
};

// Função para editar o nome de um workspace
export const editarNomeWorkspace = (db: Connection, id_workspace: number, novoNome: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE workspaces SET nome = ? WHERE id_workspace = ?';
    db.query(query, [novoNome, id_workspace], (err) => {
      if (err) {
        return reject(`Erro ao editar o nome do workspace: ${err.message}`);
      }
      resolve();
    });
  });
};

// Função para excluir um workspace
export const excluirWorkspace = (db: Connection, id_workspace: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM workspaces WHERE id_workspace = ?';
    db.query(query, [id_workspace], (err) => {
      if (err) {
        return reject(`Erro ao excluir o workspace: ${err.message}`);
      }
      resolve();
    });
  });
};
