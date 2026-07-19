import { CommonModule } from '@angular/common';
import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { ConfigService, FechaActualizacion } from '../../services/config.service';

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
  private destroyRef = inject(DestroyRef);

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

  // Fechas de actualización (desde ConfigService)
  fechaActualizacion: string = 'octubre 01 de 2025'; // Valor por defecto
  fechaCorte: string = '31 de agosto de 2024'; // Valor por defecto

  // API data
  resumenMunicipio: ResumenMunicipioEficiencia | null = null;
  errorMessage: string | null = null;

  constructor(
    private eficienciasService: EficienciasService,
    private configService: ConfigService
  ) {}

  ngOnInit(): void {
    this.items = [
        { label: 'SGP', routerLink: '/sgp-inicio' },
        { label: 'Eficiencias' }
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };

    this.loadFechasActualizacion();
    this.initializeFilters();
    this.initializeData();
  }

  private loadFechasActualizacion(): void {
    const fechas = this.configService.getSgpFechasEficienciasSync();
    if (fechas) {
      if (fechas.fecha_actualizacion) {
        this.fechaActualizacion = fechas.fecha_actualizacion;
      }
      if (fechas.fecha_corte_recaudo) {
        this.fechaCorte = fechas.fecha_corte_recaudo;
      }
    }
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
    // Inicializar todas las tablas vacías
    this.eficienciaFiscalTable1 = [];
    this.eficienciaFiscalTable2 = [];
    this.eficienciaAdministrativaTable1 = [];
    this.eficienciaAdministrativaTable2 = [];
    this.onceDoceavasTable1 = [];
    this.onceDoceavasTable2 = [];
    this.restriccion50Table1 = [];
    this.restriccion50Table2 = [];
    this.variablesCensalesTable1 = [];
    this.variablesCensalesTable2 = [];
  }

  onVigenciaChange(event: SelectChangeEvent): void {
    // El valor ya está en this.selectedVigencia gracias a [(ngModel)] y optionValue
  }

  onDepartamentoChange(event: SelectChangeEvent): void {

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
    // El valor ya está en this.selectedMunicipio gracias a [(ngModel)] y optionValue
  }

  private updateMunicipios(departamentoCode: string): void {

    // Cargar todos los municipios y filtrar por departamento
    this.eficienciasService.getMunicipios().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (municipios) => {
        // Filtrar municipios por departamento (los primeros 2 dígitos del código DANE)
        this.municipios = municipios
          .filter(m => m.codigo_dane.startsWith(departamentoCode))
          .map(m => ({
            label: m.municipio,
            value: m.codigo_dane.substring(2) // Usar solo los últimos 3 dígitos
          }))
          .sort((a, b) => a.label.localeCompare(b.label));

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


    this.eficienciasService.getResumenMunicipio(codigoDane).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.resumenMunicipio = data;
        this.procesarDatosAPI(data, vigencia);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando datos de eficiencias:', err);
        this.errorMessage = 'Error al cargar los datos: ' + err.message;
        this.isLoading = false;
        // Mantener datos mock si falla la API
      }
    });
  }

  /**
   * Procesar datos de la API y actualizar las tablas
   * @param data Datos del resumen del municipio
   * @param vigencia Año de vigencia SGP seleccionado
   */
  private procesarDatosAPI(data: ResumenMunicipioEficiencia, vigencia: number): void {

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

      // Si el año actual no tiene per cápita, el crecimiento es 0
      if (perCapitaActual === 0) {
        this.eficienciaFiscalTable1[i].crecimientoPerCapita = 0;
        continue;
      }

      // Buscar hacia atrás el último año con per cápita > 0
      let perCapitaBase = 0;
      for (let j = i - 1; j >= 0; j--) {
        if (perCapitasTable1[j] > 0) {
          perCapitaBase = perCapitasTable1[j];
          break;
        }
      }

      // Si encontramos un año base, calcular crecimiento
      if (perCapitaBase > 0) {
        const crecimiento = ((perCapitaActual - perCapitaBase) / perCapitaBase) * 100;
        this.eficienciaFiscalTable1[i].crecimientoPerCapita = crecimiento;
      } else {
        // Si no hay ningún año anterior con per cápita > 0, el crecimiento es 0
        this.eficienciaFiscalTable1[i].crecimientoPerCapita = 0;
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

    // Generar 4 filas para vigencia seleccionada (vigencia-3 a vigencia)
    const perCapitasTable2: number[] = [];
    for (let v = vigencia - 3; v <= vigencia; v++) {
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

      // Si el año actual no tiene per cápita, el crecimiento es 0
      if (perCapitaActual === 0) {
        this.eficienciaFiscalTable2[i].crecimientoPerCapita = 0;
        continue;
      }

      // Buscar hacia atrás el último año con per cápita > 0
      let perCapitaBase = 0;
      for (let j = i - 1; j >= 0; j--) {
        if (perCapitasTable2[j] > 0) {
          perCapitaBase = perCapitasTable2[j];
          break;
        }
      }

      // Si encontramos un año base, calcular crecimiento
      if (perCapitaBase > 0) {
        const crecimiento = ((perCapitaActual - perCapitaBase) / perCapitaBase) * 100;
        this.eficienciaFiscalTable2[i].crecimientoPerCapita = crecimiento;
      } else {
        // Si no hay ningún año anterior con per cápita > 0, el crecimiento es 0
        this.eficienciaFiscalTable2[i].crecimientoPerCapita = 0;
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

    // Buscar datos de Ley 617 para el año certificado
    const icldTable1 = data.ley_617_icld?.find(i => i.anio === anoCertificadoTable1);
    const gfTable1 = data.ley_617_gastos_funcionamiento?.find(g => g.anio === anoCertificadoTable1);
    const razonTable1 = data.ley_617_razon?.find(r => r.anio === anoCertificadoTable1);
    const holguraTable1 = data.ley_617_holgura?.find(h => h.anio === anoCertificadoTable1);

    // Calcular LG = razón + holgura
    const razonVal1 = razonTable1?.valor ?? null;
    const holguraVal1 = holguraTable1?.valor ?? null;
    const lgTable1 = (razonVal1 !== null && holguraVal1 !== null) ? razonVal1 + holguraVal1 : null;

    this.eficienciaAdministrativaTable1 = [{
      anoCertificado: anoCertificadoTable1,
      icld: icldTable1?.valor ?? null,
      gf: gfTable1?.valor ?? null,
      lg: lgTable1,
      razon: razonVal1,
      holgura: holguraVal1
    }];

    // Tabla 2: Vigencia Seleccionada, Año Certificado = vigencia - 2
    const anoCertificadoTable2 = vigencia - 2;

    // Buscar datos de Ley 617 para el año certificado
    const icldTable2 = data.ley_617_icld?.find(i => i.anio === anoCertificadoTable2);
    const gfTable2 = data.ley_617_gastos_funcionamiento?.find(g => g.anio === anoCertificadoTable2);
    const razonTable2 = data.ley_617_razon?.find(r => r.anio === anoCertificadoTable2);
    const holguraTable2 = data.ley_617_holgura?.find(h => h.anio === anoCertificadoTable2);

    // Calcular LG = razón + holgura
    const razonVal2 = razonTable2?.valor ?? null;
    const holguraVal2 = holguraTable2?.valor ?? null;
    const lgTable2 = (razonVal2 !== null && holguraVal2 !== null) ? razonVal2 + holguraVal2 : null;

    this.eficienciaAdministrativaTable2 = [{
      anoCertificado: anoCertificadoTable2,
      icld: icldTable2?.valor ?? null,
      gf: gfTable2?.valor ?? null,
      lg: lgTable2,
      razon: razonVal2,
      holgura: holguraVal2
    }];

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
    const nbiCensal1 = data.nbi?.find(n => n.anio === vigenciaAnterior);
    if (pobCensal1) {
      this.variablesCensalesTable1 = [
        { variable: 'Población', valor: this.formatNumber(pobCensal1.poblacion) },
        { variable: 'Pobreza - NBI (%)', valor: nbiCensal1 ? `${nbiCensal1.valor?.toFixed(2)}%` : 'No disponible' }
      ];
    }

    const pobCensal2 = data.poblacion.find(p => p.anio === vigencia);
    const nbiCensal2 = data.nbi?.find(n => n.anio === vigencia);
    if (pobCensal2) {
      this.variablesCensalesTable2 = [
        { variable: 'Población', valor: this.formatNumber(pobCensal2.poblacion) },
        { variable: 'Pobreza - NBI (%)', valor: nbiCensal2 ? `${nbiCensal2.valor?.toFixed(2)}%` : 'No disponible' }
      ];
    }

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
    return `${(value * 100).toFixed(1)}%`;
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