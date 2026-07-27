import { Component, OnInit, signal, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { AccordionModule } from 'primeng/accordion';

// Services & Pipes
import {
  SicodisApiService,
  EntidadSgpIndigena,
  ResumenGeneralSgpIndigenas
} from '../../services/sicodis-api.service';
import { ConfigService } from '../../services/config.service';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';

interface ResguardoData {
  vigencia: number;
  presupuesto: number;
  poblacion: number;
  cantidadResguardos: number;
}

interface OpcionFiltro {
  id: string;
  label: string;
}

@Component({
  selector: 'app-sgp-resguardos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    SelectModule,
    FloatLabel,
    InputTextModule,
    AccordionModule,
    NumberFormatPipe
  ],
  templateUrl: './sgp-resguardos.component.html',
  styleUrl: './sgp-resguardos.component.scss'
})
export class SgpResguardosComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  // Filtros seleccionados
  selectedVigencia: number = 2026;
  selectedDepartamento: string = '0';
  selectedMunicipio: string = '0';
  selectedResguardo: string = '0';

  // Opciones para los filtros (cargadas desde el API)
  vigencias: { id: number; label: string }[] = [];
  departamentos: OpcionFiltro[] = [{ id: '0', label: 'Todos' }];
  municipios: OpcionFiltro[] = [{ id: '0', label: 'Todos' }];
  resguardos: OpcionFiltro[] = [{ id: '0', label: 'Todos' }];

  // Estados de carga
  isLoading = signal(false);

  // Fecha de actualización (desde ConfigService)
  fechaActualizacion: string = 'mayo 28 de 2026'; // Valor por defecto

  // Datos actuales (desde resumen_general)
  presupuestoActual: number = 0;
  poblacionActual: number = 0;
  observacionPresupuesto: string = '';
  observacionPoblacion: string = '';

  // Datos históricos (desde resumen_general; cantidadResguardos permanece mock)
  datosHistoricos: ResguardoData[] = [
    { vigencia: 2026, presupuesto: 0, poblacion: 0, cantidadResguardos: 913 },
    { vigencia: 2025, presupuesto: 0, poblacion: 0, cantidadResguardos: 900 },
    { vigencia: 2024, presupuesto: 0, poblacion: 0, cantidadResguardos: 885 }
  ];

  /**
   * Cantidad de resguardos certificados por vigencia.
   * MOCK: el API de SGP Indígenas no expone este conteo (ver /resumen_general).
   */
  private readonly mockCantidadResguardos: { [vigencia: number]: number } = {
    2026: 913,
    2025: 900,
    2024: 885
  };

  /**
   * Población indígena total en Colombia (censo).
   * MOCK: el API solo expone población certificada, no la cifra censal.
   */
  poblacionTotalHistorica: number = 1905617;

  // Enlaces de interés
  enlacesInteres = [
    {
      titulo: 'Ministerio de Hacienda y Crédito Público',
      url: 'https://www.minhacienda.gov.co'
    },
    {
      titulo: 'Departamento Nacional de Planeación',
      url: 'https://www.dnp.gov.co'
    },
    {
      titulo: 'Departamento Administrativo Nacional de Estadística',
      url: 'https://www.dane.gov.co'
    }
  ];

  constructor(
    private sicodisApiService: SicodisApiService,
    private configService: ConfigService
  ) { }

  ngOnInit(): void {
    this.loadFechaActualizacion();
    this.loadVigencias();
  }

  private loadFechaActualizacion(): void {
    const fechas = this.configService.getSgpFechaResguardosSync();
    if (fechas && fechas.fecha_actualizacion) {
      this.fechaActualizacion = fechas.fecha_actualizacion;
    }
  }

  // ========== Carga de filtros en cascada ==========

  private loadVigencias(): void {
    this.sicodisApiService.getSgpIndigenasVigencias()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.vigencias = (data || []).map(v => ({ id: v.id_vigencia, label: v.vigencia }));
          if (this.vigencias.length > 0) {
            this.selectedVigencia = this.vigencias[0].id; // vigencia más reciente
          }
          this.loadDepartamentos();
          this.loadData();
        },
        error: (error) => {
          console.error('Error cargando vigencias de SGP Indígenas:', error);
          this.loadData();
        }
      });
  }

  private loadDepartamentos(): void {
    this.sicodisApiService.getSgpIndigenasDepartamentos(String(this.selectedVigencia))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.departamentos = this.mapOpciones(data),
        error: (error) => {
          console.error('Error cargando departamentos de SGP Indígenas:', error);
          this.departamentos = [{ id: '0', label: 'Todos' }];
        }
      });
  }

  private loadMunicipios(): void {
    if (this.selectedDepartamento === '0') {
      this.municipios = [{ id: '0', label: 'Todos' }];
      return;
    }
    this.sicodisApiService.getSgpIndigenasMunicipios(String(this.selectedVigencia), this.selectedDepartamento)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.municipios = this.mapOpciones(data),
        error: (error) => {
          console.error('Error cargando municipios de SGP Indígenas:', error);
          this.municipios = [{ id: '0', label: 'Todos' }];
        }
      });
  }

  private loadResguardos(): void {
    if (this.selectedMunicipio === '0') {
      this.resguardos = [{ id: '0', label: 'Todos' }];
      return;
    }
    this.sicodisApiService.getSgpIndigenasResguardos(
      String(this.selectedVigencia),
      this.selectedDepartamento,
      this.selectedMunicipio
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.resguardos = this.mapOpciones(data),
        error: (error) => {
          console.error('Error cargando resguardos de SGP Indígenas:', error);
          this.resguardos = [{ id: '0', label: 'Todos' }];
        }
      });
  }

  private mapOpciones(data: EntidadSgpIndigena[]): OpcionFiltro[] {
    return (data || []).map(d => ({ id: d.codigo, label: d.nombre }));
  }

  // ========== Handlers de cambio de filtros ==========

  onVigenciaChange(): void {
    this.selectedDepartamento = '0';
    this.selectedMunicipio = '0';
    this.selectedResguardo = '0';
    this.municipios = [{ id: '0', label: 'Todos' }];
    this.resguardos = [{ id: '0', label: 'Todos' }];
    this.loadDepartamentos();
    this.loadData();
  }

  onDepartamentoChange(): void {
    this.selectedMunicipio = '0';
    this.selectedResguardo = '0';
    this.resguardos = [{ id: '0', label: 'Todos' }];
    this.loadMunicipios();
    this.loadData();
  }

  onMunicipioChange(): void {
    this.selectedResguardo = '0';
    this.loadResguardos();
    this.loadData();
  }

  onResguardoChange(): void {
    this.loadData();
  }

  // ========== Carga del resumen general ==========

  loadData(): void {
    this.isLoading.set(true);

    this.sicodisApiService.getSgpIndigenasResumenGeneral(
      String(this.selectedVigencia),
      this.selectedDepartamento,
      this.selectedMunicipio,
      this.selectedResguardo
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resumen) => {
          this.procesarResumen(resumen);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error cargando resumen general de SGP Indígenas:', error);
          this.isLoading.set(false);
        }
      });
  }

  private procesarResumen(resumen: ResumenGeneralSgpIndigenas): void {
    this.presupuestoActual = resumen?.presupuesto?.[0]?.PresupuestoDistribuido ?? 0;
    this.poblacionActual = resumen?.poblacion?.[0]?.PoblacionCertificada ?? 0;
    this.observacionPresupuesto = resumen?.presupuesto?.[0]?.Observacion ?? '';
    this.observacionPoblacion = resumen?.poblacion?.[0]?.Observacion ?? '';

    const historicoPresupuesto = resumen?.historicoPresupuesto ?? [];
    const historicoPoblacion = resumen?.historicoPoblacion ?? [];
    const poblacionPorVigencia = new Map(
      historicoPoblacion.map(h => [h.Vigencia, h.PoblacionCertificada])
    );

    if (historicoPresupuesto.length > 0) {
      this.datosHistoricos = historicoPresupuesto.map(h => ({
        vigencia: h.Vigencia,
        presupuesto: h.PresupuestoDistribuido,
        poblacion: poblacionPorVigencia.get(h.Vigencia) ?? 0,
        cantidadResguardos: this.mockCantidadResguardos[h.Vigencia] ?? 0
      }));
    }
  }

  aplicarFiltros(): void {
    this.loadData();
  }

  limpiarFiltros(): void {
    if (this.vigencias.length > 0) {
      this.selectedVigencia = this.vigencias[0].id;
    }
    this.selectedDepartamento = '0';
    this.selectedMunicipio = '0';
    this.selectedResguardo = '0';
    this.municipios = [{ id: '0', label: 'Todos' }];
    this.resguardos = [{ id: '0', label: 'Todos' }];
    this.loadDepartamentos();
    this.loadData();
  }

  // ========== Descarga de Excel ==========

  exportarExcel(): void {
    if (this.selectedDepartamento === '0') {
      alert('Seleccione un departamento para descargar el detalle en Excel.');
      return;
    }

    this.isLoading.set(true);
    this.sicodisApiService.getSgpIndigenasDescargarDetalle({
      vigencias: String(this.selectedVigencia),
      codigoDepto: this.selectedDepartamento,
      departamento: this.getNombreOpcion(this.departamentos, this.selectedDepartamento),
      codigoMunicipio: this.selectedMunicipio,
      municipio: this.getNombreOpcion(this.municipios, this.selectedMunicipio),
      codigoResguardo: this.selectedResguardo,
      resguardo: this.getNombreOpcion(this.resguardos, this.selectedResguardo)
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const blob = response.body;
          if (blob) {
            const filename = this.extraerNombreArchivo(response.headers.get('content-disposition'));
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            link.click();
            window.URL.revokeObjectURL(link.href);
          }
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error descargando detalle de SGP Indígenas:', error);
          alert('No fue posible generar el archivo de Excel.');
          this.isLoading.set(false);
        }
      });
  }

  private getNombreOpcion(opciones: OpcionFiltro[], id: string): string {
    return opciones.find(o => o.id === id)?.label ?? '';
  }

  private extraerNombreArchivo(contentDisposition: string | null): string {
    if (contentDisposition) {
      const match = /filename[^;=\n]*=(?:UTF-8'')?["']?([^;"'\n]+)/i.exec(contentDisposition);
      if (match && match[1]) {
        return decodeURIComponent(match[1].trim());
      }
    }
    return 'DetalleSgpIndigenas.xlsx';
  }

  // ========== Métodos auxiliares para cálculos ==========

  get diferenciaPresupuesto(): number {
    if (this.datosHistoricos.length < 2) return 0;
    return this.datosHistoricos[0].presupuesto - this.datosHistoricos[1].presupuesto;
  }

  get porcentajeVariacionPresupuesto(): number {
    if (this.datosHistoricos.length < 2 || this.datosHistoricos[1].presupuesto === 0) return 0;
    return ((this.datosHistoricos[0].presupuesto - this.datosHistoricos[1].presupuesto) / this.datosHistoricos[1].presupuesto) * 100;
  }

  get diferenciaPoblacion(): number {
    if (this.datosHistoricos.length < 2) return 0;
    return this.datosHistoricos[0].poblacion - this.datosHistoricos[1].poblacion;
  }

  get porcentajeVariacionPoblacion(): number {
    if (this.datosHistoricos.length < 2 || this.datosHistoricos[1].poblacion === 0) return 0;
    return ((this.datosHistoricos[0].poblacion - this.datosHistoricos[1].poblacion) / this.datosHistoricos[1].poblacion) * 100;
  }

  get diferenciaResguardos(): number {
    if (this.datosHistoricos.length < 2) return 0;
    return this.datosHistoricos[0].cantidadResguardos - this.datosHistoricos[1].cantidadResguardos;
  }
}
