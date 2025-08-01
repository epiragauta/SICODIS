import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ReportsSgrComponent } from './components/reports-sgr/reports-sgr.component';
import { ReportsSgpComponent } from './components/reports-sgp/reports-sgp.component';
import { ReportsMapComponent } from './components/reports-map/reports-map.component';
import { ReportsSgpDistComponent } from './components/reports-sgp-dist/reports-sgp-dist.component';
import { ReportsSgpBudgetComponent } from './components/reports-sgp-budget/reports-sgp-budget.component';
import { ReportsSgrBienalComponent } from './components/reports-sgr-bienal/reports-sgr-bienal.component';
import { ReportsSgrComparativeComponent } from './components/reports-sgr-comparative/reports-sgr-comparative.component';
import { IacComparativeVsBudgetComponent} from './components/iac-comparative-vs-budget/iac-comparative-vs-budget.component';
import { ReportsSgrResumenPlanRecursosComponent} from './components/reports-sgr-resumen-plan-recursos/reports-sgr-resumen-plan-recursos.component';
import { FaqComponent } from './components/faq/faq.component';
import { ToolsComponent } from './components/tools/tools.component';
import { ComparativoIacVsPresupuestoComponent } from './components/comparativo-iac-vs-presupuesto/comparativo-iac-vs-presupuesto.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PropuestaResumenSgrComponent } from './components/propuesta-resumen-sgr/propuesta-resumen-sgr.component';
import { HighchartsDashboardComponent } from './components/highcharts-dashboard/highcharts-dashboard.component';
import { PresupuestoYRecaudoComponent } from './components/presupuesto-y-recaudo/presupuesto-y-recaudo.component';
import { GraphicsSgpComponent } from './components/graphics-sgp/graphics-sgp.component';
import { ReporteFuncionamientoComponent } from './components/reporte-funcionamiento/reporte-funcionamiento.component';
import { HomeSgpComponent } from './components/home-sgp/home-sgp.component';
import { ReportsSgpResguardosComponent } from './components/reports-sgp-resguardos/reports-sgp-resguardos.component';
import { HistoricoSgpComponent } from './components/historico-sgp/historico-sgp.component';
import { SgpInicioComponent } from './components/sgp-inicio/sgp-inicio.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'reports-sgr', component: ReportsSgrComponent },    
    { path: 'reports-sgp-dist', component: ReportsSgpDistComponent },
    { path: 'reports-sgp-budget', component: ReportsSgpBudgetComponent },
    { path: 'reports-sgr-bienal', component: ReportsSgrBienalComponent },
    { path: 'reports-sgr-comparative', component: ReportsSgrComparativeComponent },
    { path: 'reports-map', component: ReportsMapComponent },
    { path: 'iac-comparative-vs-budget', component: IacComparativeVsBudgetComponent },
    { path: 'comparativo-iac-presupuesto', component: ComparativoIacVsPresupuestoComponent },
    { path: 'reports-sgr-resumen-plan-recursos', component: ReportsSgrResumenPlanRecursosComponent },
    { path: 'faq', component: FaqComponent },
    { path: 'tools', component: ToolsComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'dashboard2', component: HighchartsDashboardComponent },
    { path: 'propuesta-resumen-sgr', component: PropuestaResumenSgrComponent }, // Redirect to home for any unknown routes
    { path: 'presupuesto-y-recaudo', component: PresupuestoYRecaudoComponent },
    { path: 'graphics-sgp', component: GraphicsSgpComponent},
    { path: 'reporte-funcionamiento', component: ReporteFuncionamientoComponent },
    { path: 'home-sgp', component: HomeSgpComponent},
    { path: 'sgp-inicio', component: SgpInicioComponent},
    { path: 'sgp-resguardos', component: ReportsSgpResguardosComponent},
    { path: 'sgp-historico', component: HistoricoSgpComponent},
    { path: 'sgp-documentos-anexos', component: ReportsSgpComponent }

];