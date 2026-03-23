/**
 * Punto de entrada del servidor Express
 * Backend API REST para datos de eficiencias fiscales y administrativas
 */

require('dotenv').config();
const app = require('./src/app');
const db = require('./src/services/database.service');

const PORT = process.env.PORT || 3000;

// Conectar a la base de datos
try {
  db.connect();
} catch (error) {
  console.error('Error conectando a la base de datos:', error);
  process.exit(1);
}

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log('='.repeat(80));
  console.log('SICODIS - API de Eficiencias Fiscales y Administrativas');
  console.log('='.repeat(80));
  console.log(`✓ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`✓ Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ CORS habilitado para: ${process.env.CORS_ORIGIN || 'http://localhost:4200'}`);
  console.log('='.repeat(80));
  console.log('\nEndpoints disponibles:');
  console.log(`  - GET  http://localhost:${PORT}/health`);
  console.log(`  - GET  http://localhost:${PORT}/api/eficiencias/municipios`);
  console.log(`  - GET  http://localhost:${PORT}/api/eficiencias/resumen/:codigo_dane`);
  console.log('\n✓ Presiona Ctrl+C para detener el servidor\n');
});

// Manejo de cierre graceful
process.on('SIGINT', () => {
  console.log('\n\nCerrando servidor...');
  server.close(() => {
    console.log('✓ Servidor cerrado');
    db.close();
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n\nCerrando servidor...');
  server.close(() => {
    console.log('✓ Servidor cerrado');
    db.close();
    process.exit(0);
  });
});
