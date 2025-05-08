import { Input, ViewChild, ChangeDetectorRef, Component, effect, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TreeTableModule } from 'primeng/treetable';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import { Popover } from 'primeng/popover';
import { SGPBudgetItem, convertToTreeTableData, getAvanceClass } from '../iac-comparative-vs-budget/sgp-budget-converter';
import { organizeCategoryData} from '../../utils/hierarchicalDataStructureV2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { resumenPlanRecursos} from '../../data/resumen-plan-recursos';
import { departamentos } from '../../data/departamentos';
import { MatGridListModule } from '@angular/material/grid-list';
import { ChartModule } from 'primeng/chart';
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
  selector: 'app-reports-sgr-resumen-plan-recursos',
  standalone: true,
  imports: [CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    TreeTableModule,
    ButtonModule,
    MatGridListModule,
    ChartModule,
    PopoverModule,
    SplitterModule ],
  templateUrl: './reports-sgr-resumen-plan-recursos.component.html',
  styleUrl: './reports-sgr-resumen-plan-recursos.component.scss'
})
export class ReportsSgrResumenPlanRecursosComponent implements OnInit {

  @Input() selectedDepartment: string = 'Todos';
  @Input() budgetItems: SGPBudgetItem[] = [];
  @ViewChild('infoPanel') infoPanel!: Popover;

  platformId = inject(PLATFORM_ID);
  departmentSelected: any = { codigo: 'Todos', nombre: 'Todos los departamentos' };
  townSelected: string = '';
  lawPeriodSelected: string = '';
  departamentos = departamentos;

  towns: any = [
    { 'c': '01', d: 'Municipio1' },
    { 'c': '02', d: 'Municipio2' },
  ];
  lawPeriods = [
    { name: '2023-2032 - Ley 2279 de 2022' },
    { name: '2021-2030 - Ley 2072 de 2020' },
    { name: '2019-2028 - Ley 1942 de 2018' },
    { name: '2017-2026 - Decreto 2190 de 2016' },
    { name: '2015-2024 - Ley 1744 de 2014' },
    { name: '2013-2022 - Ley 1606 de 2012' },
  ];
  years = ["2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032", "2033", "2034"];


  budgetData: TreeNode[] = [];
  cols: any[] = [];
  selectedNode: TreeNode | null = null;

  // Variables para el panel de información
  selectedInfoTitle: string = '';
  selectedInfoDescription: string = '';
  selectedYear: string = '2025';
  selectedInfoDocuments: DocumentInfo[] = [];
  selectedInfoMoreDetailsUrl: string | undefined = undefined;

  // Mapa de información adicional para los nodos
  infoMap: Map<string, Map<string, NodeInfo>> = new Map();

  dataChart: any;
  optionsChart: any;

  constructor(private cd: ChangeDetectorRef) {
    // Inicializar datos de información para algunos nodos
    this.initializeInfoData();
  }

  ngOnInit() {
    this.cols = [
      { field: 'concepto', header: 'Concepto' },
      { field: this.selectedYear, header: `Presupuesto (${this.selectedYear})` },
      { field: 'avance', header: '% del Total' }
    ];

    this.loadBudgetData();


    const textColor = '#000000'; // Cambia el color según tus necesidades

    this.dataChart = {labels : ["Inversión", "Ahorro", "Otros"],
      datasets: [
        {data: [],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          hoverBackgroundColor: ['#FF6344', '#36A2AB', '#FFCE16'],
        }]};
    this.budgetData.forEach((node: any) => {
      if (node.data.categoria !== 'total') {
        this.dataChart.datasets[0].data.push(node.data[this.selectedYear]);
      }
    });

    this.optionsChart = {
      plugins: {
          legend: {
              labels: {
                  usePointStyle: true,
                  color: textColor
              }
          }
      }
    };
    this.cd.markForCheck();
  }

