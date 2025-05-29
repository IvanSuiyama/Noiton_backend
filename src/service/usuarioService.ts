import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const validarCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/[^\d]/g, ''); // Remove caracteres não numéricos
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  const calcularDigito = (base: string, pesoInicial: number): number => {
    const soma = base.split('').reduce((acc, num, idx) => acc + parseInt(num) * (pesoInicial - idx), 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const base = cpf.slice(0, 9);
  const digito1 = calcularDigito(base, 10);
  const digito2 = calcularDigito(base + digito1, 11);

  return cpf === base + digito1 + digito2;
};


export const verificarEmailCadastrado = async (db: Pool, email: string): Promise<boolean> => {
  const query = 'SELECT COUNT(*) FROM usuarios WHERE email = $1';
  const result = await db.query(query, [email]);
  return parseInt(result.rows[0].count, 10) > 0;
};


export const criptografarSenha = (senha: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(senha, 10, (err, hash) => {
      if (err) return reject('Erro ao criptografar a senha.');
      resolve(hash);
    });
  });
};


export const cadastrarUsuario = async (db: Pool, usuario: any): Promise<void> => {
  if (!validarCPF(usuario.cpf)) {
    throw 'CPF inválido.';
  }
  const emailCadastrado = await verificarEmailCadastrado(db, usuario.email);
  if (emailCadastrado) {
    throw 'Email já cadastrado.';
  }
  const hash = await criptografarSenha(usuario.senha);
  const query = `
    INSERT INTO usuarios (cpf, email, nome, telefone, senha)
    VALUES ($1, $2, $3, $4, $5)
  `;
  await db.query(query, [usuario.cpf, usuario.email, usuario.nome, usuario.telefone, hash]);
};


export const loginUsuario = async (db: Pool, email: string, senha: string): Promise<{ token: string; cpf: string }> => {
  const query = 'SELECT cpf, senha FROM usuarios WHERE email = $1';
  const result = await db.query(query, [email]);
  if (result.rows.length === 0) throw 'Usuário não encontrado.';
  const { cpf, senha: hashedSenha } = result.rows[0];
  const isMatch = await bcrypt.compare(senha, hashedSenha);
  if (!isMatch) throw 'Senha incorreta.';
  const token = jwt.sign({ email, cpf }, process.env.JWT_SECRET || 'secreto', { expiresIn: '1h' });
  return { token, cpf };
};


export const atualizarUsuario = async (db: Pool, cpf: string, dados: any): Promise<void> => {
  const { email, nome, telefone, senha } = dados;
  let query = `
    UPDATE usuarios
    SET email = $1, nome = $2, telefone = $3
  `;
  const params: any[] = [email, nome, telefone];
  if (senha) {
    const hash = await criptografarSenha(senha);
    query += `, senha = $4 WHERE cpf = $5`;
    params.push(hash, cpf);
  } else {
    query += ` WHERE cpf = $4`;
    params.push(cpf);
  }
  await db.query(query, params);
};


export const deletarUsuario = async (db: Pool, cpf: string): Promise<void> => {
  const query = 'DELETE FROM usuarios WHERE cpf = $1';
  await db.query(query, [cpf]);
};


export const verificarWorkspaceUsuario = async (db: Pool, cpf: string): Promise<boolean> => {
  const query = 'SELECT COUNT(*) FROM workspace_usuarios WHERE cpf = $1';
  const result = await db.query(query, [cpf]);
  return parseInt(result.rows[0].count, 10) > 0;
};


export const listarUsuarios = async (db: Pool): Promise<any[]> => {
  const query = 'SELECT * FROM usuarios';
  const result = await db.query(query);
  return result.rows;
};


export const buscarUsuarioPorCPF = async (db: Pool, cpf: string): Promise<any> => {
  const query = 'SELECT * FROM usuarios WHERE cpf = $1';
  const result = await db.query(query, [cpf]);
  if (result.rows.length === 0) throw 'Usuário não encontrado.';
  return result.rows[0];
};
