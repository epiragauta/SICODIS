import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ReportsSgpComponent } from './components/reports-sgp/reports-sgp.component';
import { FaqComponent } from './components/faq/faq.component';
import { ToolsComponent } from './components/tools/tools.component';
import { PresupuestoYRecaudoComponent } from './components/presupuesto-y-recaudo/presupuesto-y-recaudo.component';
import { ReporteFuncionamientoComponent } from './components/reporte-funcionamiento/reporte-funcionamiento.component';
import { SgpResguardosComponent } from './components/sgp-resguardos/sgp-resguardos.component';
import { HistoricoSgpComponent } from './components/historico-sgp/historico-sgp.component';
import { SgpInicioComponent } from './components/sgp-inicio/sgp-inicio.component';
import { SgpDetallePresupuestalComponent } from './components/sgp-detalle-presupuestal/sgp-detalle-presupuestal.component';
import { SgpComparativaComponent } from './components/sgp-comparativa/sgp-comparativa.component';
import { PgnRegionalizacionPresupuestoProgramacionComponent } from './components/pgn-regionalizacion-presupuesto-programacion/pgn-regionalizacion-presupuesto-programacion.component';
import { PgnComparativaRegionalizacionComponent } from './components/pgn-comparativa-regionalizacion/pgn-comparativa-regionalizacion.component';
import { SgpEficienciasComponent } from './components/sgp-eficiencias/sgp-eficiencias.component';
import { SgrRecaudoMensualComponent } from './components/sgr-recaudo-mensual/sgr-recaudo-mensual.component';
import { SgrComparativoComponent } from './components/sgr-comparativo/sgr-comparativo.component';
import { SgrProgramacionComponent } from './components/sgr-programacion/sgr-programacion.component';
import { SgrRecaudoDirectasComponent } from './components/sgr-recaudo-directas/sgr-recaudo-directas.component';
import { SgrMontosCorrientesConstantesComponent } from './components/sgr-montos-corrientes-constantes/sgr-montos-corrientes-constantes.component';
import { PgnInversionPorSectorComponent } from './components/pgn-inversion-por-sector/pgn-inversion-por-sector.component';
import { PgnRegionalizacionPresupuestoSeguimientoComponent } from './components/pgn-regionalizacion-presupuesto-seguimiento/pgn-regionalizacion-presupuesto-seguimiento.component';
import { SgrPlanBienalCajaComponent } from './components/sgr-plan-bienal-caja/sgr-plan-bienal-caja.component';
import { SgrPlanBienalRecursosComponent } from './components/sgr-plan-bienal-recursos/sgr-plan-bienal-recursos.component';
import { SitemapComponent } from './components/sitemap/sitemap.component';
import { MapaRecursosComponent } from './components/mapa-recursos/mapa-recursos.component';
import { SgrInicioComponent } from './components/sgr-inicio/sgr-inicio.component';
import { SgrInformacionGeneralComponent } from './components/sgr-informacion-general/sgr-informacion-general.component';
import { AdminConfigComponent } from './components/admin-config/admin-config.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    // SGR
    { path: 'sgr-presupuesto-y-recaudo',      component: PresupuestoYRecaudoComponent,                     data: { breadcrumb: 'SGR — Presupuesto y Recaudo' } },
    { path: 'sgr-recaudo-mensual',            component: SgrRecaudoMensualComponent,                       data: { breadcrumb: 'SGR — Recaudo Mensual' } },
    { path: 'sgr-comparativo',                component: SgrComparativoComponent,                          data: { breadcrumb: 'SGR — Comparativo' } },
    { path: 'sgr-programacion',               component: SgrProgramacionComponent,                         data: { breadcrumb: 'SGR — Programación' } },
    { path: 'sgr-recaudo-directas',           component: SgrRecaudoDirectasComponent,                      data: { breadcrumb: 'SGR — Recaudo Directas' } },
    { path: 'sgr-montos-corrientes-constantes', component: SgrMontosCorrientesConstantesComponent,         data: { breadcrumb: 'SGR — Montos Corrientes y Constantes' } },
    { path: 'sgr-plan-recursos',              component: SgrPlanBienalRecursosComponent,                   data: { breadcrumb: 'SGR — Plan Bienal de Recursos' } },
    { path: 'sgr-plan-bienal-de-caja',        component: SgrPlanBienalCajaComponent,                       data: { breadcrumb: 'SGR — Plan Bienal de Caja' } },
    { path: 'reporte-funcionamiento',         component: ReporteFuncionamientoComponent,                   data: { breadcrumb: 'SGR — Reporte de Funcionamiento' } },
    { path: 'sgr-inicio',                     component: SgrInicioComponent,                               data: { breadcrumb: 'SGR' } },
    { path: 'sgr-informacion-general',        component: SgrInformacionGeneralComponent,                   data: { breadcrumb: 'SGR — Información General' } },
    // SGP
    { path: 'sgp-inicio',                     component: SgpInicioComponent,                               data: { breadcrumb: 'SGP' } },
    { path: 'sgp-resguardos',                 component: SgpResguardosComponent,                           data: { breadcrumb: 'SGP — Resguardos' } },
    { path: 'sgp-historico',                  component: HistoricoSgpComponent,                            data: { breadcrumb: 'SGP — Histórico' } },
    { path: 'sgp-documentos-anexos',          component: ReportsSgpComponent,                              data: { breadcrumb: 'SGP — Documentos y Anexos' } },
    { path: 'sgp-detalle-presupuestal',       component: SgpDetallePresupuestalComponent,                  data: { breadcrumb: 'SGP — Detalle Presupuestal' } },
    { path: 'sgp-comparativa',                component: SgpComparativaComponent,                          data: { breadcrumb: 'SGP — Comparativa' } },
    { path: 'sgp-eficiencias',                 component: SgpEficienciasComponent,                          data: { breadcrumb: 'SGP — Eficiencias' } },
    // PGN
    { path: 'pgn-inversion-por-sector',       component: PgnInversionPorSectorComponent,                   data: { breadcrumb: 'PGN — Inversión por Sector' } },
    { path: 'pgn-regionalizacion',            component: PgnRegionalizacionPresupuestoProgramacionComponent, data: { breadcrumb: 'PGN — Regionalización' } },
    { path: 'pgn-seguimiento',                component: PgnRegionalizacionPresupuestoSeguimientoComponent, data: { breadcrumb: 'PGN — Seguimiento' } },
    { path: 'pgn-comparativa-regionalizacion', component: PgnComparativaRegionalizacionComponent,          data: { breadcrumb: 'PGN — Comparativa Regionalización' } },
    // Otros
    { path: 'faq',                            component: FaqComponent,                                      data: { breadcrumb: 'Preguntas Frecuentes' } },
    { path: 'tools',                          component: ToolsComponent,                                    data: { breadcrumb: 'Herramientas' } },
    { path: 'mapa-del-sitio',                 component: SitemapComponent,                                  data: { breadcrumb: 'Mapa del sitio' } },
    { path: 'mapa-recursos',                  component: MapaRecursosComponent,                             data: { breadcrumb: 'Mapa de Recursos' } },
    // Administración (protegido con guard)
    { path: 'admin-config',                   component: AdminConfigComponent,    canActivate: [adminGuard], data: { breadcrumb: 'Administración' } },
    // 404
    { path: '**', component: NotFoundComponent, data: { breadcrumb: 'Página no encontrada' } },
];