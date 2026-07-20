import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { DetalleEntidadComponent } from '../detalle-entidad/detalle-entidad.component';
import { DetalleHistoricoComponent } from '../detalle-historico/detalle-historico.component';
import { HistoricoFiscalComponent } from '../historico-fiscal/historico-fiscal.component';
import { HistoricoSgpComponent } from '../historico-sgp/historico-sgp.component';
import { ProyeccionSgpComponent } from '../proyeccion-sgp/proyeccion-sgp.component';
import { EficienciaComponent } from '../eficiencia/eficiencia.component';
import { VisorRecursosComponent } from '../visor-recursos/visor-recursos.component';
import { VariablesDistribucionComponent } from '../variables-distribucion/variables-distribucion.component';


@Component({
  selector: 'app-tools',
  standalone: true,
  imports: [
    DetalleEntidadComponent,
    DetalleHistoricoComponent,
    HistoricoFiscalComponent,
    HistoricoSgpComponent,
    ProyeccionSgpComponent,
    EficienciaComponent,
    VisorRecursosComponent,
    VariablesDistribucionComponent,
    CommonModule,
    TabsModule,
    ButtonModule],
  templateUrl: './tools.component.html',
  styleUrl: './tools.component.scss'
})
export class ToolsComponent {

  activeTab = 0;

  // Estructura para los datos de cada sección
  sections = [
    {
      id: 1,
      title: 'Variables SGP y SGR',
      icon: 'data_usage',
      description: 'Consulta de Variables de distribución SGP y SGR'
    },
    {
      id: 2,
      title: 'Histórico 1994-2001',
      icon: 'history',
      description: 'Resumen histórico situado fiscal y PICN'
    },
    {
      id: 3,
      title: 'Detalle Histórico',
      icon: 'assessment',
      description: 'Histórico por entidades y conceptos'
    },
    {
      id: 4,
      title: 'Proyección 2025',
      icon: 'trending_up',
      description: 'Ficha de Proyección SGP'
    },
    {
      id: 5,
      title: 'Histórico SGP',
      icon: 'timeline',
      description: 'Detalle histórico SGP'
    },
    {
      id: 6,
      title: 'Detalle por Entidad',
      icon: 'account_balance',
      description: 'Detalle histórico por entidad y concepto SGP'
    },
    {
      id: 7,
      title: 'Eficiencia',
      icon: 'speed',
      description: 'Eficiencia Fiscal y Administrativa'
    },
    {
      id: 8,
      title: 'Visor Recursos',
      icon: 'visibility',
      description: 'Visor General recursos AD hidrocarburos y minería'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    // Implementar carga inicial de datos
  }

  onTabChange(value: string | number): void {
    this.activeTab = Number(value);
    this.loadTabData(this.activeTab);
  }

  loadTabData(tabIndex: number): void {
    // Implementar lógica de carga de datos específica para cada pestaña
  }

  exportData(): void {
    // Implementar lógica de exportación de datos
  }
}

