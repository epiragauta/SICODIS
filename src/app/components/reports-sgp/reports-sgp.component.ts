import { CommonModule } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';

// PrimeNG imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Select, SelectChangeEvent } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';
import { Dialog } from 'primeng/dialog';

import Chart from 'chart.js/auto';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';
import { departamentos } from '../../data/departamentos';

@Component({
  selector: 'app-reports-sgp',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatGridListModule,
    MatCardModule,
    MatTableModule,
    TableModule,
    ButtonModule,
    Select,
    FloatLabel,
    Dialog,
    NumberFormatPipe
  ],
  templateUrl: './reports-sgp.component.html',
  styleUrl: './reports-sgp.component.scss',
})
export class ReportsSgpComponent {
  color1 = 'lightblue';
  color2 = 'lightgreen';
  color3 = 'lightpink';
  selected: string = '2025';
  departmentSelected: string = '';
  townSelected: string = '';
  tableClass = "p-datatable-sm";

  visibleDlgDetail: boolean = false;
  visibleDlgFiles: boolean = false;

  expandedRows = {};

  infoToResume: any = {};
  entidadTerritorialUrl = '/assets/data/entidad_territorial.json';
  entidadTerritorialData: any = {};

  infoResume: any = [
    {
      year: '2025',
      budget: '70540879911189',
      budgetDistributed: '70540879911189',
      pending: 0,
      percent: 1,
    },
    {
      year: '2024',
      budget: '70540879911189',
      budgetDistributed: '70540879911189',
      pending: 0,
      percent: 1,
    },
    {
      year: '2023',
      budget: '54936407931948',
      budgetDistributed: '54936407931948',
      pending: 0,
      percent: 1,
    },
    {
      year: '2022',
      budget: '49564897462512',
      budgetDistributed: '49564897462512',
      pending: 0,
      percent: 1,
    },
    {
      year: '2021',
      budget: '47675273699939',
      budgetDistributed: '47675273699939',
      pending: 0,
      percent: 1,
    },
    {
      year: '2020',
      budget: '43847390906182',
      budgetDistributed: '43847390906182',
      pending: 0,
      percent: 1,
    },
  ];

  departments = departamentos;

  towns: any = [
    { name: 'Municipio1' },
    { name: 'Municipio2' },
    { name: 'Municipio3' },
    { name: 'Municipio4' },
    { name: 'Municipio5' },
    { name: 'Municipio6' },
    { name: 'Municipio7' },
    { name: 'Municipio8' },
    { name: 'Municipio9' },
    { name: 'Municipio10' },
    { name: 'Municipio11' },
    { name: 'Municipio12' },
  ];

  dataSource2: any = [
    {
      desc: '1.1 - Educación',
      value: '28216351964476',
      detail: [
        { desc: 'Alimentación Escolar', value: '2500000000000' },
        { desc: 'Infraestructura Educativa', value: '1800000000000' },
        { desc: 'Calidad Educativa', value: '23916351964476' },
      ]
    },
    {
      desc: '1.2 - Salud',
      value: '28216351964476',
      detail: [
        { desc: 'Régimen Subsidiado', value: '20000000000000' },
        { desc: 'Salud Pública', value: '5216351964476' },
        { desc: 'Prestación de Servicios', value: '3000000000000' },
      ]
    },
    {
      desc: '2.1 - Agua Potable y Saneamiento Básico',
      value: '7054087991119',
      detail: [
        { desc: 'Acueducto', value: '3527043995559' },
        { desc: 'Alcantarillado', value: '2116226397336' },
        { desc: 'Aseo', value: '1410739598224' },
      ]
    },
    {
      desc: '2.2 - Propósito General',
      value: '7054087991118',
      detail: [
        { desc: 'Libre Inversión', value: '4932461593783' },
        { desc: 'Funcionamiento', value: '2121626397335' },
      ]
    },
    {
      desc: '99 - Total SGP',
      value: '70540879911189',
      detail: []
    }
  ];

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.infoToResume = this.infoResume.filter(
      (item: any) => item.year === this.selected
    )[0];
    this.createGraph();

