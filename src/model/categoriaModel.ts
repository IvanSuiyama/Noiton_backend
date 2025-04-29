import { Connection } from 'mysql2';


export interface Categoria {
  id_categoria: number;
  nome: string;
}


export const createCategoriaTable = (db: Connection) => {
  const query = `
    CREATE TABLE IF NOT EXISTS categorias (
      id_categoria INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(255) NOT NULL
    );
  `;

  db.query(query, (err) => {
    if (err) {
      console.error('Erro ao criar a tabela de categorias:', err);
    }
  });
};


export const dropCategoriaTable = (db: Connection) => {
  const query = `DROP TABLE IF EXISTS categorias;`;

  db.query(query, (err) => {
    if (err) {
      console.error('Erro ao excluir a tabela de categorias:', err);
    }
  });
};
