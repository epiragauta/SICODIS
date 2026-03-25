/**
 * Configuración de aplicación Express
 */

const express = require('express');
const cors = require('cors');
const eficienciasRoutes = require('./routes/eficiencias.routes');

const app = express();

// ============================================================================
// Middleware
// ============================================================================

// CORS - Permitir solicitudes desde Angular
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  credentials: true
}));

// Parser de JSON
app.use(express.json());

// Parser de URL-encoded
app.use(express.urlencoded({ extended: true }));

// Logging de requests en desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// ============================================================================
// Rutas
// ============================================================================

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rutas de API de eficiencias
app.use('/api/eficiencias', eficienciasRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'API de Eficiencias Fiscales y Administrativas - SICODIS',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api/eficiencias',
      docs: '/api/eficiencias/municipios (GET para ver municipios)'
    }
  });
});

// ============================================================================
// Manejo de Errores
// ============================================================================

// 404 - Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path
  });
});

// Manejador de errores general
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

module.exports = app;
