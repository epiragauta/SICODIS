import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

// Todas las rutas usan loadComponent (lazy loading): cada componente y sus
// dependencias se descargan solo cuando el usuario navega a la ruta,
// reduciendo el bundle inicial de la aplicación.
export const routes: Routes = [
    { path: '', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) },
    // SGR
    { path: 'sgr-presupuesto-y-recaudo',      loadComponent: () => import('./components/presupuesto-y-recaudo/presupuesto-y-recaudo.component').then(m => m.PresupuestoYRecaudoComponent),                     data: { breadcrumb: 'SGR — Presupuesto y Recaudo' } },
    { path: 'sgr-recaudo-mensual',            loadComponent: () => import('./components/sgr-recaudo-mensual/sgr-recaudo-mensual.component').then(m => m.SgrRecaudoMensualComponent),                           data: { breadcrumb: 'SGR — Recaudo Mensual' } },
    { path: 'sgr-comparativo',                loadComponent: () => import('./components/sgr-comparativo/sgr-comparativo.component').then(m => m.SgrComparativoComponent),                                      data: { breadcrumb: 'SGR — Comparativo' } },
    { path: 'sgr-programacion',               loadComponent: () => import('./components/sgr-programacion/sgr-programacion.component').then(m => m.SgrProgramacionComponent),                                   data: { breadcrumb: 'SGR — Programación' } },
    { path: 'sgr-recaudo-directas',           loadComponent: () => import('./components/sgr-recaudo-directas/sgr-recaudo-directas.component').then(m => m.SgrRecaudoDirectasComponent),                        data: { breadcrumb: 'SGR — Recaudo Directas' } },
    { path: 'sgr-montos-corrientes-constantes', loadComponent: () => import('./components/sgr-montos-corrientes-constantes/sgr-montos-corrientes-constantes.component').then(m => m.SgrMontosCorrientesConstantesComponent), data: { breadcrumb: 'SGR — Montos Corrientes y Constantes' } },
    { path: 'sgr-plan-recursos',              loadComponent: () => import('./components/sgr-plan-bienal-recursos/sgr-plan-bienal-recursos.component').then(m => m.SgrPlanBienalRecursosComponent),             data: { breadcrumb: 'SGR — Plan Bienal de Recursos' } },
    { path: 'sgr-plan-bienal-de-caja',        loadComponent: () => import('./components/sgr-plan-bienal-caja/sgr-plan-bienal-caja.component').then(m => m.SgrPlanBienalCajaComponent),                         data: { breadcrumb: 'SGR — Plan Bienal de Caja' } },
    { path: 'reporte-funcionamiento',         loadComponent: () => import('./components/reporte-funcionamiento/reporte-funcionamiento.component').then(m => m.ReporteFuncionamientoComponent),                 data: { breadcrumb: 'SGR — Reporte de Funcionamiento' } },
    { path: 'sgr-inicio',                     loadComponent: () => import('./components/sgr-inicio/sgr-inicio.component').then(m => m.SgrInicioComponent),                                                     data: { breadcrumb: 'SGR' } },
    { path: 'sgr-informacion-general',        loadComponent: () => import('./components/sgr-informacion-general/sgr-informacion-general.component').then(m => m.SgrInformacionGeneralComponent),               data: { breadcrumb: 'SGR — Información General' } },
    // SGP
    { path: 'sgp-inicio',                     loadComponent: () => import('./components/sgp-inicio/sgp-inicio.component').then(m => m.SgpInicioComponent),                                                     data: { breadcrumb: 'SGP' } },
    { path: 'sgp-resguardos',                 loadComponent: () => import('./components/sgp-resguardos/sgp-resguardos.component').then(m => m.SgpResguardosComponent),                                          data: { breadcrumb: 'SGP — Resguardos' } },
    { path: 'sgp-historico',                  loadComponent: () => import('./components/historico-sgp/historico-sgp.component').then(m => m.HistoricoSgpComponent),                                             data: { breadcrumb: 'SGP — Histórico' } },
    { path: 'sgp-documentos-anexos',          loadComponent: () => import('./components/reports-sgp/reports-sgp.component').then(m => m.ReportsSgpComponent),                                                   data: { breadcrumb: 'SGP — Documentos y Anexos' } },
    { path: 'sgp-detalle-presupuestal',       loadComponent: () => import('./components/sgp-detalle-presupuestal/sgp-detalle-presupuestal.component').then(m => m.SgpDetallePresupuestalComponent),             data: { breadcrumb: 'SGP — Detalle Presupuestal' } },
    { path: 'sgp-comparativa',                loadComponent: () => import('./components/sgp-comparativa/sgp-comparativa.component').then(m => m.SgpComparativaComponent),                                       data: { breadcrumb: 'SGP — Comparativa' } },
    { path: 'sgp-eficiencias',                loadComponent: () => import('./components/sgp-eficiencias/sgp-eficiencias.component').then(m => m.SgpEficienciasComponent),                                       data: { breadcrumb: 'SGP — Eficiencias' } },
    // PGN
    { path: 'pgn-inversion-por-sector',       loadComponent: () => import('./components/pgn-inversion-por-sector/pgn-inversion-por-sector.component').then(m => m.PgnInversionPorSectorComponent),              data: { breadcrumb: 'PGN — Inversión por Sector' } },
    { path: 'pgn-regionalizacion',            loadComponent: () => import('./components/pgn-regionalizacion-presupuesto-programacion/pgn-regionalizacion-presupuesto-programacion.component').then(m => m.PgnRegionalizacionPresupuestoProgramacionComponent), data: { breadcrumb: 'PGN — Regionalización' } },
    { path: 'pgn-seguimiento',                loadComponent: () => import('./components/pgn-regionalizacion-presupuesto-seguimiento/pgn-regionalizacion-presupuesto-seguimiento.component').then(m => m.PgnRegionalizacionPresupuestoSeguimientoComponent), data: { breadcrumb: 'PGN — Seguimiento' } },
    { path: 'pgn-comparativa-regionalizacion', loadComponent: () => import('./components/pgn-comparativa-regionalizacion/pgn-comparativa-regionalizacion.component').then(m => m.PgnComparativaRegionalizacionComponent), data: { breadcrumb: 'PGN — Comparativa Regionalización' } },
    // Otros
    { path: 'faq',                            loadComponent: () => import('./components/faq/faq.component').then(m => m.FaqComponent),                                                                          data: { breadcrumb: 'Preguntas Frecuentes' } },
    { path: 'tools',                          loadComponent: () => import('./components/tools/tools.component').then(m => m.ToolsComponent),                                                                    data: { breadcrumb: 'Herramientas' } },
    { path: 'mapa-del-sitio',                 loadComponent: () => import('./components/sitemap/sitemap.component').then(m => m.SitemapComponent),                                                              data: { breadcrumb: 'Mapa del sitio' } },
    { path: 'mapa-recursos',                  loadComponent: () => import('./components/mapa-recursos/mapa-recursos.component').then(m => m.MapaRecursosComponent),                                             data: { breadcrumb: 'Mapa de Recursos' } },
    // Administración (protegido con guard)
    { path: 'admin-config',                   loadComponent: () => import('./components/admin-config/admin-config.component').then(m => m.AdminConfigComponent), canActivate: [adminGuard], data: { breadcrumb: 'Administración' } },
    // 404
    { path: '**', loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent), data: { breadcrumb: 'Página no encontrada' } },
];
