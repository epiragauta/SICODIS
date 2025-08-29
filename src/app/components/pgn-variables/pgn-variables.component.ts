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

@Component({
  selector: 'app-pgn-variables',
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
    TableModule
  ],
  templateUrl: './pgn-variables.component.html',
  styleUrl: './pgn-variables.component.scss'
})
export class PgnVariablesComponent implements OnInit {

  // Filter properties
  selectedVigencia: any;
  selectedDepartamento: any;
  selectedMunicipio: any;

  // Loading state
  isLoading = false;

  // Data arrays
  vigencias: any[] = [];
  departamentos: any[] = [];
  municipios: any[] = [];

  // Eficiencia Fiscal data
  eficienciaFiscalTable1: any[] = [];
  eficienciaFiscalTable2: any[] = [];

  // Eficiencia Administrativa data
  eficienciaAdministrativaTable1: any[] = [];
  eficienciaAdministrativaTable2: any[] = [];
  
  // Sub-cards state
  subCardStates = {
    onceDoceavas: false,
    restriccion50: false,
    variablesCensales: false
  };

  // Once Doceavas data
  onceDoceavasTable1: any[] = [];
  onceDoceavasTable2: any[] = [];

  // Restricción 50% data
  restriccion50Table1: any[] = [];
  restriccion50Table2: any[] = [];

  // Variables Censales data
  variablesCensalesTable1: any[] = [];
  variablesCensalesTable2: any[] = [];

  // Last updated date
  lastUpdated = '31 de agosto de 2024';

  constructor() {}

  ngOnInit(): void {
    this.initializeFilters();
    this.initializeData();
  }

