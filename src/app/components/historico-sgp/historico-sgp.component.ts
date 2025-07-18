import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { HttpClientModule } from '@angular/common/http';

// PrimeNG imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Select, SelectChangeEvent } from 'primeng/select';
import { MultiSelect, MultiSelectChangeEvent } from 'primeng/multiselect';
import { FloatLabel } from 'primeng/floatlabel';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';

import { NumberFormatPipe } from '../../utils/numberFormatPipe';
import { departamentos } from '../../data/departamentos';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-historico-sgp',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatGridListModule,
    HttpClientModule,
    TableModule,
    ButtonModule,
    Select,
    MultiSelect,
    FloatLabel,
    ChartModule,
    CardModule,
    NumberFormatPipe
  ],
  templateUrl: './historico-sgp.component.html',
  styleUrl: './historico-sgp.component.scss'
})
export class HistoricoSgpComponent implements OnInit {
  
  // Configuración responsiva para gráficos
  cols: number = 2;
  
  // Variables para filtros
  selectedYears: string[] = [];
  departmentSelected: string = '';
  townSelected: string = '';

  // Datos de años disponibles
  infoResume: any[] = [];
  sgpData: any = null;
  territorialEntities: any[] = [];

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

  // Datos de la tabla
  tableData: any = [];
  totalValue: number = 0;

  // Variables para gráficos
  chartData5Left: any; // Evolución Educación SGP - Precios Corrientes
  chartData5Right: any; // Evolución Educación SGP - Precios Constantes
  chartData6Left: any; // Evolución Salud SGP - Precios Corrientes
  chartData6Right: any; // Evolución Salud SGP - Precios Constantes
  chartData7Left: any; // Evolución Agua Potable SGP - Precios Corrientes
  chartData7Right: any; // Evolución Agua Potable SGP - Precios Constantes
  chartData8Left: any; // Evolución Propósito General SGP - Precios Corrientes
  chartData8Right: any; // Evolución Propósito General SGP - Precios Constantes
  chartData9Left: any; // Evolución Asignaciones Especiales SGP - Precios Corrientes
  chartData9Right: any; // Evolución Asignaciones Especiales SGP - Precios Constantes

  // Opciones para los gráficos
  smallMixedChartOptions: any;

