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
            command: () => this.redirectHome()
        },
        {
            label: 'Sobre SICODIS',
        },
        {
            label: 'Documentos Financiamiento Territorial',
            items: [
                {
                    label: 'Sistema General de Participaciones -SGP',
                    command: () => this.redirectDocs("sgp")
                },
                {
                    label: 'Sistema General de Regalías -SGR',
                    command: () => this.redirectDocs("sgr")
                },
                {
                    label: 'Más Información',
                    items: [
                        {
                            label: 'Información',
                        },
                        {
                            label: 'Baúl de herramientas',
                            command: () => this.redirectTools()
                        }
                    ]
                }
            ]
        },
        {
            label: 'SGR',
            items: [
              {
                  label: 'Sistema General de Regalias -SGR',
                  command: () => this.redirectSGR()
              },
              {
                  label: 'Plan Bienal de Caja',
                  command: () => this.redirectUrl("reports-sgr-bienal")
              },
              {
                  label: 'Comparativo Avance vs Presupuesto',
                  command: () => this.redirectUrl("comparativo-iac-presupuesto")
              },
              {
                  label: 'Tablero de Control',
                  command: () => this.redirectUrl("dashboard")
              },
              {
                  label: 'Propuesta Resumen',
                  command: () => this.redirectUrl("propuesta-resumen-sgr")
              }
            ]
        },
        {
            label: 'SGP',
            items: [
              {
                  label: 'Sistema General de Participaciones -SGP',
                  command: () => this.redirectSGP(  )
              },
              {
                  label: 'Distribución de recursos',
                  command: () => this.redirectUrl("reports-sgp-dist")
              },
              {
                  label: 'Presupuesto',
                  command: () => this.redirectUrl("reports-sgp-budget")
              },
              {
                  label: 'Tablero de Control',
                  command: () => this.redirectUrl("dashboard")
              }
          ]
        },
        {
            label: 'Servicio al Ciudadano',
        },
        {
            label: 'Preguntas Frecuentes',
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

  redirectUrl(path:string){
    this.route.navigate([path]);
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
