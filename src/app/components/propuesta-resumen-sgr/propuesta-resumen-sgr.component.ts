import { ViewChild, ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { InfoPopupComponent } from '../info-popup/info-popup.component';
import { TooltipModule } from 'primeng/tooltip';
import { SummaryPanelComponent } from '../summary-panel/summary-panel.component';

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
      TooltipModule,
      SummaryPanelComponent],
  templateUrl: './propuesta-resumen-sgr.component.html',
  styleUrl: './propuesta-resumen-sgr.component.scss'
})
export class PropuestaResumenSgrComponent implements OnInit{

  @ViewChild('infoPanel') infoPanel!: Popover;
  infoPopupContent: string = '';
  summaryPanelData: any = null;

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
    // detailedDataFiltered: any[] = []; // This seems unused, consider removing if confirmed

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
        // Initialize selectedVigencia, but loadData and queryData will handle initial table population
        this.selectedVigencia = this.vigencia.find(v => v.id === 1) || this.vigencia[0];
        this.selectedSearchType = this.searchTypes.find(st => st.id === 1) || this.searchTypes[0];


        this.loadData().then(() => {
          this.queryData(); // Load initial data with default filters
        });

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

    async loadData(): Promise<void> {
      console.log('Loading base data...');
      try {
        const response = await fetch(this.detailedDataUrl);
        this.detailedData = await response.json();
        this.data = organizeCategoryData(this.detailedData);
        console.log('Base data loaded successfully.');
        this.prepareSummaryPanelData(); // Prepare summary data once full data is loaded
      } catch (error) {
        console.error('Error fetching base data:', error);
        this.detailedData = []; // Ensure detailedData is an array in case of error
        this.summaryPanelData = null; // Ensure summary is cleared on error
      }
    }

    private prepareSummaryPanelData(): void {
      if (!this.detailedData || this.detailedData.length === 0) {
        this.summaryPanelData = null;
        this.cd.detectChanges();
        return;
      }

      // Assuming 'categoria' is a string like '1', '1.1', '1.2', '1.3'
      // And numeric values are stored as strings, needing parseFloat.
      const totalData = this.detailedData.find(item => item.categoria === '1'); 
      const inversionData = this.detailedData.find(item => item.categoria === '1.1');
      const ahorroData = this.detailedData.find(item => item.categoria === '1.2'); 
      const otrosData = this.detailedData.find(item => item.categoria === '1.3'); 

      if (totalData && inversionData && ahorroData && otrosData) {
        this.summaryPanelData = {
          totalVigente: parseFloat(totalData.presupuesto_total_vigente) || 0,
          inversionVigente: parseFloat(inversionData.presupuesto_total_vigente) || 0,
          ahorroVigente: parseFloat(ahorroData.presupuesto_total_vigente) || 0,
          otrosVigente: parseFloat(otrosData.presupuesto_total_vigente) || 0,
          inversionCorriente: parseFloat(inversionData.presupuesto_corriente) || 0,
          ahorroCorriente: parseFloat(ahorroData.presupuesto_corriente) || 0,
          otrosCorriente: parseFloat(otrosData.presupuesto_corriente) || 0
        };
      } else {
        this.summaryPanelData = null; 
        console.warn('Could not find all required data categories for summary panel in detailedData.');
      }
      this.cd.detectChanges(); 
    }

    filterAndReloadTableData() {
      console.log('Filtering and reloading table data...');
      if (!this.detailedData || this.detailedData.length === 0) {
        console.warn('No detailed data available to filter.');
        this.data = [];
        // Even if table data is empty, summary might still be relevant based on full detailedData
        // However, prepareSummaryPanelData is usually called after loadData or if filters might change summary scope
        // For now, if table is empty due to no base data, summary is likely already null.
        // If table is empty due to filters, summary based on full data is still valid.
        this.cd.detectChanges();
        return;
      }

      let filteredResults = [...this.detailedData];

      // 1. Vigencia Filter (assuming 'id_vigencia' field in data items)
      if (this.selectedVigencia && this.selectedVigencia.id !== -1) { // Assuming -1 means "all vigencias" or similar
        filteredResults = filteredResults.filter(item => item.id_vigencia === this.selectedVigencia.id);
      }

      // 2. Search Type Filter
      if (this.selectedSearchType) {
        switch (this.selectedSearchType.id) {
          case 1: // General - no further filtering based on Dpto/Entidad needed here
            break;
          case 2: // Por departamento
            if (this.selectedDpto && this.selectedDpto.codigo !== '-1') {
              // Assuming data items have a 'cod_departamento' field
              filteredResults = filteredResults.filter(item => item.cod_departamento === this.selectedDpto.codigo);
            }
            break;
          case 3: // Por entidad
            if (this.selectedEntity && this.selectedEntity.codigo !== '-1') {
              // Assuming data items have a 'cod_entidad' field that matches selectedEntity.codigo
              // This might be a more complex filter if entities are hierarchical (e.g. DANE codes)
              filteredResults = filteredResults.filter(item => item.cod_entidad && item.cod_entidad.startsWith(this.selectedEntity.codigo));

              // Further filter by selectedDetailEntity if applicable
              if (this.selectedDetailEntity && this.selectedDetailEntity.codigo !== '-1') {
                // Assuming data items also have a field for detailed entity, or selectedDetailEntity.codigo is a more specific 'cod_entidad'
                 filteredResults = filteredResults.filter(item => item.cod_entidad === this.selectedDetailEntity.codigo);
              }
            }
            break;
        }
      }

      if (filteredResults.length > 0) {
        this.data = organizeCategoryData(filteredResults);
      } else {
        this.data = [];
      }
      this.expandTopLevelNodes();
      this.cd.detectChanges(); // Trigger change detection
    }

