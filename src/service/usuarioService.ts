import { Connection } from 'mysql2';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Lógica para validar CPF com dígitos verificadores
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

// Função para verificar se o email já está cadastrado
export const verificarEmailCadastrado = (db: Connection, email: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT COUNT(*) AS count FROM usuarios WHERE email = ?';
    db.query(query, [email], (err, results: any) => {
      if (err) return reject(`Erro ao verificar email: ${err.message}`);
      resolve(results[0].count > 0);
    });
  });
};

// Função para criptografar a senha
export const criptografarSenha = (senha: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(senha, 10, (err, hash) => {
      if (err) return reject('Erro ao criptografar a senha.');
      resolve(hash);
    });
  });
};

// Função para cadastrar um novo usuário
export const cadastrarUsuario = (db: Connection, usuario: any): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!validarCPF(usuario.cpf)) {
        return reject('CPF inválido.');
      }

      const emailCadastrado = await verificarEmailCadastrado(db, usuario.email);
      if (emailCadastrado) {
        return reject('Email já cadastrado.');
      }

      const hash = await criptografarSenha(usuario.senha);

      const query = `
        INSERT INTO usuarios (cpf, email, nome, telefone, senha, id_workspace)
        VALUES (?, ?, ?, ?, ?, NULL)
      `;
      db.query(query, [usuario.cpf, usuario.email, usuario.nome, usuario.telefone, hash], (err) => {
        if (err) return reject(`Erro ao cadastrar o usuário: ${err.message}`);
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
};


export const loginUsuario = (db: Connection, email: string, senha: string): Promise<{ token: string; cpf: string }> => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT cpf, senha FROM usuarios WHERE email = ?';
    db.query(query, [email], (err, results: any) => {
      if (err) return reject(`Erro ao buscar o usuário: ${err.message}`);
      if (results.length === 0) return reject('Usuário não encontrado.');

      const { cpf, senha: hashedSenha } = results[0];
      bcrypt.compare(senha, hashedSenha, (err, isMatch) => {
        if (err || !isMatch) return reject('Senha incorreta.');
        const token = jwt.sign({ email, cpf }, 'secreto', { expiresIn: '1h' });
        resolve({ token, cpf });
      });
    });
  });
};

// Função para atualizar um usuário
export const atualizarUsuario = (db: Connection, cpf: string, dados: any): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { email, nome, telefone, senha } = dados;

      let query = `
        UPDATE usuarios
        SET email = ?, nome = ?, telefone = ?
      `;
      const params: any[] = [email, nome, telefone];

      if (senha) {
        const hash = await criptografarSenha(senha);
        query += `, senha = ?`;
        params.push(hash);
      }

      query += ` WHERE cpf = ?`;
      params.push(cpf);

      db.query(query, params, (err) => {
        if (err) return reject(`Erro ao atualizar o usuário: ${err.message}`);
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Função para deletar um usuário
export const deletarUsuario = (db: Connection, cpf: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM usuarios WHERE cpf = ?';
    db.query(query, [cpf], (err) => {
      if (err) return reject(`Erro ao deletar o usuário: ${err.message}`);
      resolve();
    });
  });
};

// Função para verificar se o usuário possui workspace atrelado
export const verificarWorkspaceUsuario = (db: Connection, cpf: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT id_workspace FROM usuarios WHERE cpf = ?';
    db.query(query, [cpf], (err, results: any) => {
      if (err) return reject(`Erro ao verificar workspace: ${err.message}`);
      resolve(!!results[0]?.id_workspace);
    });
  });
};

// Função para listar todos os usuários
export const listarUsuarios = (db: Connection): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM usuarios';
    db.query(query, (err, results: any) => {
      if (err) return reject(`Erro ao listar usuários: ${err.message}`);
      resolve(results);
    });
  });
};

// Função para buscar os dados de um usuário pelo CPF
export const buscarUsuarioPorCPF = (db: Connection, cpf: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM usuarios WHERE cpf = ?';
    db.query(query, [cpf], (err, results: any) => {
      if (err) return reject(`Erro ao buscar o usuário: ${err.message}`);
      if (results.length === 0) return reject('Usuário não encontrado.');
      resolve(results[0]);
    });
  });
};