  // Inicializa datos de información de muestra
  private initializeInfoData() {
    // Información para "TOTAL SGP"
    const totalSgpInfo = new Map<string, NodeInfo>();
    totalSgpInfo.set('presupuesto', {
      title: 'Recursos destinados a Inversión',
      description: 'Este valor corresponde al presupuesto total asignado al Sistema General de Participaciones para el año fiscal actual, según lo aprobado por el Congreso de la República.',
      documents: [
        { name: 'Ley de Presupuesto 2024', url: 'https://example.com/presupuesto-2024.pdf', type: 'pdf' },
        { name: 'Informe Detallado SGP', url: 'https://example.com/informe-sgp.xlsx', type: 'excel' }
      ],
      moreDetailsUrl: 'https://example.com/detalles-presupuesto'
    });
    totalSgpInfo.set('iac', {
      title: 'INVERSIÓN',
      description: 'Este valor representa el total de recursos efectivamente distribuidos a las entidades territoriales mediante Instrucciones de Abono a Cuenta (IAC).',
      documents: [
        { name: 'Distribución SGP 2024', url: 'https://example.com/distribucion-sgp.pdf', type: 'pdf' }
      ]
    });
    this.infoMap.set('INVERSION', totalSgpInfo);

    // Información para "Asignaciones Directas"
    const asignacionesDirectasInfo = new Map<string, NodeInfo>();
    asignacionesDirectasInfo.set('presupuesto', {
      title: 'AHORRO',
      description: 'Recursos destinados a las entidades territoriales en cuyo territorio se adelantan explotaciones de recursos naturales no renovables o por donde se transportan dichos recursos.',
      documents: [
        { name: 'Detalle Asignaciones Directas', url: 'https://example.com/asignaciones-directas.pdf', type: 'pdf' },
        { name: 'Normatividad Vigente', url: 'https://example.com/normatividad.docx', type: 'word' }
      ],
      moreDetailsUrl: 'https://example.com/detalles-asignaciones'
    });
    asignacionesDirectasInfo.set('iac', {
      title: 'Recursos destinados a ahorro',
      description: 'Recursos efectivamente girados a entidades territoriales por concepto de asignaciones directas durante el periodo.',
      documents: [
        { name: 'AHORRO', url: 'https://example.com/distribucion-territorial.xlsx', type: 'excel' }
      ]
    });
    this.infoMap.set('AHORRO', asignacionesDirectasInfo);
  }

  loadBudgetData() {

    // Construimos la estructura de TreeNodes para PrimeNG
    if (this.budgetItems && this.budgetItems.length > 0) {
      // Si se proporcionaron datos externos, úsalos
      this.budgetData = convertToTreeTableData(this.budgetItems);
    } else {
      this.budgetData = organizeCategoryData(resumenPlanRecursos);
      this.updateAvance();
    }
  }

  updateAvance(){
    console.log('Actualizando avance... selectedYear:', this.selectedYear);
    // Actualiza el avance de cada nodo basado en el año seleccionado
    let totalItem = this.budgetData.filter((node: any) => node.data.categoria === 'total')[0];
    let total = totalItem.data[this.selectedYear];
    this.budgetData.forEach((node: any) => {
      let ratio = (node.data[this.selectedYear] / total) * 100;
      node.data.avance = ratio.toFixed(2) + '%';
      if (node.children.length > 0) {
        // Si el nodo tiene hijos, calculamos el avance para cada hijo
        node.children.forEach((child: any) => {
          let childRatio = (child.data[this.selectedYear] / total) * 100;
          child.data.avance = childRatio.toFixed(2) + '%';
          if (child.children.length > 0) {
            child.children.forEach((grandchild: any) => {
              let grandchildRatio = (grandchild.data[this.selectedYear] / total) * 100;
              grandchild.data.avance = grandchildRatio.toFixed(2) + '%';
            });
          }
        });
      }
    });
    //console.log("updateAvance :: finished", this.budgetData);
  }

