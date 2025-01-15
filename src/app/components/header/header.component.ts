import { Component, OnInit } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Menubar } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatMenuModule, ButtonModule, Menubar],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  items: MenuItem[] | undefined;

  constructor(
    private route: Router
  ){}

  ngOnInit() {
    this.items = [
        {
            label: 'Inicio',
            icon: 'pi pi-home',
            command: () => this.redirectHome()
        },
        {
            label: 'Sobre SICODIS',
            icon: 'pi pi-star'
        },
        {
            label: 'Documentos Financiamiento Territorial',
            icon: 'pi pi-list-check',
            items: [
                {
                    label: 'Sistema General de Participaciones -SGP',
                    icon: 'pi pi-bolt',
                    command: () => this.redirectDocs("sgp")
                },
                {
                    label: 'Sistema General de Regalías -SGR',
                    icon: 'pi pi-server',
                    command: () => this.redirectDocs("sgr")
                },
                {
                    label: 'Más Información',
                    icon: 'pi pi-palette',
                    items: [
                        {
                            label: 'Información',
                            icon: 'pi pi-palette'
                        },
                        {
                            label: 'Baúl de herramientas',
                            icon: 'pi pi-palette',
                            command: () => this.redirectTools()
                        }
                    ]
                }
            ]
        },
        {
            label: 'SGR',
            icon: 'pi pi-wrench',
            command: () => this.redirectSGR()
        },
        {
            label: 'SGP',
            icon: 'pi pi-warehouse',
            command: () => this.redirectSGP()
        },
        {
            label: 'Servicio al Ciudadano',
            icon: 'pi pi-user'
        },
        {
            label: 'Preguntas Frecuentes',
            icon: 'pi pi-question-circle',
            command: () => this.redirectFAQ()
        }
    ]
}


  redirectHome(){
    this.route.navigate(['/']);
  }
  redirectSGR(){
    this.route.navigate(['/reports-sgr']);
  }

  redirectSGP(){
    this.route.navigate(['/reports-sgp']);
  }

  redirectFAQ(){
    this.route.navigate(['/faq']);
  }

  redirectTools(){
    this.route.navigate(['/tools']);
  }

  redirectDocs(item: string) {
    const urls: any = {
      "sgp": "https://www.dnp.gov.co/LaEntidad_/subdireccion-general-inversiones-seguimiento-evaluacion/direccion-programacion-inversiones-publicas/Paginas/distribucion-de-recursos-territoriales.aspx",
      "sgr": "https://www.dnp.gov.co/LaEntidad_/subdireccion-general-inversiones-seguimiento-evaluacion/direccion-programacion-inversiones-publicas/Paginas/sistema-general-de-regalias.aspx"
    }
    window.open(urls[item], '_blank');
  }
}
