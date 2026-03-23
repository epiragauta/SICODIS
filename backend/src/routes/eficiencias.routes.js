/**
 * Rutas para endpoints de eficiencias fiscales y administrativas
 */

const express = require('express');
const router = express.Router();
const controller = require('../controllers/eficiencias.controller');

// ============================================================================
// Catálogo de Municipios
// ============================================================================

// GET /api/eficiencias/municipios - Todos los municipios
router.get('/municipios', controller.getMunicipios);

// GET /api/eficiencias/municipios/:codigo_dane - Municipio específico
router.get('/municipios/:codigo_dane', controller.getMunicipioByCodigo);

// ============================================================================
// Ingresos Tributarios
// ============================================================================

// GET /api/eficiencias/ingresos-tributarios - Todos (con paginación)
router.get('/ingresos-tributarios', controller.getIngresosTributarios);

// GET /api/eficiencias/ingresos-tributarios/:codigo_dane - Por municipio
router.get('/ingresos-tributarios/:codigo_dane', controller.getIngresosTributarios);

// GET /api/eficiencias/ingresos-tributarios/:codigo_dane/:anio - Municipio + año
router.get('/ingresos-tributarios/:codigo_dane/:anio', controller.getIngresosTributarios);

// ============================================================================
// Población
// ============================================================================

// GET /api/eficiencias/poblacion - Todas (con paginación)
router.get('/poblacion', controller.getPoblacion);

// GET /api/eficiencias/poblacion/:codigo_dane - Por municipio
router.get('/poblacion/:codigo_dane', controller.getPoblacion);

// GET /api/eficiencias/poblacion/:codigo_dane/:anio - Municipio + año
router.get('/poblacion/:codigo_dane/:anio', controller.getPoblacion);

// ============================================================================
// Recursos Propósito General
// ============================================================================

// GET /api/eficiencias/recursos-proposito-general - Todos (con paginación)
router.get('/recursos-proposito-general', controller.getRecursosPropositoGeneral);

// GET /api/eficiencias/recursos-proposito-general/:codigo_dane - Por municipio
router.get('/recursos-proposito-general/:codigo_dane', controller.getRecursosPropositoGeneral);

// GET /api/eficiencias/recursos-proposito-general/:codigo_dane/:anio - Municipio + año
router.get('/recursos-proposito-general/:codigo_dane/:anio', controller.getRecursosPropositoGeneral);

// ============================================================================
// Ley 617 - ICLD
// ============================================================================

// GET /api/eficiencias/ley-617/icld/:codigo_dane - Por municipio
router.get('/ley-617/icld/:codigo_dane', controller.getLey617Icld);

// GET /api/eficiencias/ley-617/icld/:codigo_dane/:anio - Municipio + año
router.get('/ley-617/icld/:codigo_dane/:anio', controller.getLey617Icld);

// ============================================================================
// Ley 617 - Gastos de Funcionamiento
// ============================================================================

// GET /api/eficiencias/ley-617/gastos-funcionamiento/:codigo_dane - Por municipio
router.get('/ley-617/gastos-funcionamiento/:codigo_dane', controller.getLey617GastosFuncionamiento);

// GET /api/eficiencias/ley-617/gastos-funcionamiento/:codigo_dane/:anio - Municipio + año
router.get('/ley-617/gastos-funcionamiento/:codigo_dane/:anio', controller.getLey617GastosFuncionamiento);

// ============================================================================
// Ley 617 - Razón
// ============================================================================

// GET /api/eficiencias/ley-617/razon/:codigo_dane - Por municipio
router.get('/ley-617/razon/:codigo_dane', controller.getLey617Razon);

// GET /api/eficiencias/ley-617/razon/:codigo_dane/:anio - Municipio + año
router.get('/ley-617/razon/:codigo_dane/:anio', controller.getLey617Razon);

// ============================================================================
// Ley 617 - Holgura
// ============================================================================

// GET /api/eficiencias/ley-617/holgura/:codigo_dane - Por municipio
router.get('/ley-617/holgura/:codigo_dane', controller.getLey617Holgura);

// GET /api/eficiencias/ley-617/holgura/:codigo_dane/:anio - Municipio + año
router.get('/ley-617/holgura/:codigo_dane/:anio', controller.getLey617Holgura);

// ============================================================================
// Ley 617 - Límite de Gasto (vigencia 2025)
// ============================================================================

// GET /api/eficiencias/ley-617/limite-gasto/:codigo_dane - Por municipio
router.get('/ley-617/limite-gasto/:codigo_dane', controller.getLey617LimiteGasto);

// ============================================================================
// Ley 617 - Vigencia 2026
// ============================================================================

// GET /api/eficiencias/ley-617/vigencia-2026/:codigo_dane - Por municipio
router.get('/ley-617/vigencia-2026/:codigo_dane', controller.getLey617Vigencia2026);

// ============================================================================
// Indicadores Ley 550
// ============================================================================

// GET /api/eficiencias/indicadores/eficiencia-fiscal/:codigo_dane - Por municipio
router.get('/indicadores/eficiencia-fiscal/:codigo_dane', controller.getIndicadoresEficienciaFiscal);

// GET /api/eficiencias/indicadores/eficiencia-fiscal/:codigo_dane/:anio - Municipio + año
router.get('/indicadores/eficiencia-fiscal/:codigo_dane/:anio', controller.getIndicadoresEficienciaFiscal);

// GET /api/eficiencias/indicadores/eficiencia-administrativa/:codigo_dane - Por municipio
router.get('/indicadores/eficiencia-administrativa/:codigo_dane', controller.getIndicadoresEficienciaAdministrativa);

// GET /api/eficiencias/indicadores/eficiencia-administrativa/:codigo_dane/:anio - Municipio + año
router.get('/indicadores/eficiencia-administrativa/:codigo_dane/:anio', controller.getIndicadoresEficienciaAdministrativa);

// ============================================================================
// Consultas Agregadas y Especiales
// ============================================================================

// GET /api/eficiencias/resumen/:codigo_dane - Resumen completo de municipio
router.get('/resumen/:codigo_dane', controller.getResumenMunicipio);

// GET /api/eficiencias/comparar?codigos=05001,05002&anio=2023 - Comparar municipios
router.get('/comparar', controller.compararMunicipios);

// GET /api/eficiencias/ranking/eficiencia-fiscal/:anio - Ranking por eficiencia
router.get('/ranking/eficiencia-fiscal/:anio', controller.getRankingEficienciaFiscal);

module.exports = router;
