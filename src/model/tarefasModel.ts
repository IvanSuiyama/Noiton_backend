import { Connection } from "mysql2";

export interface Tarefa {
  id_tarefa: number;
  id_categoria: number;
  id_workspace: number;
  titulo: string;
  data_inicio: Date;
  data_fim: Date;
  conteudo: string;
  status: string;
}

export const CreateTarefaTable = (db: Connection) => {
  const query = `
    CREATE TABLE IF NOT EXISTS tarefas (
      id_tarefa INT AUTO_INCREMENT PRIMARY KEY,
      titulo VARCHAR(100) NOT NULL,
      data_inicio DATETIME NOT NULL,
      data_fim DATETIME,
        conteudo TEXT,
        status ENUM('pendente', 'em andamento', 'concluída') DEFAULT 'pendente',
        id_categoria INT,
        id_workspace INT,
        FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria),
       FOREIGN KEY (id_workspace) REFERENCES workspaces(id_workspace)
    );
  `;

  db.query(query, (err) => {
    if (err) {
      console.error("Erro ao criar a tabela de categorias:", err);
    }
  });
};
