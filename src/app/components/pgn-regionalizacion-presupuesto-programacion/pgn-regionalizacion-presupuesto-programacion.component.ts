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

import { departamentos } from '../../data/departamentos';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-pgn-regionalizacion-presupuesto-programacion',
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
    Breadcrumb
  ],
  templateUrl: './pgn-regionalizacion-presupuesto-programacion.component.html',
  styleUrl: './pgn-regionalizacion-presupuesto-programacion.component.scss'
})
export class PgnRegionalizacionPresupuestoProgramacionComponent implements OnInit {

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  // Filter properties
  selectedVigencia: any;
  selectedPeriodo: any;
  selectedDepartamento: any;
  selectedFuente: any;

  // Loading state
  isLoading = false;

  // Data arrays
  vigencias: any[] = [];
  periodos: any[] = [];
  departamentos: any[] = [];
  fuentes: any[] = [];

  // Summary data
  resumenData = {
    totalPresupuesto: 84464235000000,
    totalPorcentaje: 100,
    regionalizado: 63426071000000,
    regionalizadoPorcentaje: 76.9,
    nacional: 17962351000000,
    nacionalPorcentaje: 21.8,
    porRegionalizar: 1075813000000,
    porRegionalizarPorcentaje: 1.3
  };

  // Table data
  departamentosData: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.items = [
        { label: 'PGN', routerLink: '/pgn-inicio' },
        { label: 'Regionalización Presupuesto Programación' }
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };

    this.initializeFilters();
    this.initializeDepartamentosData();
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

    // Initialize periods from 01 to 12
    this.periodos = [];
    for (let month = 1; month <= 12; month++) {
      const monthStr = month.toString().padStart(2, '0');
      this.periodos.push({
        label: monthStr,
        value: monthStr
      });
    }

    // Initialize departments
    this.departamentos = departamentos.map(dept => ({
      label: dept.nombre,
      value: dept.codigo
    }));

    // Initialize sources (example data)
    this.fuentes = [
      { label: 'Sistema General de Participaciones', value: 'SGP' },
      { label: 'Sistema General de Regalías', value: 'SGR' },
      { label: 'Recursos Propios', value: 'RP' },
      { label: 'Transferencias Nacionales', value: 'TN' },
      { label: 'Otras Fuentes', value: 'OF' }
    ];

    // Set default values
    this.selectedVigencia = this.vigencias[0];
    this.selectedPeriodo = this.periodos[0];
  }

  onVigenciaChange(event: SelectChangeEvent): void {
    console.log('Vigencia seleccionada:', event.value);
    this.selectedVigencia = event.value;
  }

  onPeriodoChange(event: SelectChangeEvent): void {
    console.log('Periodo seleccionado:', event.value);
    this.selectedPeriodo = event.value;
  }

  onDepartamentoChange(event: SelectChangeEvent): void {
    console.log('Departamento seleccionado:', event.value);
    this.selectedDepartamento = event.value;
  }

  onFuenteChange(event: SelectChangeEvent): void {
    console.log('Fuente seleccionada:', event.value);
    this.selectedFuente = event.value;
  }

  onActualizar(): void {
    console.log('Actualizando datos...');
    console.log('Vigencia:', this.selectedVigencia);
    console.log('Periodo:', this.selectedPeriodo);
    console.log('Departamento:', this.selectedDepartamento);
    console.log('Fuente:', this.selectedFuente);

    this.isLoading = true;

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      console.log('Datos actualizados');
    }, 2000);
  }

  clearFilters(): void {
    this.selectedVigencia = this.vigencias[0];
    this.selectedPeriodo = this.periodos[0];
    this.selectedDepartamento = null;
    this.selectedFuente = null;
    console.log('Filtros limpiados');
  }

  private initializeDepartamentosData(): void {
    this.departamentosData = [
      { departamento: 'Antioquia', vigencia: 5234567000000, perCapita: 8.5 },
      { departamento: 'Cundinamarca', vigencia: 4567890000000, perCapita: 7.2 },
      { departamento: 'Valle del Cauca', vigencia: 3456789000000, perCapita: 7.8 },
      { departamento: 'Atlántico', vigencia: 2987654000000, perCapita: 8.9 },
      { departamento: 'Santander', vigencia: 2876543000000, perCapita: 6.5 },
      { departamento: 'Bolívar', vigencia: 2345678000000, perCapita: 7.6 },
      { departamento: 'Córdoba', vigencia: 1987654000000, perCapita: 5.4 },
      { departamento: 'Huila', vigencia: 1876543000000, perCapita: 7.2 },
      { departamento: 'Tolima', vigencia: 1765432000000, perCapita: 6.8 },
      { departamento: 'Nariño', vigencia: 1654321000000, perCapita: 5.9 },
      { departamento: 'Meta', vigencia: 1543210000000, perCapita: 8.3 },
      { departamento: 'Boyacá', vigencia: 1432109000000, perCapita: 6.2 },
      { departamento: 'Cauca', vigencia: 1321098000000, perCapita: 5.8 },
      { departamento: 'Norte de Santander', vigencia: 1210987000000, perCapita: 6.7 },
      { departamento: 'Cesar', vigencia: 1109876000000, perCapita: 7.1 },
      { departamento: 'Magdalena', vigencia: 998765000000, perCapita: 5.6 },
      { departamento: 'La Guajira', vigencia: 887654000000, perCapita: 6.3 },
      { departamento: 'Sucre', vigencia: 776543000000, perCapita: 5.2 },
      { departamento: 'Casanare', vigencia: 665432000000, perCapita: 9.8 },
      { departamento: 'Chocó', vigencia: 554321000000, perCapita: 4.5 },
      { departamento: 'Caquetá', vigencia: 443210000000, perCapita: 6.4 },
      { departamento: 'Putumayo', vigencia: 332109000000, perCapita: 6.9 },
      { departamento: 'Quindío', vigencia: 221098000000, perCapita: 7.5 },
      { departamento: 'Risaralda', vigencia: 210987000000, perCapita: 7.8 },
      { departamento: 'Caldas', vigencia: 209876000000, perCapita: 7.2 },
      { departamento: 'Arauca', vigencia: 198765000000, perCapita: 6.0 },
      { departamento: 'San Andrés y Providencia', vigencia: 87654000000, perCapita: 8.9 },
      { departamento: 'Amazonas', vigencia: 76543000000, perCapita: 5.5 },
      { departamento: 'Guainía', vigencia: 65432000000, perCapita: 4.8 },
      { departamento: 'Guaviare', vigencia: 54321000000, perCapita: 5.2 },
      { departamento: 'Vaupés', vigencia: 43210000000, perCapita: 4.6 },
      { departamento: 'Vichada', vigencia: 32109000000, perCapita: 3.8 }
    ];
  }

  getTotalVigencia(): number {
    return this.departamentosData.reduce((sum, item) => sum + item.vigencia, 0);
  }

  getAveragePerCapita(): number {
    const total = this.departamentosData.reduce((sum, item) => sum + item.perCapita, 0);
    return Math.round((total / this.departamentosData.length) * 10) / 10;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  exportToExcel(): void {
    console.log('Exportando a Excel...');
    // Aquí se implementaría la lógica de exportación
  }
}