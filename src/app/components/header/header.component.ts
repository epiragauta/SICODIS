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
            command: () => this.redirectSGR()
        },
        {
            label: 'SGP',
            command: () => this.redirectSGP()
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
