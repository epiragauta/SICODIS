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
            label: 'Eficiencia Fiscal y Eficiencia Administrativa de la participación para Propósito general.',
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
            label: 'Recursos de la Administración del SGR y del Sistema de Seguimiento Evaluación y Control',
            // command: () => this.redirectSGR()
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