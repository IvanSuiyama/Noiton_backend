import { Connection } from 'mysql2';

interface Tarefa {
  id_categoria?: number;
  id_workspace?: number;
  titulo: string;
  data_inicio: Date;
  data_fim?: Date;
  conteudo?: string;
  status?: string;
}

export const cadastrarTarefa = (db: Connection, tarefa: Tarefa): Promise<void> => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO tarefas (id_categoria, id_workspace, titulo, data_inicio, data_fim, conteudo, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [tarefa.id_categoria, tarefa.id_workspace, tarefa.titulo, tarefa.data_inicio, tarefa.data_fim, tarefa.conteudo, tarefa.status], (err) => {
      if (err) {
        return reject(`Erro ao cadastrar a tarefa: ${err.message}`);
      }
      resolve();
    });
  });
};

export const editarTarefa = (db: Connection, id_tarefa: number, tarefa: Tarefa): Promise<void> => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE tarefas
      SET id_categoria = ?, id_workspace = ?, titulo = ?, data_inicio = ?, data_fim = ?, conteudo = ?, status = ?
      WHERE id_tarefa = ?
    `;
    db.query(query, [tarefa.id_categoria, tarefa.id_workspace, tarefa.titulo, tarefa.data_inicio, tarefa.data_fim, tarefa.conteudo, tarefa.status, id_tarefa], (err) => {
      if (err) {
        return reject(`Erro ao editar a tarefa: ${err.message}`);
      }
      resolve();
    });
  });
};

export const listarTarefas = (db: Connection): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM tarefas';
    db.query(query, (err, results) => {
      if (err) {
        return reject(`Erro ao listar as tarefas: ${err.message}`);
      }
      resolve(results as any[]); // Asserção de tipo para informar que results é um array
    });
  });
};

export const excluirTarefa = (db: Connection, id_tarefa: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM tarefas WHERE id_tarefa = ?';
    db.query(query, [id_tarefa], (err) => {
      if (err) {
        return reject(`Erro ao excluir a tarefa: ${err.message}`);
      }
      resolve();
    });
  });
};
