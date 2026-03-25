/**
 * Servicio de base de datos SQLite
 * Maneja la conexión y queries básicas usando better-sqlite3
 */

const Database = require('better-sqlite3');
const dbConfig = require('../config/database.config');

class DatabaseService {
  constructor() {
    this.db = null;
  }

  /**
   * Conectar a la base de datos
   */
  connect() {
    if (!this.db) {
      console.log(`Conectando a base de datos: ${dbConfig.dbPath}`);
      this.db = new Database(dbConfig.dbPath, dbConfig.options);

      // Configurar opciones de rendimiento
      this.db.pragma('journal_mode = WAL');
      this.db.pragma('synchronous = NORMAL');

      console.log('✓ Base de datos conectada exitosamente');
    }
    return this.db;
  }

  /**
   * Obtener instancia de base de datos
   */
  getDb() {
    if (!this.db) {
      this.connect();
    }
    return this.db;
  }

  /**
   * Cerrar conexión
   */
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
      console.log('✓ Base de datos desconectada');
    }
  }

  /**
   * Ejecutar query SELECT y retornar todas las filas
   */
  all(sql, params = []) {
    const db = this.getDb();
    const stmt = db.prepare(sql);
    return stmt.all(...params);
  }

  /**
   * Ejecutar query SELECT y retornar una sola fila
   */
  get(sql, params = []) {
    const db = this.getDb();
    const stmt = db.prepare(sql);
    return stmt.get(...params);
  }

  /**
   * Ejecutar query INSERT/UPDATE/DELETE
   */
  run(sql, params = []) {
    const db = this.getDb();
    const stmt = db.prepare(sql);
    return stmt.run(...params);
  }
}

// Exportar instancia singleton
module.exports = new DatabaseService();