  calculateAdvanceByYear(hierarchicalData: any, year: string, decimals = 2) {
    // Primero, buscamos el nodo con categoria = "total"
    const totalNode = hierarchicalData.find((node: any) => node.data.categoria === "total");

    if (!totalNode || !totalNode.data[year]) {
      console.warn(`No se encontró nodo total o el año ${year} no existe en el nodo total`);
      return hierarchicalData;
    }

    const totalValue = totalNode.data[year];

    /**
     * Función recursiva para actualizar el avance en cada nodo y sus hijos
     */
    function updateAdvance(nodes: any) {
      nodes.forEach((node: any) => {
        // Actualizamos el avance solo si no es el nodo total
        if (node.data.categoria !== "total" && node.data[year] !== undefined) {
          const percentage = (node.data[year] / totalValue) * 100;
          node.avance = `${percentage.toFixed(decimals)}%`;
        }

        // Procesamos recursivamente los hijos
        if (node.children && node.children.length > 0) {
          updateAdvance(node.children);
        }
      });
    }

    // Hacemos una copia profunda para no modificar el original
    const result = JSON.parse(JSON.stringify(hierarchicalData));

    // Actualizamos el avance en toda la estructura
    updateAdvance(result);

    return result;
  }

  updateSelectedYear(event: any) {
    console.log('Selected year:', event.value);
    this.cols[1].field = event.value;
    this.cols[1].header = `Presupuesto (${event.value})`;
    this.updateAvance();
  }

  updateSelectedDepartamento(event: any) {
    console.log('Selected department:', event.value);
    this.budgetData = organizeCategoryData(resumenPlanRecursos);
    if (event.value === '-1') {
      this.updateAvance();
      return;
    }
    let totalItem = this.budgetData.filter((node: any) => node.data.categoria === 'total')[0];
    totalItem.data[this.selectedYear] = totalItem.data[this.selectedYear] * (this.departmentSelected.porcentaje / 100);
    this.budgetData.forEach((node: any) => {
      if (node.data.categoria !== 'total') {
        node.data[this.selectedYear] = node.data[this.selectedYear] * (this.departmentSelected.porcentaje / 100);
        if (node.children.length > 0) {
          node.children.forEach((child: any) => {
            child.data[this.selectedYear] = child.data[this.selectedYear] * (this.departmentSelected.porcentaje / 100);
            if (child.children.length > 0) {
              child.children.forEach((grandchild: any) => {
                grandchild.data[this.selectedYear] = grandchild.data[this.selectedYear] * (this.departmentSelected.porcentaje / 100);
              });
            }
          });
        }
      }
    });
    this.updateAvance();
    console.log("updateSelectedDepartamento :: finished", this.budgetData);
  }


  getAvanceClass(avance: string): string {
    return getAvanceClass(avance);
  }

  // Método para exportar los datos (puedes modificarlo según tus necesidades)
  exportData() {
    console.log('Exportando datos...');
    // Aquí irá la lógica para exportar los datos a Excel o CSV
  }

  // Verifica si hay información disponible para el presupuesto de un nodo
  hasPresupuestoInfo(rowData: any): boolean {
    return this.hasInfo(rowData.concepto, 'presupuesto');
  }

  // Verifica si hay información disponible para el IAC de un nodo
  hasIacInfo(rowData: any): boolean {
    return this.hasInfo(rowData.concepto, 'iac');
  }

  // Método genérico para verificar si hay información
  private hasInfo(category: string, field: string): boolean {
    if (!this.infoMap.has(category)) {
      return false;
    }

    const categoryInfo = this.infoMap.get(category);
    return categoryInfo?.has(field) || false;
  }

  // Muestra el panel de información
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

  // Obtiene el icono según el tipo de documento
  getDocumentIcon(type: string): string {
    switch (type) {
      case 'pdf':
        return 'pi-file-pdf';
      case 'excel':
        return 'pi-file-excel';
      case 'word':
        return 'pi-file-word';
      default:
        return 'pi-file';
    }
  }

  // Abre la URL de más detalles
  openMoreDetails() {
    if (this.selectedInfoMoreDetailsUrl) {
      window.open(this.selectedInfoMoreDetailsUrl, '_blank');
    }
    this.infoPanel.hide();
  }

}
