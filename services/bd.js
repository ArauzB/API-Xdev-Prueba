require('dotenv').config(); // Cargar variables de entorno desde .env

const mysql = require("mysql2");
const fs = require("fs");

const connectionConfig = {
  host: process.env.HOST,
  port: process.env.PORT_BD,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  ssl: {
    ca: fs.readFileSync(process.env.CA_PATH),
    rejectUnauthorized: true,
  },
};

const prueba = async () => {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    console.log("Conexión exitosa a la base de datos MySQL.");
    return connection;
  } catch (error) {
    console.error("Error al conectar a la base de datos MySQL:", error);
    throw error;
  }
};

const connection = mysql.createConnection(connectionConfig);

module.exports = { connection, prueba };
