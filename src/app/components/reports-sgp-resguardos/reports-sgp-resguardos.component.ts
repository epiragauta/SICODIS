import { Component, OnInit } from '@angular/core';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-reports-sgp-resguardos',
  standalone: true,
  imports: [Breadcrumb],
  templateUrl: './reports-sgp-resguardos.component.html',
  styleUrl: './reports-sgp-resguardos.component.scss'
})
export class ReportsSgpResguardosComponent implements OnInit {

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  ngOnInit(): void {
    this.items = [
        { label: 'SGP', routerLink: '/sgp-inicio' },
        { label: 'Resguardos Indígenas' }        
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }
}