  private initializeFilters(): void {
    // Initialize years from 2024 to 2002
    this.vigencias = [];
    for (let year = 2024; year >= 2002; year--) {
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

    // Initialize municipalities (will be populated based on department selection)
    this.municipios = [];
  }

  private initializeData(): void {
    // Eficiencia Fiscal Table 1 data
    this.eficienciaFiscalTable1 = [
      {
        vigencia: '2023',
        anoRefrendado: 2023,
        ingresosTributarios: 125000000,
        poblacion: 48258494,
        perCapita: 2591,
        crecimientoPerCapita: 5.2,
        promedioCrecimiento: 4.8
      },
      {
        vigencia: '2022',
        anoRefrendado: 2022,
        ingresosTributarios: 118500000,
        poblacion: 47610000,
        perCapita: 2489,
        crecimientoPerCapita: 4.1,
        promedioCrecimiento: 4.8
      },
      {
        vigencia: '2021',
        anoRefrendado: 2021,
        ingresosTributarios: 112800000,
        poblacion: 46951000,
        perCapita: 2403,
        crecimientoPerCapita: 3.9,
        promedioCrecimiento: 4.8
      },
      {
        vigencia: '2020',
        anoRefrendado: 2020,
        ingresosTributarios: 107200000,
        poblacion: 46295000,
        perCapita: 2316,
        crecimientoPerCapita: 6.1,
        promedioCrecimiento: 4.8
      }
    ];

    // Eficiencia Fiscal Table 2 data
    this.eficienciaFiscalTable2 = [
      {
        vigencia: '2019',
        anoRefrendado: 2019,
        ingresosTributarios: 101500000,
        poblacion: 45642000,
        perCapita: 2224,
        crecimientoPerCapita: 4.5,
        promedioCrecimiento: 4.8
      },
      {
        vigencia: '2018',
        anoRefrendado: 2018,
        ingresosTributarios: 97100000,
        poblacion: 44996000,
        perCapita: 2158,
        crecimientoPerCapita: 3.8,
        promedioCrecimiento: 4.8
      },
      {
        vigencia: '2017',
        anoRefrendado: 2017,
        ingresosTributarios: 93600000,
        poblacion: 44362000,
        perCapita: 2110,
        crecimientoPerCapita: 5.7,
        promedioCrecimiento: 4.8
      },
      {
        vigencia: '2016',
        anoRefrendado: 2016,
        ingresosTributarios: 89200000,
        poblacion: 43739000,
        perCapita: 2040,
        crecimientoPerCapita: 4.2,
        promedioCrecimiento: 4.8
      }
    ];

    // Eficiencia Administrativa Table 1 data
    this.eficienciaAdministrativaTable1 = [
      {
        anoCertificado: 2023,
        icld: 78.5,
        gf: 65.2,
        lg: 85.6,
        razon: 0.831,
        holgura: 20.4
      }
    ];

    // Eficiencia Administrativa Table 2 data
    this.eficienciaAdministrativaTable2 = [
      {
        anoCertificado: 2022,
        icld: 76.8,
        gf: 63.1,
        lg: 82.3,
        razon: 0.822,
        holgura: 19.2
      }
    ];

    // Once Doceavas Table 1 data
    this.onceDoceavasTable1 = [
      { variable: 'Población', valor: '48,258,494', isTotal: false },
      { variable: 'Pobreza', valor: '15.1%', isTotal: false },
      { variable: 'Eficiencia Fiscal', valor: '68.5%', isTotal: false },
      { variable: 'Eficiencia Administrativa', valor: '72.3%', isTotal: false },
      { variable: 'Sisben', valor: '14,577,348', isTotal: false },
      { variable: 'TOTAL', valor: '$2,847,562,150,000', isTotal: true }
    ];

    // Once Doceavas Table 2 data
    this.onceDoceavasTable2 = [
      { variable: 'Población', valor: '47,610,368', isTotal: false },
      { variable: 'Pobreza', valor: '16.8%', isTotal: false },
      { variable: 'Eficiencia Fiscal', valor: '65.2%', isTotal: false },
      { variable: 'Eficiencia Administrativa', valor: '70.1%', isTotal: false },
      { variable: 'Sisben', valor: '14,283,110', isTotal: false },
      { variable: 'TOTAL', valor: '$2,698,455,320,000', isTotal: true }
    ];

    // Restricción 50% Table 1 data
    this.restriccion50Table1 = [
      { variable: 'Población + Pobreza', valor: '$1,423,781,075,000' },
      { variable: 'Restricción del 50%', valor: '$711,890,537,500' }
    ];

    // Restricción 50% Table 2 data
    this.restriccion50Table2 = [
      { variable: 'Población + Pobreza', valor: '$1,498,334,295,000' },
      { variable: 'Restricción del 50%', valor: '$749,167,147,500' }
    ];

    // Variables Censales Table 1 data
    this.variablesCensalesTable1 = [
      { variable: 'Población', valor: '47,610,368' },
      { variable: 'Pobreza - NBI (%)', valor: '16.8%' }
    ];

    // Variables Censales Table 2 data
    this.variablesCensalesTable2 = [
      { variable: 'Población', valor: '48,258,494' },
      { variable: 'Pobreza - NBI (%)', valor: '15.1%' }
    ];
  }

  onVigenciaChange(event: SelectChangeEvent): void {
    console.log('Vigencia seleccionada:', event.value);
    this.selectedVigencia = event.value;
  }

  onDepartamentoChange(event: SelectChangeEvent): void {
    console.log('Departamento seleccionado:', event.value);
    this.selectedDepartamento = event.value;
    
    // Update municipalities based on selected department
    if (this.selectedDepartamento) {
      this.updateMunicipios(this.selectedDepartamento);
    } else {
      this.municipios = [];
    }
    
    this.selectedMunicipio = null;
  }

  onMunicipioChange(event: SelectChangeEvent): void {
    console.log('Municipio seleccionado:', event.value);
    this.selectedMunicipio = event.value;
  }

  private updateMunicipios(departamentoCode: string): void {
    // Mock municipalities data based on department
    const mockMunicipios = [
      { label: 'Municipio 1', value: '001' },
      { label: 'Municipio 2', value: '002' },
      { label: 'Municipio 3', value: '003' },
      { label: 'Municipio 4', value: '004' },
      { label: 'Municipio 5', value: '005' }
    ];

    this.municipios = mockMunicipios;
  }

  onAplicar(): void {
    console.log('Aplicando filtros...');
    console.log('Vigencia:', this.selectedVigencia);
    console.log('Departamento:', this.selectedDepartamento);
    console.log('Municipio:', this.selectedMunicipio);

    this.isLoading = true;

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      console.log('Filtros aplicados');
    }, 2000);
  }

  clearFilters(): void {
    this.selectedVigencia = null;
    this.selectedDepartamento = null;
    this.selectedMunicipio = null;
    this.municipios = [];
    console.log('Filtros limpiados');
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

  formatDecimal(value: number): string {
    return value.toFixed(3);
  }

  toggleSubCard(cardName: string): void {
    if (cardName === 'onceDoceavas') {
      this.subCardStates.onceDoceavas = !this.subCardStates.onceDoceavas;
    } else if (cardName === 'restriccion50') {
      this.subCardStates.restriccion50 = !this.subCardStates.restriccion50;
    } else if (cardName === 'variablesCensales') {
      this.subCardStates.variablesCensales = !this.subCardStates.variablesCensales;
    }
  }

  getCurrentYear(): string {
    return this.selectedVigencia?.label || '2025';
  }

  getPreviousYear(): string {
    const currentYear = parseInt(this.getCurrentYear());
    return (currentYear - 1).toString();
  }
}