    expandTopLevelNodes() {
      console.log('Expanding top-level nodes...');
      if (this.data && this.data.length > 0) {
        this.data.forEach(node => {
          if (node.children && node.children.length > 0) {
            // Expand only the first level (e.g., "TOTAL", "INVERSIÓN", "AHORRO", "OTROS")
            node.expanded = node.data.categoria.split(".").length === 1;
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
      // Actual export logic would go here
    }

    async queryData() {
      console.log("Query Data initiated...");
      if (!this.detailedData || this.detailedData.length === 0) {
        console.log("Detailed data is empty, attempting to load first...");
        await this.loadData(); // This will call prepareSummaryPanelData
      }
      //this.filterAndReloadTableData(); // Applies filters to this.data for the table
      // If summary data should reflect the *filtered* table data, call prepareSummaryPanelData based on `this.data` or `filteredResults`
      // However, the current implementation of prepareSummaryPanelData uses `this.detailedData`, so it reflects overall totals.
      // If it should reflect filtered data, prepareSummaryPanelData would need to accept data as a parameter.
      // For now, assuming summary is always based on the full `detailedData` set.
      // If loadData was called above, summary is already prepared. If detailedData was already present,
      // and filters might conceptually change what summary is shown (not current logic), then call it again.
      // Re-calling it here based on full `detailedData` is redundant if `loadData` was just called,
      // but harmless if `detailedData` was already present and `loadData` was skipped.
      // Let's ensure it's consistent if queryData is called multiple times without re-fetching.
      if (this.detailedData && this.detailedData.length > 0) {
         this.prepareSummaryPanelData();
      }
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
      this.selectedSearchType = event.value; // event.value already contains the selected object {id, label}

      // Reset dependent filters
      this.selectedDpto = { codigo: '-1', nombre: 'Por departamento' };
      this.selectedEntity = undefined; // Or a default object like { codigo: '-1', dpto: 'Por entidad' } if your HTML expects it
      this.selectedDetailEntity = undefined;
      this.detailEntitiesFiltered = [];

      // Do not automatically query data here, user will click "Consultar"
      // this.queryData();
    }

    updateSelectedDpto(event: any) {
      console.log('Selected department:', event.value);
      this.selectedDpto = event.value;
      // Do not automatically query data here
      // this.queryData();
    }

    updateSelectedEntity(event: any) {
      console.log('Selected entity:', event.value);
      this.selectedEntity = event.value;
      this.selectedDetailEntity = undefined; // Reset detail entity when main entity changes
      this.detailEntitiesFiltered = [];

      if (this.selectedEntity && this.selectedEntity.codigo !== '-1') {
        // Fetch detail entities if a valid entity is selected
        if (this.detailEntities.length === 0) { // Assuming detailEntities holds all possible detail entities
          fetch(this.territorialEntitiesDetailUrl)
            .then(response => response.json())
            .then(data => {
              this.detailEntities = data;
              this.detailEntitiesFiltered = this.detailEntities.filter((entity: any) => entity.codPadre === this.selectedEntity.codigo);
            })
            .catch(error => console.error('Error fetching detail entities:', error));
        } else {
          this.detailEntitiesFiltered = this.detailEntities.filter((entity: any) => entity.codPadre === this.selectedEntity.codigo);
        }
      }
      // Do not automatically query data here
      // this.queryData();
    }

    updateSelectedDetailEntity(event: any) {
      console.log('Selected detail entity:', event.value);
      this.selectedDetailEntity = event.value;
      // Do not automatically query data here
      // this.queryData();
    }

    // updateData and filterDetailedData methods are now obsolete and replaced by filterAndReloadTableData
    // Remove them.

    updateCategoryData(idCategory: string, fieldPresupuesto: string, fieldRecaudo: string, fieldAvance: string, data: any, template: any) {
      let idx = template.findIndex((i: any) => i.categoria == idCategory);
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