    fetch(this.entidadTerritorialUrl)
      .then((response: any) => response.json())
      .then((data: any) => {
        this.entidadTerritorialData = data;        
        console.log('Entidad Territorial Data:', this.entidadTerritorialData);
      })
      .catch((error: any) => console.error('Error loading data:', error)); 
  }

  createGraph() {
    const ctx = this.renderer.selectRootElement(
      '#gaugeChart'
    ) as HTMLCanvasElement;
    const ctx2d = ctx.getContext('2d');

    const gradient = ctx2d?.createLinearGradient(0, 0, ctx.width, 0);
    gradient?.addColorStop(0, 'rgba(53, 106, 212, 0.445)');
    gradient?.addColorStop(1, 'rgb(53, 106, 212)');

    const value = this.infoToResume.percent * 100;
    const customPlugin = {
      id: 'customPlugin',
      beforeDraw(chart: any) {
        const { width } = chart;
        const { height } = chart;
        const { ctx } = chart;

        ctx.save();
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = '#3366CC';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${value}%`, width / 2, height / 1.3);
        ctx.restore();
      },
    };
    Chart.register(customPlugin);
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Valor Actual'],
        datasets: [
          {
            data: [value, 100 - value],
            backgroundColor: [gradient, '#E0E0E0'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        rotation: -90,
        circumference: 180,
        cutout: '80%',
        plugins: {
          tooltip: {
            enabled: true,
          },
        },
      },
    });
  }

  /**
   * Evento cuando cambia la vigencia seleccionada
   */
  onVigenciaChange(event: SelectChangeEvent): void {
    console.log('Vigencia seleccionada:', event.value);
    this.selected = event.value;
    this.loadDataForYear();
  }

  /**
   * Evento cuando cambia el departamento seleccionado
   */
  onDepartmentChange(event: SelectChangeEvent): void {
    console.log('Departamento seleccionado:', event.value);
    this.departmentSelected = event.value;
    this.loadTownsForDepartment();
  }

  /**
   * Evento cuando cambia el municipio seleccionado
   */
  onTownChange(event: SelectChangeEvent): void {
    console.log('Municipio seleccionado:', event.value);
    this.townSelected = event.value;
    this.filterDataByLocation();
  }

  /**
   * Actualiza los datos cuando se presiona el botón Actualizar
   */
  updateData(): void {
    console.log('Actualizando datos...');
    console.log('Vigencia:', this.selected);
    console.log('Departamento:', this.departmentSelected);
    console.log('Municipio:', this.townSelected);
    
    // Aquí iría la lógica para actualizar los datos según los filtros seleccionados
    this.loadFilteredData();
  }

  /**
   * Carga los datos para el año seleccionado
   */
  private loadDataForYear(): void {
    console.log('Cargando datos para el año:', this.selected);
    // Lógica para cargar datos específicos del año
  }

  /**
   * Carga los municipios para el departamento seleccionado
   */
  private loadTownsForDepartment(): void {
    if (!this.departmentSelected) {
      this.towns = [];
      this.townSelected = '';
      return;
    }

    console.log('Cargando municipios para departamento:', this.departmentSelected);
    // Aquí iría la lógica para cargar municipios del departamento seleccionado
    // Por ahora mantenemos la lista de ejemplo
  }

  /**
   * Filtra los datos por ubicación (departamento/municipio)
   */
  private filterDataByLocation(): void {
    console.log('Filtrando datos por ubicación');
    // Lógica para filtrar datos según departamento y municipio
  }

  /**
   * Carga los datos filtrados según todos los criterios seleccionados
   */
  private loadFilteredData(): void {
    console.log('Cargando datos filtrados');
    // Aquí iría la lógica principal para cargar y filtrar todos los datos
    // según vigencia, departamento y municipio seleccionados
  }

  /**
   * Método legacy para compatibilidad (puede ser removido)
   */
  optionChange(evt: any): void {
    console.log('Option change (legacy):', evt);
    // Mantener por compatibilidad si es necesario
  }

  /**
   * Abre el diálogo de detalles
   */
  showDetailDialog(): void {
    this.visibleDlgDetail = true;
  }

  /**
   * Abre el diálogo de archivos
   */
  showFilesDialog(): void {
    this.visibleDlgFiles = true;
  }

  downloadFiles(data: any){
    console.log("downloadFiles")
  }
}