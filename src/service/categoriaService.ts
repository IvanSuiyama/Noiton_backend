import { Connection } from 'mysql2';

export const cadastrarCategoria = (db: Connection, nome: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO categorias (nome) VALUES (?)';
    db.query(query, [nome], (err) => {
      if (err) {
        return reject(`Erro ao cadastrar a categoria: ${err.message}`);
      }
      resolve();
    });
  });
};

export const excluirCategoria = (db: Connection, id_categoria: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM categorias WHERE id_categoria = ?';
    db.query(query, [id_categoria], (err) => {
      if (err) {
        return reject(`Erro ao excluir a categoria: ${err.message}`);
      }
      resolve();
    });
  });
};

export const editarNomeCategoria = (db: Connection, id_categoria: number, novoNome: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE categorias SET nome = ? WHERE id_categoria = ?';
    db.query(query, [novoNome, id_categoria], (err) => {
      if (err) {
        return reject(`Erro ao editar o nome da categoria: ${err.message}`);
      }
      resolve();
    });
  });
};

export const obterCategoriaPorId = (db: Connection, id_categoria: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM categorias WHERE id_categoria = ?';
    db.query(query, [id_categoria], (err, results) => {
      if (err) {
        return reject(`Erro ao obter a categoria: ${err.message}`);
      }
      resolve((results as any[])[0]); // Asserção de tipo para acessar o primeiro elemento
    });
  });
};

export const listarCategorias = (db: Connection): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM categorias';
    db.query(query, (err, results) => {
      if (err) {
        return reject(`Erro ao listar as categorias: ${err.message}`);
      }
      resolve(results as any[]); // Asserção de tipo para informar que results é um array
    });
  });
};
