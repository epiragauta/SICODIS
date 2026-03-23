/**
 * Configuración de conexión a base de datos SQLite
 */

const path = require('path');

const config = {
  // Ruta a la base de datos
  dbPath: process.env.DB_PATH || path.join(__dirname, '..', '..', '..', 'src', 'assets', 'db', 'eficiencias.db'),

  // Opciones de SQLite
  options: {
    verbose: process.env.NODE_ENV === 'development' ? console.log : null,
    fileMustExist: true
  }
};

module.exports = config;
