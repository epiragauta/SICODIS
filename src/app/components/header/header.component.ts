// src/app/components/header/header.component.ts

import { Component, OnInit, OnDestroy, ElementRef, Renderer2, HostListener } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
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
export class HeaderComponent implements OnInit, OnDestroy {

  items: MenuItem[] | undefined;
  private isScrolled = false;
  private scrollThreshold = 50; // Píxeles de scroll antes de aplicar efectos

  constructor(
    private route: Router,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

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
            command: () => this.redirectSGP()
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
    ];
  }

  ngOnDestroy() {
    // Limpieza si es necesaria
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    
    if (scrollTop > this.scrollThreshold && !this.isScrolled) {
      this.isScrolled = true;
      this.renderer.addClass(this.elementRef.nativeElement.querySelector('.container'), 'scrolled');
    } else if (scrollTop <= this.scrollThreshold && this.isScrolled) {
      this.isScrolled = false;
      this.renderer.removeClass(this.elementRef.nativeElement.querySelector('.container'), 'scrolled');
    }
  }

  redirectHome() {
    this.route.navigate(['/']);
  }

  redirectSGR() {
    this.route.navigate(['/reports-sgr']);
  }

  redirectUrl(path: string) {
    this.route.navigate([path]);
  }

  redirectSGP() {
    this.route.navigate(['/reports-sgp']);
  }

  redirectFAQ() {
    this.route.navigate(['/faq']);
  }

  redirectTools() {
    this.route.navigate(['/tools']);
  }

  redirectDocs(item: string) {
    const urls: any = {
      "sgp": "https://www.dnp.gov.co/LaEntidad_/subdireccion-general-inversiones-seguimiento-evaluacion/direccion-programacion-inversiones-publicas/Paginas/distribucion-de-recursos-territoriales.aspx",
      "sgr": "https://www.dnp.gov.co/LaEntidad_/subdireccion-general-inversiones-seguimiento-evaluacion/direccion-programacion-inversiones-publicas/Paginas/sistema-general-de-regalias.aspx"
    };
    window.open(urls[item], '_blank');
  }
}