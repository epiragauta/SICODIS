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
import { EficienciasService, ResumenMunicipioEficiencia } from '../../services/sicodis-api.service';

@Component({
  selector: 'app-sgp-eficiencias',
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
  templateUrl: './sgp-eficiencias.component.html',
  styleUrl: './sgp-eficiencias.component.scss'
})
export class SgpEficienciasComponent implements OnInit {

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

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

  // API data
  resumenMunicipio: ResumenMunicipioEficiencia | null = null;
  errorMessage: string | null = null;

  constructor(private eficienciasService: EficienciasService) {}

  ngOnInit(): void {
    this.items = [
        { label: 'SGP', routerLink: '/sgp-inicio' },
        { label: 'Eficiencias' }        
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };
    
    this.initializeFilters();
    this.initializeData();
  }

  private initializeFilters(): void {
    // Initialize years from 2025 to 2020
    this.vigencias = [];
    for (let year = 2025; year >= 2020; year--) {
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
    console.log('Vigencia seleccionada:', this.selectedVigencia);
    // El valor ya está en this.selectedVigencia gracias a [(ngModel)] y optionValue
  }

  onDepartamentoChange(event: SelectChangeEvent): void {
    console.log('Departamento seleccionado:', this.selectedDepartamento);

    // Update municipalities based on selected department
    if (this.selectedDepartamento) {
      this.updateMunicipios(this.selectedDepartamento);
    } else {
      this.municipios = [];
    }

    // Clear municipio when department changes
    this.selectedMunicipio = null;
  }

  onMunicipioChange(event: SelectChangeEvent): void {
    console.log('Municipio seleccionado:', this.selectedMunicipio);
    // El valor ya está en this.selectedMunicipio gracias a [(ngModel)] y optionValue
  }

  private updateMunicipios(departamentoCode: string): void {
    console.log('Cargando municipios para departamento:', departamentoCode);

    // Cargar todos los municipios y filtrar por departamento
    this.eficienciasService.getMunicipios().subscribe({
      next: (municipios) => {
        // Filtrar municipios por departamento (los primeros 2 dígitos del código DANE)
        this.municipios = municipios
          .filter(m => m.codigo_dane.startsWith(departamentoCode))
          .map(m => ({
            label: m.municipio,
            value: m.codigo_dane.substring(2) // Usar solo los últimos 3 dígitos
          }))
          .sort((a, b) => a.label.localeCompare(b.label));

        console.log('Municipios cargados:', this.municipios.length);
      },
      error: (err) => {
        console.error('Error cargando municipios:', err);
        // Usar datos mock si falla
        this.municipios = [
          { label: 'Municipio 1', value: '001' },
          { label: 'Municipio 2', value: '002' },
          { label: 'Municipio 3', value: '003' }
        ];
      }
    });
  }

  onAplicar(): void {
    console.log('Aplicando filtros...');
    console.log('Vigencia:', this.selectedVigencia);
    console.log('Departamento:', this.selectedDepartamento);
    console.log('Municipio:', this.selectedMunicipio);

    if (!this.selectedMunicipio || !this.selectedVigencia) {
      console.warn('Seleccione municipio y vigencia');
      return;
    }

    const codigoDane = this.selectedDepartamento + this.selectedMunicipio;
    this.loadDatosReales(codigoDane, parseInt(this.selectedVigencia));
  }

  /**
   * Cargar datos reales desde la API de eficiencias
   */
  loadDatosReales(codigoDane: string, vigencia: number): void {
    this.isLoading = true;
    this.errorMessage = null;

    console.log('Cargando datos para código DANE:', codigoDane, 'vigencia:', vigencia);

    this.eficienciasService.getResumenMunicipio(codigoDane).subscribe({
      next: (data) => {
        this.resumenMunicipio = data;
        this.procesarDatosAPI(data, vigencia);
        this.isLoading = false;
        console.log('Datos cargados exitosamente:', data);
      },
      error: (err) => {
        console.error('Error cargando datos de eficiencias:', err);
        this.errorMessage = 'Error al cargar los datos: ' + err.message;
        this.isLoading = false;
        // Mantener datos mock si falla la API
        console.log('Usando datos de ejemplo debido al error');
      }
    });
  }

  /**
   * Procesar datos de la API y actualizar las tablas
   * @param data Datos del resumen del municipio
   * @param vigencia Año de vigencia SGP seleccionado
   */
  private procesarDatosAPI(data: ResumenMunicipioEficiencia, vigencia: number): void {
    console.log('Procesando datos para vigencia:', vigencia);

    // ============================================================================
    // EFICIENCIA FISCAL - Tabla 1 (Vigencia Anterior)
    // ============================================================================
    this.eficienciaFiscalTable1 = [];
    const vigenciaAnterior = vigencia - 1;

    // Generar 4 filas para vigencia anterior (vigencia-3 a vigencia)
    const perCapitasTable1: number[] = [];
    for (let v = vigenciaAnterior - 3; v <= vigenciaAnterior; v++) {
      const anoRefrendado = v - 2;
      const ingreso = data.ingresos_tributarios.find(i => i.anio === anoRefrendado);
      const pob = data.poblacion.find(p => p.anio === anoRefrendado);

      const ingresoValor = ingreso?.valor ?? 0;
      const poblacionValor = pob?.poblacion ?? 0;
      const perCapita = poblacionValor > 0 ? ingresoValor / poblacionValor : 0;

      perCapitasTable1.push(perCapita);

      this.eficienciaFiscalTable1.push({
        vigencia: v.toString(),
        anoRefrendado: anoRefrendado,
        ingresosTributarios: ingresoValor,
        poblacion: poblacionValor,
        perCapita: Math.round(perCapita),
        crecimientoPerCapita: 0, // Se calcula después
        promedioCrecimiento: 0
      });
    }

    // Calcular crecimiento per cápita para tabla 1
    for (let i = 1; i < this.eficienciaFiscalTable1.length; i++) {
      const perCapitaActual = perCapitasTable1[i];
      const perCapitaAnterior = perCapitasTable1[i - 1];

      if (perCapitaAnterior > 0) {
        const crecimiento = ((perCapitaActual - perCapitaAnterior) / perCapitaAnterior) * 100;
        this.eficienciaFiscalTable1[i].crecimientoPerCapita = crecimiento;
      }
    }

    // Calcular promedio de crecimiento para tabla 1
    const crecimientosTable1 = this.eficienciaFiscalTable1
      .slice(1)
      .map(r => r.crecimientoPerCapita)
      .filter(c => c !== 0);

    const promedioTable1 = crecimientosTable1.length > 0
      ? crecimientosTable1.reduce((a, b) => a + b, 0) / crecimientosTable1.length
      : 0;

    this.eficienciaFiscalTable1.forEach(row => row.promedioCrecimiento = promedioTable1);

    // ============================================================================
    // EFICIENCIA FISCAL - Tabla 2 (Vigencia Seleccionada)
    // ============================================================================
    this.eficienciaFiscalTable2 = [];

    // Generar 4 filas para vigencia seleccionada (vigencia-2 a vigencia+1)
    const perCapitasTable2: number[] = [];
    for (let v = vigencia - 2; v <= vigencia + 1; v++) {
      const anoRefrendado = v - 2;
      const ingreso = data.ingresos_tributarios.find(i => i.anio === anoRefrendado);
      const pob = data.poblacion.find(p => p.anio === anoRefrendado);

      const ingresoValor = ingreso?.valor ?? 0;
      const poblacionValor = pob?.poblacion ?? 0;
      const perCapita = poblacionValor > 0 ? ingresoValor / poblacionValor : 0;

      perCapitasTable2.push(perCapita);

      this.eficienciaFiscalTable2.push({
        vigencia: v.toString(),
        anoRefrendado: anoRefrendado,
        ingresosTributarios: ingresoValor,
        poblacion: poblacionValor,
        perCapita: Math.round(perCapita),
        crecimientoPerCapita: 0, // Se calcula después
        promedioCrecimiento: 0
      });
    }

    // Calcular crecimiento per cápita para tabla 2
    for (let i = 1; i < this.eficienciaFiscalTable2.length; i++) {
      const perCapitaActual = perCapitasTable2[i];
      const perCapitaAnterior = perCapitasTable2[i - 1];

      if (perCapitaAnterior > 0) {
        const crecimiento = ((perCapitaActual - perCapitaAnterior) / perCapitaAnterior) * 100;
        this.eficienciaFiscalTable2[i].crecimientoPerCapita = crecimiento;
      }
    }

    // Calcular promedio de crecimiento para tabla 2
    const crecimientosTable2 = this.eficienciaFiscalTable2
      .slice(1)
      .map(r => r.crecimientoPerCapita)
      .filter(c => c !== 0);

    const promedioTable2 = crecimientosTable2.length > 0
      ? crecimientosTable2.reduce((a, b) => a + b, 0) / crecimientosTable2.length
      : 0;

    this.eficienciaFiscalTable2.forEach(row => row.promedioCrecimiento = promedioTable2);

    // ============================================================================
    // EFICIENCIA ADMINISTRATIVA
    // ============================================================================
    this.eficienciaAdministrativaTable1 = [];
    this.eficienciaAdministrativaTable2 = [];

    // Función auxiliar para validar valores centinela en vigencia_2026
    const esValorValido = (v: number | null | undefined): boolean => {
      return v !== null && v !== undefined && v <= 1;
    };

    // Tabla 1: Vigencia Anterior, Año Certificado = (vigencia - 1) - 2
    const anoCertificadoTable1 = vigenciaAnterior - 2;
    const indEATable1 = data.eficiencia_administrativa.find(e => e.anio === anoCertificadoTable1);

    // Usar vigencia_2026 solo si el año certificado corresponde a 2024 (vigencia 2026)
    if (anoCertificadoTable1 === 2024 && data.vigencia_2026 && esValorValido(data.vigencia_2026.razon)) {
      this.eficienciaAdministrativaTable1 = [{
        anoCertificado: anoCertificadoTable1,
        icld: esValorValido(data.vigencia_2026.icld) ? data.vigencia_2026.icld : null,
        gf: esValorValido(data.vigencia_2026.gf) ? data.vigencia_2026.gf : null,
        lg: esValorValido(data.vigencia_2026.lg) ? data.vigencia_2026.lg : null,
        razon: esValorValido(data.vigencia_2026.razon) ? data.vigencia_2026.razon : null,
        holgura: esValorValido(data.vigencia_2026.holgura) ? data.vigencia_2026.holgura : null
      }];
    } else {
      // Para años históricos, solo mostrar el indicador EA como razon
      this.eficienciaAdministrativaTable1 = [{
        anoCertificado: anoCertificadoTable1,
        icld: null,
        gf: null,
        lg: null,
        razon: indEATable1?.valor ?? null,
        holgura: null
      }];
    }

    // Tabla 2: Vigencia Seleccionada, Año Certificado = vigencia - 2
    const anoCertificadoTable2 = vigencia - 2;
    const indEATable2 = data.eficiencia_administrativa.find(e => e.anio === anoCertificadoTable2);

    // Usar vigencia_2026 solo si el año certificado corresponde a 2024 (vigencia 2026)
    if (anoCertificadoTable2 === 2024 && data.vigencia_2026 && esValorValido(data.vigencia_2026.razon)) {
      this.eficienciaAdministrativaTable2 = [{
        anoCertificado: anoCertificadoTable2,
        icld: esValorValido(data.vigencia_2026.icld) ? data.vigencia_2026.icld : null,
        gf: esValorValido(data.vigencia_2026.gf) ? data.vigencia_2026.gf : null,
        lg: esValorValido(data.vigencia_2026.lg) ? data.vigencia_2026.lg : null,
        razon: esValorValido(data.vigencia_2026.razon) ? data.vigencia_2026.razon : null,
        holgura: esValorValido(data.vigencia_2026.holgura) ? data.vigencia_2026.holgura : null
      }];
    } else {
      // Para años históricos, solo mostrar el indicador EA como razon
      this.eficienciaAdministrativaTable2 = [{
        anoCertificado: anoCertificadoTable2,
        icld: null,
        gf: null,
        lg: null,
        razon: indEATable2?.valor ?? null,
        holgura: null
      }];
    }

    // ============================================================================
    // ONCE DOCEAVAS
    // ============================================================================
    // Tabla 1: Vigencia Anterior (vigencia - 1)
    const recursosTable1 = data.recursos_proposito_general.find(r => r.anio === vigenciaAnterior);

    if (recursosTable1) {
      const totalTable1 =
        (recursosTable1.poblacion || 0) +
        (recursosTable1.pobreza || 0) +
        (recursosTable1.eficiencia_fiscal || 0) +
        (recursosTable1.eficiencia_administrativa || 0) +
        (recursosTable1.sisben || 0);

      this.onceDoceavasTable1 = [
        { variable: 'Población', valor: this.formatNumber(recursosTable1.poblacion), isTotal: false },
        { variable: 'Pobreza', valor: this.formatNumber(recursosTable1.pobreza), isTotal: false },
        { variable: 'Eficiencia Fiscal', valor: this.formatNumber(recursosTable1.eficiencia_fiscal), isTotal: false },
        { variable: 'Eficiencia Administrativa', valor: this.formatNumber(recursosTable1.eficiencia_administrativa), isTotal: false },
        { variable: 'Sisben', valor: this.formatNumber(recursosTable1.sisben), isTotal: false },
        { variable: 'TOTAL', valor: this.formatCurrencyWithSymbol(totalTable1), isTotal: true }
      ];
    }

    // Tabla 2: Vigencia Seleccionada (vigencia)
    const recursosTable2 = data.recursos_proposito_general.find(r => r.anio === vigencia);

    if (recursosTable2) {
      const totalTable2 =
        (recursosTable2.poblacion || 0) +
        (recursosTable2.pobreza || 0) +
        (recursosTable2.eficiencia_fiscal || 0) +
        (recursosTable2.eficiencia_administrativa || 0) +
        (recursosTable2.sisben || 0);

      this.onceDoceavasTable2 = [
        { variable: 'Población', valor: this.formatNumber(recursosTable2.poblacion), isTotal: false },
        { variable: 'Pobreza', valor: this.formatNumber(recursosTable2.pobreza), isTotal: false },
        { variable: 'Eficiencia Fiscal', valor: this.formatNumber(recursosTable2.eficiencia_fiscal), isTotal: false },
        { variable: 'Eficiencia Administrativa', valor: this.formatNumber(recursosTable2.eficiencia_administrativa), isTotal: false },
        { variable: 'Sisben', valor: this.formatNumber(recursosTable2.sisben), isTotal: false },
        { variable: 'TOTAL', valor: this.formatCurrencyWithSymbol(totalTable2), isTotal: true }
      ];
    }

    // ============================================================================
    // RESTRICCIÓN 50%
    // ============================================================================
    if (recursosTable1) {
      const sumaPobPobreza1 = (recursosTable1.poblacion || 0) + (recursosTable1.pobreza || 0);
      const restriccion1 = sumaPobPobreza1 / 2;

      this.restriccion50Table1 = [
        { variable: 'Población + Pobreza', valor: this.formatCurrencyWithSymbol(sumaPobPobreza1) },
        { variable: 'Restricción del 50%', valor: this.formatCurrencyWithSymbol(restriccion1) }
      ];
    }

    if (recursosTable2) {
      const sumaPobPobreza2 = (recursosTable2.poblacion || 0) + (recursosTable2.pobreza || 0);
      const restriccion2 = sumaPobPobreza2 / 2;

      this.restriccion50Table2 = [
        { variable: 'Población + Pobreza', valor: this.formatCurrencyWithSymbol(sumaPobPobreza2) },
        { variable: 'Restricción del 50%', valor: this.formatCurrencyWithSymbol(restriccion2) }
      ];
    }

    // ============================================================================
    // VARIABLES CENSALES
    // ============================================================================
    const pobCensal1 = data.poblacion.find(p => p.anio === vigenciaAnterior);
    if (pobCensal1) {
      this.variablesCensalesTable1 = [
        { variable: 'Población', valor: this.formatNumber(pobCensal1.poblacion) },
        { variable: 'Pobreza - NBI (%)', valor: 'No disponible' } // No está en la BD
      ];
    }

    const pobCensal2 = data.poblacion.find(p => p.anio === vigencia);
    if (pobCensal2) {
      this.variablesCensalesTable2 = [
        { variable: 'Población', valor: this.formatNumber(pobCensal2.poblacion) },
        { variable: 'Pobreza - NBI (%)', valor: 'No disponible' } // No está en la BD
      ];
    }

    console.log('Datos procesados y tablas actualizadas para vigencia:', vigencia);
  }

  /**
   * Formatear número con separadores de miles
   */
  private formatNumber(value: number | null): string {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('es-CO').format(value);
  }

  /**
   * Formatear valor monetario con símbolo
   */
  private formatCurrencyWithSymbol(value: number | null): string {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  clearFilters(): void {
    this.selectedVigencia = null;
    this.selectedDepartamento = null;
    this.selectedMunicipio = null;
    this.municipios = [];
    console.log('Filtros limpiados');
  }

  formatCurrency(value: number | null): string {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  formatPercentage(value: number | null): string {
    if (value === null || value === undefined) return 'N/A';
    return `${value.toFixed(1)}%`;
  }

  formatDecimal(value: number | null): string {
    if (value === null || value === undefined) return 'N/A';
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