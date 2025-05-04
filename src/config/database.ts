import mysql from 'mysql2';
import * as url from 'url';


const connectionString = 'mysql://root:ErQflSPsSeTWgCTlZamKitkEgOeBunIU@nozomi.proxy.rlwy.net:38458/railway';


const parsedUrl = url.parse(connectionString);


const username = parsedUrl.auth?.split(':')[0] || '';
const password = parsedUrl.auth?.split(':')[1] || '';
const host = parsedUrl.hostname || '';
const port = parsedUrl.port || '3306';
const database = parsedUrl.pathname?.substring(1) || '';


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

