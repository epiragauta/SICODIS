import { ViewChild, ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { InfoPopupComponent } from '../info-popup/info-popup.component';
import { TooltipModule } from 'primeng/tooltip';

import { TreeNode, MenuItem } from 'primeng/api';
import { TreeTableModule } from 'primeng/treetable';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import { ChartModule } from 'primeng/chart';
import { Popover } from 'primeng/popover';
import { Select  } from 'primeng/select';
import { FloatLabel } from "primeng/floatlabel"

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';

import { organizeCategoryData } from '../../utils/hierarchicalDataStructureV2';
import { departamentos } from '../../data/departamentos';

import { territorialEntities } from '../../data/territorial-entities';
import { SplitterModule } from 'primeng/splitter';

interface DocumentInfo {
  name: string;
  url: string;
  type: 'pdf' | 'excel' | 'word' | 'generic';
}

interface NodeInfo {
  title: string;
  description: string;
  documents?: DocumentInfo[];
  moreDetailsUrl?: string;
}

@Component({
  selector: 'app-propuesta-resumen-sgr',
  standalone: true,
  imports: [CommonModule,
      MatFormFieldModule,
      MatSelectModule,
      TreeTableModule,
      ButtonModule,
      FormsModule,
      Select,
      FloatLabel,
      SplitButtonModule,
      MatGridListModule,
      ChartModule,
      PopoverModule,
      SplitterModule,
      InfoPopupComponent,
      TooltipModule],
  templateUrl: './propuesta-resumen-sgr.component.html',
  styleUrl: './propuesta-resumen-sgr.component.scss'
})
export class PropuestaResumenSgrComponent implements OnInit{

  @ViewChild('infoPanel') infoPanel!: Popover;
  infoPopupContent: string = '';

  cols: any[] = [];
  colsA: any[] = [];
  colsB: any[] = [];
  expandedCols: any[] = [];
  hiddenCols: string[] = [
    'rendimientos_financieros',
    'reintegros',
    'excedentes_faep_fonpet',
    'multas',
    'mineral_sin_identificacion_de_origen',
    'mr'
  ];
  isExpanded: boolean = false;
  data: TreeNode[] = [];
  platformId = inject(PLATFORM_ID);

  selectedNode: TreeNode | null = null;
  infoMap: Map<string, Map<string, NodeInfo>> = new Map();

  selectedVigencia: any = { id: 1, label: 'Vigencia Bienio 2025 - 2026' };
  selectedSearchType: any = { id: 1, label: 'General' };
  selectedDpto: any = { codigo: '-1', nombre: 'Por departamento' };
  selectedEntity: any;
  selectedDetailEntity: any;

  selectedInfoTitle: string = '';
  selectedInfoDescription: string = '';
  selectedInfoDocuments: DocumentInfo[] = [];
  selectedInfoMoreDetailsUrl: string | undefined = undefined;

  menuItems: MenuItem[];

  territorialEntitiesDetailUrl = '/assets/data/territorial-entities-detail.json';
  detailedDataUrl = '/assets/data/propuesta-resumen-sgr.json';

  searchTypes: any[] = [
    { id: 1, label: 'General' },
    { id: 2, label: 'Por departamento' },
    { id: 3, label: 'Por entidad' }
  ];

    vigencia = [
        {
            "id": 1,
            "label": "Vigencia Bienio 2025 - 2026"
        },
        {
            "id": 2,
            "label": "Vigencia Bienio 2023 - 2024"
        },
        {
            "id": 3,
            "label": "Vigencia Bienio 2021 - 2022"
        },
        {
            "id": 4,
            "label": "Vigencia Bienio 2019 - 2020"
        },
        {
            "id": 5,
            "label": "Vigencia Bienio 2017 - 2018"
        },
        {
            "id": 6,
            "label": "Vigencia Bienio 2015 - 2016"
        },
        {
            "id": 7,
            "label": "Vigencia Bienio 2013 - 2014"
        },
        {
            "id": 8,
            "label": "Vigencia 2012"
        }
    ];
    dptos = departamentos;
    entities = territorialEntities;
    detailEntities: any[] = [];
    detailEntitiesFiltered: any[] = [];
    detailedData: any[] = [];
    detailedDataFiltered: any[] = [];

    constructor(private cd: ChangeDetectorRef, private cookieService: CookieService) {
      this.menuItems = [
        {
          label: 'Exportar Reporte',
          icon: 'pi pi-fw pi-file',
          command: () => this.exportData()
        },
        {
          label: 'Exportar Detalle',
          icon: 'pi pi-fw pi-question',
          command: () => this.exportData()
        }
      ];

    }

    ngOnInit() {
      // Configurar columnas principales siempre visibles

      this.colsA = [
        { field: 'concepto', header: 'Concepto', width: '20%', 'color': '#e4e6e8', 'class': 'col-standar', tooltip: 'Descripción de la categoría presupuestal' },
        { field: 'presupuesto_total_vigente', header: 'Presupuesto Total Vigente', width: '14%', 'color': '#e4e6e8', 'class': 'col-standar', tooltip: 'Suma total del presupuesto vigente (corriente + otros)' },
        { field: 'presupuesto_otros', header: 'Presupuesto Otros', width: '14%', 'color': '#e4e6e8', 'class': 'col-standar', tooltip: 'Montos presupuestados para otras fuentes de ingreso. Haga clic en este encabezado para ver/ocultar el detalle de las fuentes.' },
      ]
      this.colsB = [
        { field: 'presupuesto_corriente', header: 'Presupuesto Corriente', width: '14%', 'color': '#e4e6e8', 'class': 'col-standar', tooltip: 'Monto presupuestado para ingresos corrientes' },
        { field: 'caja_corriente_informada', header: 'Caja Corriente Informada', width: '14%', 'color': '#e4e6e8', 'class': 'col-standar', tooltip: 'Valores de caja reportados para los ingresos corrientes' },
        { field: 'porcentaje_1', header: '%', width: '5%', 'color': '#e4e6e8', 'class': 'col-standar', tooltip: 'Porcentaje de ejecución: (Caja Corriente Informada / Presupuesto Corriente) * 100' },
        { field: 'caja_total', header: 'Caje Total', width: '14%', 'color': '#e4e6e8', 'class': 'col-standar', tooltip: 'Monto total de caja' },
        { field: 'porcentaje_2', header: '%', width: '5%', 'color': '#e4e6e8', 'class': 'col-standar', tooltip: 'Porcentaje de ejecución: (Caja Total / Presupuesto Total Vigente) * 100' },
      ]
      this.cols = [
        ...this.colsA,
        ...this.colsB
      ];

      // Configurar columnas expandidas que serán mostradas/ocultadas
      this.expandedCols = [
        { field: 'rendimientos_financieros', header: 'Rendimientos Financieros', width: '14%', 'color': '#a5cef6', 'class': 'col-expanded', tooltip: 'Ingresos generados por rendimientos de inversiones' },
        { field: 'reintegros', header: 'Reintegros', width: '14%', 'color': '#a5cef6', 'class': 'col-expanded', tooltip: 'Devoluciones o retornos de recursos' },
        { field: 'excedentes_faep_fonpet', header: 'Excedentes FAEP FONPET', width: '14%', 'color': '#a5cef6', 'class': 'col-expanded', tooltip: 'Excedentes provenientes del Fondo de Ahorro y Estabilización (FAE) y del Fondo de Pensiones Territoriales (FONPET)' },
        { field: 'multas', header: 'Multas', width: '14%', 'color': '#a5cef6', 'class': 'col-expanded', tooltip: 'Ingresos provenientes de sanciones o penalidades'  },
        { field: 'mineral_sin_identificacion_de_origen', header: 'Mineral Sin Identificación', width: '14%', 'color': '#a5cef6', 'class': 'col-expanded', tooltip: 'Ingresos provenientes de minerales cuyo origen no está identificado' },
        { field: 'mr', header: 'MR', width: '14%', 'color': '#a5cef6', 'class': 'col-expanded', tooltip: 'Categoría específica de ingresos MR (Mayor Recaudo)' }
      ];
        this.loadData();
        this.selectedVigencia = this.vigencia[0];

        this.infoPopupContent = `
        <div style="font-size: 11px;">
          <p>Información detallada sobre presupuestos, recaudos y distribución de recursos del Sistema General de Regalías de Colombia, organizada jerárquicamente por diferentes conceptos presupuestales.</p>
          <br>
          <ul>
            <li><strong>Concepto</strong>: Descripción de la categoría presupuestal</li>
            <li><strong>Presupuesto corriente</strong>: Monto presupuestado para ingresos corrientes</li>
            <li><strong>Presupuesto otros</strong>: Montos presupuestados para otras fuentes de ingreso</li>
            <li><strong>Presupuesto total vigente</strong>: Suma total del presupuesto vigente (corriente + otros)</li>
            <li><strong>Caja corriente informada</strong>: Valores de caja reportados para los ingresos corrientes</li>
            <li><strong>Caja total</strong>: Monto total de caja</li>
            <li><strong>Disponibilidad inicial</strong>: Recursos disponibles al inicio del periodo</li>
            <li><strong>Excedentes faep fonpet</strong>: Excedentes provenientes del Fondo de Ahorro y Estabilización (FAE) y del Fondo de Pensiones Territoriales (FONPET)</li>
            <li><strong>Mineral sin identificacion de origen</strong>: Ingresos provenientes de minerales cuyo origen no está identificado</li>
            <li><strong>MR</strong>: Categoría específica de ingresos</li>
            <li><strong>Multas</strong>: Ingresos provenientes de sanciones o penalidades</li>
            <li><strong>Reintegros</strong>: Devoluciones o retornos de recursos</li>
            <li><strong>Rendimientos financieros</strong>: Ingresos generados por rendimientos de inversiones</li>
            <li><strong>Porcentaje 1</strong> y <strong>Porcentaje 2</strong>: Indicadores porcentuales que miden proporciones entre valores</li>
          </ul>
          <h3>Estructura de conceptos principales:</h3>
          <ul>
            <li>TOTAL</li>
            <li>INVERSIÓN
              <ul>
                <li>Asignaciones Directas 20%</li>
                <li>Asignación para la Inversión Regional</li>
                <li>Asignación para la Inversión Local</li>
                <li>Asignación para la Ciencia, Tecnología e Innovación</li>
                <li>Asignación para la Paz</li>
                <li>Asignación Ambiental</li>
                <li>Municipios Río Magdalena y Canal Dique</li>
                <li>Emprendimiento</li>
                <li>Incentivo a la producción</li>
              </ul>
            </li>
            <li>AHORRO
              <ul>
                <li>Fondo de Ahorro y Estabilización (FAE)</li>
                <li>Fondo Ahorro Pensional Territorial (FONPET)</li>
              </ul>
            </li>
            <li>OTROS
              <ul>
                <li>Funcionamiento</li>
                <li>Fiscalización</li>
                <li>Sistema de Seguimiento, Evaluación y Control (SSEC)</li>
              </ul>
            </li>
            <li>RECAUDO CORRIENTE NO AFORADO</li>
          </ul>
          <p>Los valores monetarios están expresados en pesos colombianos y representan cifras considerables (en el orden de billones de pesos), correspondientes al presupuesto nacional del Sistema General de Regalías.</p>
        </div>
        `;
    }

    loadData() {
      console.log('Loading data...');
      fetch(this.detailedDataUrl)
        .then(response => response.json())
        .then(data => {
          this.data = organizeCategoryData(data);
          this.expandTopLevelNodes();
        })
        .catch(error => console.error('Error fetching data:', error));
    }

    expandTopLevelNodes() {
      console.log('Expanding top-level nodes...');
      // Expandir los nodos de primer nivel para mejor visualización
      if (this.data && this.data.length > 0) {
        this.data.forEach(node => {
          if (node.children && node.children.length > 0) {
            node.expanded = node.data.categoria.split(".").length < 2;
          }
        });
      }
    }

    toggleColumns() {
      this.isExpanded = !this.isExpanded;

      if (this.isExpanded) {
        // Mostrar todas las columnas
        this.cols = [
          ...this.colsA,
          ...this.expandedCols,
          ...this.colsB
        ];
        const listWidths = [16,8,8,8,6,6,6,6,6,6,9,3,8,4];
        this.cols.forEach((col, index) => {
          col.width = listWidths[index] + '%';
        });
        
      } else {
        // Ocultar las columnas expandidas
        this.cols = this.cols.filter(col => !this.hiddenCols.includes(col.field));
      }
    }

    isHiddenColumn(field: string): boolean {
      return this.hiddenCols.includes(field);
    }

    exportData() {
      console.log('Exportando datos...');
    }

    queryData(){
      console.log("Query Data...");
    }

    hasPresupuestoInfo(rowData: any): boolean {
      return this.hasInfo(rowData.concepto, 'presupuesto');
    }

    private hasInfo(category: string, field: string): boolean {
      if (!this.infoMap.has(category)) {
        return false;
      }

      const categoryInfo = this.infoMap.get(category);
      return categoryInfo?.has(field) || false;
    }

    showInfo(event: Event, field: string, rowData: any) {
      event.preventDefault();
      event.stopPropagation();

      if (!this.infoMap.has(rowData.concepto)) {
        return;
      }

      const categoryInfo = this.infoMap.get(rowData.concepto);
      const info = categoryInfo?.get(field);

      if (info) {
        this.selectedInfoTitle = info.title;
        this.selectedInfoDescription = info.description;
        this.selectedInfoDocuments = info.documents || [];
        this.selectedInfoMoreDetailsUrl = info.moreDetailsUrl;

        this.infoPanel.show(event);
      }
    }

    updateSelectedSearchType(event: any) {
      console.log('Selected search type:', event.value);
      this.selectedSearchType = event.value;
      switch (this.selectedSearchType.id) {
        case 2:
          this.selectedDpto = { codigo: '-1', nombre: 'Por departamento' };
          break;
        case 3:
          this.selectedEntity = { codigo: '-1', nombre: 'Por entidad' };
          break;
        default:
          break;
      }
    }

    updateSelectedDpto(event: any) {
      console.log('Selected department:', event.value);
      this.selectedDpto = event.value;
      this.updateData(this.selectedDpto.codigo, true);

    }

    updateSelectedEntity(event: any) {
      console.log('Selected entity:', event.value);
      if (this.detailEntities.length == 0) {
        fetch(this.territorialEntitiesDetailUrl)
          .then(response => response.json())
          .then(data => {
            this.detailEntities = data;
            this.detailEntitiesFiltered = this.detailEntities.filter((entity: any) => entity.codPadre == this.selectedEntity.codigo);
          })
          .catch(error => console.error('Error fetching detail entities:', error));
      }else{
        this.detailEntitiesFiltered = this.detailEntities.filter((entity: any) => entity.codPadre == this.selectedEntity.codigo);
      }
      this.updateData(this.selectedEntity.codigo);
    }

    updateSelectedDetailEntity(event: any) {
      console.log('Selected detail entity:', event.value);
      this.selectedDetailEntity = event.value;
    }

    updateData(codigo:string, isDpto:boolean = true) {
      console.log('Uopdating data for entity with code:', codigo);
      // console.log('Selected vigencia:', this.selectedVigencia);
      // console.log('Selected search type:', this.selectedSearchType);
      // console.log('Selected department:', this.selectedDpto);
      // console.log('Selected entity:', this.selectedEntity);
      // console.log('Selected detail entity:', this.selectedDetailEntity);


      if (this.detailedData.length == 0) {
        fetch(this.detailedDataUrl)
          .then(response => response.json())
          .then(data => {
            this.detailedData = data;
            this.filterDetailedData(codigo, isDpto);
          })
          .catch(error => console.error('Error fetching detailed data:', error));
      }
      else {
        this.filterDetailedData(codigo, isDpto);
      }

    }

    filterDetailedData(codigo:string, isDpto:boolean = true) {
      console.log('Filtering detailed data...');


      console.log('Filtered detailed data:', this.detailedData);
    }

    updateCategoryData(idCategory: string, fieldPresupuesto: string, fieldRecaudo: string, fieldAvance: string, data: any, template: any) {
      let idx = template.findIndex((i: any) => i.categoria ==  idCategory);
      if (idx !== -1) {
        template[idx].presupuesto = data.reduce((acc: number, item: any) => acc + parseFloat(item[fieldPresupuesto]), 0);
        template[idx].iac = data.reduce((acc: number, item: any) => acc + parseFloat(item[fieldRecaudo]), 0);
        template[idx].avance = data.reduce((acc: number, item: any) => acc + parseFloat(item[fieldAvance].toString().replace(",",".")), 0);
      }
      console.log('Updated category data:', template[idx]);
      return template[idx];
    }

    formatCurrency(value: any): string {
      if (value === null || value === undefined) return '';

      // Convertir a número si es string
      const numValue = typeof value === 'string' ? parseFloat(value) : value;

      // Formatear como moneda
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(numValue);
    }

    formatPercentage(value: any): string {
      if (value === null || value === undefined) return '';

      // Convertir a número si es string
      const numValue = typeof value === 'string' ? parseFloat(value) : value;

      // Formatear como porcentaje
      return (numValue * 100).toFixed(2) + '%';
    }

  }

