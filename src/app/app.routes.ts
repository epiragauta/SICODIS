import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ReportsSgrComponent } from './components/reports-sgr/reports-sgr.component';
import { ReportsSgpComponent } from './components/reports-sgp/reports-sgp.component';
import { ReportsMapComponent } from './components/reports-map/reports-map.component';
import { ReportsSgpDistComponent } from './components/reports-sgp-dist/reports-sgp-dist.component';
import { ReportsSgpBudgetComponent } from './components/reports-sgp-budget/reports-sgp-budget.component';
import { ReportsSgrBienalComponent } from './components/reports-sgr-bienal/reports-sgr-bienal.component';
import { ReportsSgrComparativeComponent } from './components/reports-sgr-comparative/reports-sgr-comparative.component';
import { FaqComponent } from './components/faq/faq.component';
import { ToolsComponent } from './components/tools/tools.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'reports-sgr', component: ReportsSgrComponent },
    { path: 'reports-sgp', component: ReportsSgpComponent },
    { path: 'reports-sgp-dist', component: ReportsSgpDistComponent },
    { path: 'reports-sgp-budget', component: ReportsSgpBudgetComponent },
    { path: 'reports-sgr-bienal', component: ReportsSgrBienalComponent },
    { path: 'reports-sgr-comparative', component: ReportsSgrComparativeComponent },
    { path: 'reports-map', component: ReportsMapComponent },
    { path: 'faq', component: FaqComponent },
    { path: 'tools', component: ToolsComponent }
];
