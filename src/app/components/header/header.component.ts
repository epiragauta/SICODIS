// src/app/components/header/header.component.ts

import { Component, OnInit, OnDestroy, ElementRef, Renderer2, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Menubar } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { DOCUMENT } from '@angular/common';

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
  private scrollThreshold = 100; // Píxeles de scroll antes de aplicar efectos (aumentado para mejor UX)
  private isBrowser: boolean;

  constructor(
    private route: Router,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.items = [
      {
        label: 'Inicio',
        command: () => this.redirectHome()
      },
      {
        label: 'Sobre SICODIS',
        items: [
          {
            label: 'Variables de distribución Sistema General de Participaciones y Sistema General de Regalias',
            command: () => this.redirectHome()
          }
        ]
      },
      {
        label: 'SGP',
        items: [
          {
            label: 'Distribución Doce Doceavas y Anexos'
          },
          {
            label: 'Ficha SGP, información Presupuestal',
            // command: () => this.redirectSGP()
          },
          {
            label: 'Ficha comparativa de distribución SGP',
            // command: () => this.redirectUrl("reports-sgp-dist")
          },
          {
            label: 'Distribución SGP para los Resguardos Indígenas',
            // command: () => this.redirectUrl("reports-sgp-budget")
          },
          {
            label: 'Eficiencia Fiscal y Eficiencia Administrativa de la participación para Propósito general',
            // command: () => this.redirectUrl("dashboard")
          },
          {
            label: 'Ficha para la proyección de los recursos del SGP – Vigencia 2024'
          }
        ]
      },
      {
        label: 'SGR',
        items: [
          {
            label: 'Comparativo Avance vs Presupuesto',
            command: () => this.redirectUrl("comparativo-iac-presupuesto")
          },
          {
            label: 'Administración del SGR y del SSEC',
             command: () => this.redirectUrl("reporte-funcionamiento")
          },          
          {
            label: 'Plan Bienal de Caja',
            // command: () => this.redirectUrl("reports-sgr-bienal")
          },          
          {
            label: 'Plan de recursos',
            // command: () => this.redirectUrl("dashboard")
          },
          {
            label: 'Visor General de recursos AD hidrocarburos y minería',
            // command: () => this.redirectUrl("propuesta-resumen-sgr")
          }
        ]
      },
      {
        label: 'Histórico',
        items: [
          {
            label: 'Histórico Situado – Fiscal y  PICN 199 a 2001 (entidades y conceptos)'
          },
          {
            label: 'Resumen histórico – Situación fiscal y PICN 1994 – 2001'
          },
          {
            label: 'Detalle histórico SGP'
          },
          {
            label: 'Detalle histórico por entidad y concepto SGP'
          }
        ]
      },   
      {
        label: 'Ayuda',
        items: [
          {
            label: 'Preguntas Frecuentes',
            command: () => this.redirectFAQ()
          },{
            label: 'Guías y manuales'
          }
        ]
      }      
    ];
  }

  ngOnDestroy() {
    // Limpiar clases del body al destruir el componente (solo en el navegador)
    if (this.isBrowser) {
      this.renderer.removeClass(this.document.body, 'menu-is-sticky');
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event): void {
    // Solo ejecutar en el navegador
    if (!this.isBrowser) {
      return;
    }

    const scrollTop = window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
    
    if (scrollTop > this.scrollThreshold && !this.isScrolled) {
      this.isScrolled = true;
      // Agregar clase al contenedor principal para activar el estado scrolled
      const headerContainer = this.elementRef.nativeElement.querySelector('.header-container');
      if (headerContainer) {
        this.renderer.addClass(headerContainer, 'scrolled');
      }
      
      // Agregar clase específica al menú para hacerlo sticky
      const menuContainer = this.elementRef.nativeElement.querySelector('.menu-container');
      if (menuContainer) {
        this.renderer.addClass(menuContainer, 'menu-sticky');
      }
      
      // Agregar clase al body para ajustar el padding del contenido principal
      this.renderer.addClass(this.document.body, 'menu-is-sticky');
      
    } else if (scrollTop <= this.scrollThreshold && this.isScrolled) {
      this.isScrolled = false;
      
      // Remover clases cuando se vuelve al top
      const headerContainer = this.elementRef.nativeElement.querySelector('.header-container');
      if (headerContainer) {
        this.renderer.removeClass(headerContainer, 'scrolled');
      }
      
      const menuContainer = this.elementRef.nativeElement.querySelector('.menu-container');
      if (menuContainer) {
        this.renderer.removeClass(menuContainer, 'menu-sticky');
      }
      
      // Remover clase del body
      this.renderer.removeClass(this.document.body, 'menu-is-sticky');
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