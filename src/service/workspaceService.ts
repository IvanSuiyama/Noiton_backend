import { Connection } from 'mysql2';


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


export const insertCPFtoWorkspace = (db: Connection, id_workspace: number, cpf: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO workspace_usuarios (id_workspace, cpf) VALUES (?, ?)';
    db.query(query, [id_workspace, cpf], (err) => {
      if (err) {
        return reject(`Erro ao associar o CPF ao workspace: ${err.message}`);
      }
      resolve();
    });
  });
};


export const getAllWorkspaces = (db: Connection): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM workspaces';
    db.query(query, (err, results: any) => {
      if (err) {
        return reject(`Erro ao buscar todos os workspaces: ${err.message}`);
      }
      resolve(results);
    });
  });
};


export const getWorkspacesByCPF = (db: Connection, cpf: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT w.*
      FROM workspaces w
      INNER JOIN workspace_usuarios wu ON w.id_workspace = wu.id_workspace
      WHERE wu.cpf = ?
    `;
    db.query(query, [cpf], (err, results: any) => {
      if (err) {
        return reject(`Erro ao buscar workspaces por CPF: ${err.message}`);
      }
      resolve(results);
    });
  });
};
