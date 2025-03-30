import mysql from 'mysql2';
import * as url from 'url';

// Sua URL de conexão (substitua pela URL fornecida pelo Railway)
const connectionString = 'mysql://root:ErQflSPsSeTWgCTlZamKitkEgOeBunIU@nozomi.proxy.rlwy.net:38458/railway';

// Usando a URL para extrair as informações necessárias
const parsedUrl = url.parse(connectionString);

// Extrair as partes da URL
const username = parsedUrl.auth?.split(':')[0] || '';
const password = parsedUrl.auth?.split(':')[1] || '';
const host = parsedUrl.hostname || '';
const port = parsedUrl.port || '3306'; // O padrão para MySQL é 3306
const database = parsedUrl.pathname?.substring(1) || ''; // Remover a primeira barra

// Criando a conexão com as informações extraídas
const connection = mysql.createConnection({
  host: host,
  user: username,
  password: password,
  database: database,
  port: parseInt(port),
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar: ', err);
  } else {
    console.log('Conectado ao banco de dados!');
  }
});

export default connection;

