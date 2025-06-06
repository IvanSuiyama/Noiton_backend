import { Pool } from 'pg';


export interface Categoria {
  id_categoria: number;
  nome: string;
  cpf_user: string; // novo campo
}


export const createCategoriaTable = async (db: Pool) => {
  const query = `
    CREATE TABLE IF NOT EXISTS categorias (
      id_categoria SERIAL PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      cpf_user VARCHAR(11) NOT NULL,
      FOREIGN KEY (cpf_user) REFERENCES usuarios(cpf)
    );
  `;
  try {
    await db.query(query);
  } catch (err) {
    console.error('Erro ao criar a tabela de categorias:', err);
  }
};


export const dropCategoriaTable = async (db: Pool) => {
  const query = `DROP TABLE IF EXISTS categorias CASCADE;`;
  try {
    await db.query(query);
  } catch (err) {
    console.error('Erro ao excluir a tabela de categorias:', err);
  }
};


export const createCategoriaTarefasTable = async (db: Pool) => {
  const query = `
    CREATE TABLE IF NOT EXISTS categoria_tarefas (
      id SERIAL PRIMARY KEY,
      id_categoria INTEGER NOT NULL,
      id_tarefa INTEGER NOT NULL,
      FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE CASCADE,
      FOREIGN KEY (id_tarefa) REFERENCES tarefas(id_tarefa) ON DELETE CASCADE
    );
  `;
  try {
    await db.query(query);
  } catch (err) {
    console.error('Erro ao criar a tabela categoria_tarefas:', err);
  }
};


export const dropCategoriaTarefasTable = async (db: Pool) => {
  const query = `DROP TABLE IF EXISTS categoria_tarefas;`;
  try {
    await db.query(query);
  } catch (err) {
    console.error('Erro ao excluir a tabela categoria_tarefas:', err);
  }
};
