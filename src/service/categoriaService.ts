import { Pool } from 'pg';


// Cadastrar categoria
export const cadastrarCategoria = async (db: Pool, nome: string): Promise<void> => {
  const query = 'INSERT INTO categorias (nome) VALUES ($1)';
  await db.query(query, [nome]);
};


// Excluir categoria
export const excluirCategoria = async (db: Pool, id_categoria: number): Promise<void> => {
  const query = 'DELETE FROM categorias WHERE id_categoria = $1';
  await db.query(query, [id_categoria]);
};


// Editar nome da categoria
export const editarNomeCategoria = async (db: Pool, id_categoria: number, novoNome: string): Promise<void> => {
  const query = 'UPDATE categorias SET nome = $1 WHERE id_categoria = $2';
  await db.query(query, [novoNome, id_categoria]);
};


// Obter categoria por ID
export const obterCategoriaPorId = async (db: Pool, id_categoria: number): Promise<any> => {
  const query = 'SELECT * FROM categorias WHERE id_categoria = $1';
  const result = await db.query(query, [id_categoria]);
  return result.rows[0];
};


// Listar categorias
export const listarCategorias = async (db: Pool): Promise<any[]> => {
  const query = 'SELECT * FROM categorias';
  const result = await db.query(query);
  return result.rows;
};


interface Categoria {
  nome: string;
  cpf_user: string;
}

export const criarCategoria = async (db: Pool, categoria: Categoria): Promise<number> => {
  const query = `
    INSERT INTO categorias (nome, cpf_user)
    VALUES ($1, $2)
    RETURNING id_categoria
  `;
  const result = await db.query(query, [categoria.nome, categoria.cpf_user]);
  return result.rows[0].id_categoria;
};

export const listarCategoriasPorUsuario = async (db: Pool, cpf_user: string): Promise<any[]> => {
  const query = 'SELECT * FROM categorias WHERE cpf_user = $1';
  const result = await db.query(query, [cpf_user]);
  return result.rows;
};
