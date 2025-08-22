import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { Select, SelectChangeEvent } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { MultiSelect, MultiSelectChangeEvent } from 'primeng/multiselect';
import { ChartModule } from 'primeng/chart';

import { departamentos } from '../../data/departamentos';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-pgn-comparativa-regionalizacion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    ButtonModule,
    Select,
    FloatLabel,
    ProgressSpinnerModule,
    TableModule,
    MultiSelect,
    ChartModule
  ],
  templateUrl: './pgn-comparativa-regionalizacion.component.html',
  styleUrl: './pgn-comparativa-regionalizacion.component.scss'
})
export class PgnComparativaRegionalizacionComponent implements OnInit {

  // Filter properties
  selectedDepartamento: any;
  selectedVigencias: any[] = [];

  // Loading state
  isLoading = false;

  // Data arrays
  vigencias: any[] = [];
  departamentos: any[] = [];

  // Chart instances
  doughnutChart1: any;
  doughnutChart2: any;
  barChart: any;

  // Sample data for charts
  chartData1: any;
  chartData2: any;
  barChartData: any;
  barChartOptions: any;

  // Table data
  comparativaData: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.initializeFilters();
    this.initializeChartData();
    this.initializeComparativaData();
  }

  private initializeFilters(): void {
    // Initialize years from 2025 to 2002
    this.vigencias = [];
    for (let year = 2025; year >= 2002; year--) {
      this.vigencias.push({
        label: year.toString(),
        value: year.toString()
      });
    }

    // Initialize departments
    this.departamentos = departamentos.map(dept => ({
      label: dept.nombre,
      value: dept.codigo
    }));

    // Set default values
    this.selectedVigencias = [this.vigencias[0], this.vigencias[1]]; // 2025 and 2024
  }

  private initializeChartData(): void {
    // Semicircle Chart 1 data - Avance Porcentual
    this.chartData1 = {
      labels: ['Avance', 'Pendiente'],
      datasets: [{
        data: [76.9, 23.1],
        backgroundColor: ['#4CAF50', '#E0E0E0'],
        hoverBackgroundColor: ['#45a049', '#BDBDBD'],
        circumference: 180,
        rotation: 270
      }]
    };

    // Semicircle Chart 2 data - Avance Porcentual
    this.chartData2 = {
      labels: ['Avance', 'Pendiente'],
      datasets: [{
        data: [68.4, 31.6],
        backgroundColor: ['#2196F3', '#E0E0E0'],
        hoverBackgroundColor: ['#1976D2', '#BDBDBD'],
        circumference: 180,
        rotation: 270
      }]
    };

    // Bar chart data for all departments
    const allDepartments = this.departamentos.map(dept => dept.label);
    const departmentData = allDepartments.map(() => Math.floor(Math.random() * 40) + 60); // Random data between 60-100
    
    this.barChartData = {
      labels: allDepartments,
      datasets: [{
        label: 'Avance %',
        data: departmentData,
        backgroundColor: '#78c347ff',
        borderColor: '#3aa03fff',
        borderWidth: 1
      }]
    };

    this.barChartOptions = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 0.4,
      layout: {
        padding: {
          top: 5,
          bottom: 5,
          left: 5,
          right: 5
        }
      },
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: function(value: any) {
              return value + '%';
            }
          }
        },
        y: {
          ticks: {
            font: {
              size: 13
            }
          }
        }
      }
    };
  }

  private initializeComparativaData(): void {
    // Initialize with all departments data
    const departmentRows = this.departamentos.map(dept => {
      const baseValue2025 = Math.random() * 5000000000000 + 1000000000000;
      const baseValue2024 = Math.random() * 5000000000000 + 1000000000000;
      const variation = ((baseValue2025 - baseValue2024) / baseValue2024) * 100;
      
      return {
        departamento: dept.label,
        isTotal: false,
        '2025': baseValue2025,
        '2024': baseValue2024,
        variacion_2025_2024: variation
      };
    });

    // Calculate totals
    const total2025 = departmentRows.reduce((sum, dept) => sum + dept['2025'], 0);
    const total2024 = departmentRows.reduce((sum, dept) => sum + dept['2024'], 0);
    const totalVariation = ((total2025 - total2024) / total2024) * 100;

    const totalRow = {
      departamento: 'TOTAL NACIONAL',
      isTotal: true,
      '2025': total2025,
      '2024': total2024,
      variacion_2025_2024: totalVariation
    };

    this.comparativaData = [...departmentRows, totalRow];
  }

  onDepartamentoChange(event: SelectChangeEvent): void {
    console.log('Departamento seleccionado:', event.value);
    this.selectedDepartamento = event.value;
  }

  onVigenciasChange(event: MultiSelectChangeEvent): void {
    console.log('Vigencias seleccionadas:', event.value);
    this.selectedVigencias = event.value;
    this.updateComparativaData();
  }

  onActualizar(): void {
    console.log('Actualizando datos...');
    console.log('Departamento:', this.selectedDepartamento);
    console.log('Vigencias:', this.selectedVigencias);

    this.isLoading = true;

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      console.log('Datos actualizados');
      this.updateCharts();
    }, 2000);
  }

  clearFilters(): void {
    this.selectedDepartamento = null;
    this.selectedVigencias = [this.vigencias[0], this.vigencias[1]];
    this.updateComparativaData();
    console.log('Filtros limpiados');
  }

  private updateCharts(): void {
    // Update chart data based on filters
    // This would typically involve API calls
  }

  private updateComparativaData(): void {
    // Regenerate table structure based on selected years
    if (this.selectedVigencias.length === 0) return;

    const sortedYears = [...this.selectedVigencias].sort((a, b) => parseInt(b.value) - parseInt(a.value));
    
    // Generate new data structure for all departments
    const departmentRows = this.departamentos.map(dept => {
      const row: any = { departamento: dept.label, isTotal: false };
      
      sortedYears.forEach((year, index) => {
        // Simulate data for each year
        const baseValue = Math.random() * 5000000000000 + 1000000000000;
        row[year.value] = baseValue;
        
        // Calculate variation only for pairs of consecutive years (every 2 years)
        if (index > 0 && index % 2 === 1) {
          const prevYear = sortedYears[index - 1];
          const currentYear = sortedYears[index];
          const variation = ((row[prevYear.value] - row[currentYear.value]) / row[currentYear.value]) * 100;
          row[`variacion_${prevYear.value}_${currentYear.value}`] = variation;
        }
      });
      
      return row;
    });

    // Calculate totals row
    const totalRow: any = { departamento: 'TOTAL NACIONAL', isTotal: true };
    
    sortedYears.forEach((year, index) => {
      // Sum all department values for this year
      const totalForYear = departmentRows.reduce((sum, dept) => sum + dept[year.value], 0);
      totalRow[year.value] = totalForYear;
      
      // Calculate variation for totals
      if (index > 0 && index % 2 === 1) {
        const prevYear = sortedYears[index - 1];
        const currentYear = sortedYears[index];
        const variation = ((totalRow[prevYear.value] - totalRow[currentYear.value]) / totalRow[currentYear.value]) * 100;
        totalRow[`variacion_${prevYear.value}_${currentYear.value}`] = variation;
      }
    });

    // Combine departments and total
    this.comparativaData = [...departmentRows, totalRow];
  }

  getSelectedYearsColumns(): string[] {
    if (!this.selectedVigencias) return [];
    return this.selectedVigencias
      .map(v => v.value)
      .sort((a, b) => parseInt(b) - parseInt(a));
  }

  getVariationColumns(): string[] {
    const years = this.getSelectedYearsColumns();
    const variations: string[] = [];
    
    // Add variation columns only for pairs (every 2 years)
    for (let i = 1; i < years.length; i += 2) {
      variations.push(`variacion_${years[i-1]}_${years[i]}`);
    }
    
    return variations;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  formatPercentage(value: number): string {
    if (value === undefined || value === null || isNaN(value)) {
      return 'N/A';
    }
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  }

  getVariationClass(value: number): string {
    if (value === undefined || value === null || isNaN(value)) {
      return '';
    }
    return value >= 0 ? 'variation-positive' : 'variation-negative';
  }

  exportToExcel(): void {
    console.log('Exportando a Excel...');
    // Export logic would be implemented here
  }

  getBarChartTitle(): string {
    const selectedYear = this.selectedVigencias.length > 0 ? this.selectedVigencias[0].value : '2025';
    return `Avance Inversión Regional PGN ${selectedYear}`;
  }

  getTotalColumns(): number {
    const yearColumns = this.getSelectedYearsColumns().length;
    const variationColumns = this.getVariationColumns().length;
    return 1 + yearColumns + variationColumns; // 1 for department column + year columns + variation columns
  }

  getTableStyleClass(): string {
    const baseClass = 'p-datatable-sm p-datatable-striped';
    const horizontalScrollClass = this.getTotalColumns() > 4 ? 'horizontal-scroll' : '';
    return `${baseClass} ${horizontalScrollClass}`.trim();
  }
}