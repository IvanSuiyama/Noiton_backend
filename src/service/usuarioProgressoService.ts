import { Pool } from 'pg';

export const getUsuarioProgresso = async (db: Pool, cpf: string) => {
  const query = 'SELECT * FROM usuario_progresso WHERE cpf = $1';
  const result = await db.query(query, [cpf]);
  return result.rows[0];
};

export const inicializarProgressoUsuario = async (db: Pool, cpf: string) => {
  const query = `INSERT INTO usuario_progresso (cpf, tarefas_criadas, tarefas_concluidas, tarefas_apagadas, tarefas_em_aberto, datas_criacao, datas_conclusao, datas_exclusao)
    VALUES ($1, 0, 0, 0, 0, ARRAY[]::timestamp[], ARRAY[]::timestamp[], ARRAY[]::timestamp[])
    ON CONFLICT (cpf) DO NOTHING;`;
  await db.query(query, [cpf]);
};

export const atualizarProgresso = async (db: Pool, cpf: string, campo: string, data: Date) => {
  // campo: 'criadas', 'concluidas', 'apagadas', 'em_aberto'
  let setClause = '';
  let arrayField = '';
  if (campo === 'criadas') {
    setClause = 'tarefas_criadas = tarefas_criadas + 1, tarefas_em_aberto = tarefas_em_aberto + 1';
    arrayField = 'datas_criacao';
  } else if (campo === 'concluidas') {
    setClause = 'tarefas_concluidas = tarefas_concluidas + 1, tarefas_em_aberto = tarefas_em_aberto - 1';
    arrayField = 'datas_conclusao';
  } else if (campo === 'apagadas') {
    setClause = 'tarefas_apagadas = tarefas_apagadas + 1, tarefas_em_aberto = GREATEST(tarefas_em_aberto - 1, 0)';
    arrayField = 'datas_exclusao';
  }
  if (setClause && arrayField) {
    const query = `UPDATE usuario_progresso SET ${setClause}, ${arrayField} = array_append(${arrayField}, $2) WHERE cpf = $1`;
    await db.query(query, [cpf, data]);
  }
};