  constructor(private breakpointObserver: BreakpointObserver, private http: HttpClient) {
    // Configuración responsiva
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large
    ]).pipe(
      map(result => {
        if (result.breakpoints[Breakpoints.XSmall]) {
          return 1;
        } else if (result.breakpoints[Breakpoints.Small]) {
          return 1;
        } else if (result.breakpoints[Breakpoints.Medium]) {
          return 2;
        }
        return 2;
      })
    ).subscribe(cols => this.cols = cols);
  }

  ngOnInit(): void {
    this.loadSgpData();
    this.loadTerritorialEntities();
    this.initializeChartOptions();
    this.initializeAllCharts();
    console.log('Historico SGP Component initialized');
  }

  /**
   * Carga los datos del SGP desde el archivo JSON
   */
  loadSgpData(): void {
    this.http.get('assets/data/sgp/sgp-data_agrupado_vigencia_dpto_test.json').subscribe({
      next: (data: any) => {
        this.sgpData = data;
        if (data.summary && data.summary.vigencias_found) {
          this.infoResume = data.summary.vigencias_found.map((year: string) => ({ year }));
          this.initializeDefaultSelection();
          this.initializeTableData();
        }
      },
      error: (error) => {
        console.error('Error loading SGP data:', error);
      }
    });
  }

  /**
   * Carga las entidades territoriales desde el archivo JSON
   */
  loadTerritorialEntities(): void {
    this.http.get('assets/data/territorial-entities-detail.json').subscribe({
      next: (data: any) => {
        this.territorialEntities = data;
      },
      error: (error) => {
        console.error('Error loading territorial entities:', error);
      }
    });
  }

  /**
   * Inicializa la selección predeterminada con los últimos 4 años
   */
  initializeDefaultSelection(): void {
    if (this.infoResume.length === 0) return;
    
    // Ordenar los años de mayor a menor y tomar los primeros 4
    const sortedYears = this.infoResume
      .map((item: any) => item.year)
      .sort((a: string, b: string) => parseInt(b) - parseInt(a))
      .slice(0, 4);
    
    this.selectedYears = sortedYears;
    console.log('Años seleccionados por defecto:', this.selectedYears);
  }

  /**
   * Inicializa las opciones de los gráficos
   */
  initializeChartOptions(): void {
    this.smallMixedChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Años'
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Miles de millones COP'
          },
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          position: 'bottom' as const,
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: '#004583',
          borderWidth: 1
        }
      }
    };
  }

  /**
   * Inicializa todos los gráficos con datos de ejemplo
   */
  initializeAllCharts(): void {
    const years = ['2020', '2021', '2022', '2023', '2024'];
    
    // Datos de ejemplo para Educación
    this.chartData5Left = {
      labels: years,
      datasets: [
        {
          label: 'Educación SGP (Corrientes)',
          data: [25000, 27000, 28500, 30000, 32000],
          borderColor: '#FF6384',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.4
        }
      ]
    };

    this.chartData5Right = {
      labels: years,
      datasets: [
        {
          label: 'Educación SGP (Constantes)',
          data: [23000, 24500, 25200, 26000, 27500],
          borderColor: '#36A2EB',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.4
        }
      ]
    };

    // Datos de ejemplo para Salud
    this.chartData6Left = {
      labels: years,
      datasets: [
        {
          label: 'Salud SGP (Corrientes)',
          data: [24000, 26000, 27500, 29000, 31000],
          borderColor: '#4BC0C0',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4
        }
      ]
    };

    this.chartData6Right = {
      labels: years,
      datasets: [
        {
          label: 'Salud SGP (Constantes)',
          data: [22000, 23500, 24200, 25000, 26500],
          borderColor: '#9966FF',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          tension: 0.4
        }
      ]
    };

    // Datos de ejemplo para Agua Potable
    this.chartData7Left = {
      labels: years,
      datasets: [
        {
          label: 'Agua Potable SGP (Corrientes)',
          data: [6000, 6500, 6800, 7000, 7200],
          borderColor: '#FF9F40',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          tension: 0.4
        }
      ]
    };

    this.chartData7Right = {
      labels: years,
      datasets: [
        {
          label: 'Agua Potable SGP (Constantes)',
          data: [5500, 5900, 6000, 6100, 6300],
          borderColor: '#FF6384',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.4
        }
      ]
    };

    // Datos de ejemplo para Propósito General
    this.chartData8Left = {
      labels: years,
      datasets: [
        {
          label: 'Propósito General SGP (Corrientes)',
          data: [7000, 7500, 7800, 8000, 8300],
          borderColor: '#4BC0C0',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4
        }
      ]
    };

    this.chartData8Right = {
      labels: years,
      datasets: [
        {
          label: 'Propósito General SGP (Constantes)',
          data: [6500, 6800, 6900, 7000, 7200],
          borderColor: '#36A2EB',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.4
        }
      ]
    };

    // Datos de ejemplo para Asignaciones Especiales
    this.chartData9Left = {
      labels: years,
      datasets: [
        {
          label: 'Asignaciones Especiales SGP (Corrientes)',
          data: [2000, 2200, 2400, 2500, 2600],
          borderColor: '#9966FF',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          tension: 0.4
        }
      ]
    };

    this.chartData9Right = {
      labels: years,
      datasets: [
        {
          label: 'Asignaciones Especiales SGP (Constantes)',
          data: [1800, 2000, 2100, 2200, 2300],
          borderColor: '#FF9F40',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          tension: 0.4
        }
      ]
    };
  }

  /**
   * Inicializa los datos de la tabla
   */
  initializeTableData(): void {
    // Usar los años seleccionados por defecto para inicializar la tabla
    this.updateTableData();
  }

  /**
   * Calcula el total de los valores en la tabla
   */
  calculateTotal(): void {
    this.totalValue = this.tableData.reduce((sum: number, item: any) => sum + item.value, 0);
  }

  /**
   * Evento cuando cambian las vigencias seleccionadas
   */
  onVigenciaChange(event: MultiSelectChangeEvent): void {
    console.log('Vigencias seleccionadas:', event.value);
    this.selectedYears = event.value;
    this.updateTableData();
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
  }

  /**
   * Aplica los filtros seleccionados
   */
  applyFilters(): void {
    console.log('Aplicando filtros...');
    console.log('Vigencias:', this.selectedYears);
    console.log('Departamento:', this.departmentSelected);
    console.log('Municipio:', this.townSelected);
    this.updateTableData();
    this.updateCharts();
  }

  /**
   * Limpia todos los filtros
   */
  clearFilters(): void {
    console.log('Limpiando filtros...');
    this.selectedYears = [];
    this.departmentSelected = '';
    this.townSelected = '';
    this.initializeTableData();
  }

  /**
   * Exporta los datos a Excel
   */
  exportToExcel(): void {
    console.log('Exportando a Excel...');
    // Aquí iría la lógica para exportar a Excel
  }

  /**
   * Exporta los datos a PDF
   */
  exportToPDF(): void {
    console.log('Exportando a PDF...');
    // Aquí iría la lógica para exportar a PDF
  }

  /**
   * Actualiza los datos de la tabla según los filtros
   */
  private updateTableData(): void {
    if (this.selectedYears.length === 0) {
      this.tableData = [];
      this.totalValue = 0;
      return;
    }

    // Filtrar datos según años seleccionados
    const filteredData = this.infoResume
      .filter((item: any) => this.selectedYears.includes(item.year))
      .map((item : any) => ({
        year: item.year,
        source: 'SGP Nacional',
        value: parseInt(item.budget)
      }))
      .sort((a: { year: string; }, b: { year: string; }) => parseInt(b.year) - parseInt(a.year)); // Ordenar por año descendente

    this.tableData = filteredData;
    this.calculateTotal();
  }

  /**
   * Actualiza los gráficos según los filtros
   */
  private updateCharts(): void {
    if (this.selectedYears.length === 0) {
      this.initializeAllCharts();
      return;
    }

    // Actualizar gráficos con datos filtrados
    console.log('Actualizando gráficos para años:', this.selectedYears);
    // Aquí iría la lógica para actualizar los gráficos según los filtros
  }

  /**
   * Carga los municipios para el departamento seleccionado
   */
  private loadTownsForDepartment(): void {
    if (!this.departmentSelected || this.territorialEntities.length === 0) {
      this.towns = [];
      this.townSelected = '';
      return;
    }

    console.log('Cargando municipios para departamento:', this.departmentSelected);
    
    // Transformar código del departamento: remover cero a la izquierda y agregar tres ceros
    const departmentCode = this.departmentSelected.replace(/^0+/, '') + '000';
    const departmentCodeNumber = parseInt(departmentCode);
    
    console.log('Código transformado:', departmentCodeNumber);
    
    // Filtrar municipios por codPadre y excluir el departamento mismo
    this.towns = this.territorialEntities
      .filter(entity => 
        entity.codPadre === departmentCodeNumber && 
        entity.codigo !== departmentCodeNumber
      )
      .map(entity => ({
        name: entity.entidad,
        value: entity.codigo2 || entity.codigo
      }));
    
    console.log('Municipios encontrados:', this.towns);
    this.townSelected = '';
  }
}