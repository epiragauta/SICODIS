import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ReportsSgrComponent } from './components/reports-sgr/reports-sgr.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'reports-sgr', component: ReportsSgrComponent }
];
