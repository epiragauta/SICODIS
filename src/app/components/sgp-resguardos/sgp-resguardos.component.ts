import { Component, OnInit } from '@angular/core';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sgp-resguardos',
  standalone: true,
  imports: [Breadcrumb],
  templateUrl: './sgp-resguardos.component.html',
  styleUrl: './sgp-resguardos.component.scss'
})
export class SgpResguardosComponent implements OnInit {

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
