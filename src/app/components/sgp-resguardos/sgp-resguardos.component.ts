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
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';

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

interface EnlacePopupItem {
  icon: string;
  titulo?: string;
  texto: string;
}

interface EnlacePopup {
  entidad: string;        // Título del encabezado
  subtitulo: string;      // Subtítulo bajo el título
  tema: 'azul' | 'dane';  // Tema de color del popup
  iconoEntidad: string;   // Ícono/logo de la entidad
  items: EnlacePopupItem[];
  enlaceUrl?: string;     // Enlace destacado (opcional)
  footer?: string;        // Aviso informativo al pie (opcional)
}

interface EnlaceInteres {
  titulo: string;
  url: string;
  popup: EnlacePopup;
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
    TooltipModule,
    DialogModule,
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
  observacionResguardos: string = '';

  // Datos históricos (desde resumen_general)
  datosHistoricos: ResguardoData[] = [];

  // Población total de resguardos certificados (desde resumen_general)
  poblacionTotalHistorica: number = 0;

  /**
   * Excel con el detalle de SGP Indígenas de vigencias anteriores a 2015
   * (información basada en documentos CONPES), alojado en el sitio de colaboración del DNP.
   */
  readonly urlHistoricoConpes = 'https://colaboracion.dnp.gov.co/CDT/Inversiones%20y%20finanzas%20pblicas/Documentos%20GFT/Documentos_SGP/resguardos/detalle_sgp_indigenas_conpes.xlsx';

  // Enlaces de interés (cada uno abre un popup con información ampliada)
  enlacesInteres: EnlaceInteres[] = [
    {
      titulo: 'Ministerio de Hacienda y Crédito Público',
      url: 'https://www.minhacienda.gov.co',
      popup: {
        entidad: 'Ministerio de Hacienda y Crédito Público',
        subtitulo: 'Información oficial del SGP',
        tema: 'azul',
        iconoEntidad: 'pi pi-building-columns',
        items: [
          {
            icon: 'pi pi-info-circle',
            texto: 'Una vez publicada la distribución de los recursos, el giro es responsabilidad del Ministerio de Hacienda. Para consultar o descargar el detalle completo, visite el siguiente enlace:'
          }
        ],
        enlaceUrl: 'https://sgp.minhacienda.gov.co/consultasexternas'
      }
    },
    {
      titulo: 'Departamento Nacional de Planeación',
      url: 'https://www.dnp.gov.co',
      popup: {
        entidad: 'Departamento Nacional de Planeación',
        subtitulo: 'Asistencia técnica AESGPRI',
        tema: 'azul',
        iconoEntidad: 'pi pi-comments',
        items: [
          {
            icon: 'pi pi-users',
            texto: 'La Subdirección de Descentralización ofrece un espacio virtual de asistencia técnica sobre el régimen de la AESGPRI y sus lineamientos aplicables.'
          },
          {
            icon: 'pi pi-envelope',
            texto: 'Para solicitarlo, envíe un correo a sgpresguardos@dnp.gov.co indicando su nombre y datos de contacto.'
          },
          {
            icon: 'pi pi-calendar-clock',
            texto: 'Desde allí se coordinará la fecha y hora de la sesión.'
          }
        ],
        footer: 'Este espacio está dirigido a entidades territoriales, comunidades indígenas y demás actores interesados en la AESGPRI.'
      }
    },
    {
      titulo: 'Departamento Administrativo Nacional de Estadística',
      url: 'https://www.dane.gov.co',
      popup: {
        entidad: 'Departamento Administrativo Nacional de Estadística (DANE)',
        subtitulo: 'Información oficial',
        tema: 'dane',
        iconoEntidad: 'pi pi-chart-bar',
        items: [
          {
            icon: 'pi pi-folder',
            titulo: 'Fuente de información',
            texto: 'La distribución de recursos se realiza con base en la información poblacional certificada por el DANE, única fuente válida para estos efectos.'
          },
          {
            icon: 'pi pi-file',
            titulo: 'Insumos del DNP',
            texto: 'Corresponden exclusivamente a la información suministrada por las entidades competentes, conforme al mecanismo institucional establecido en la normatividad vigente.'
          },
          {
            icon: 'pi pi-envelope',
            titulo: '¿Más preguntas?',
            texto: 'Dirección de Censos y Demografía del DANE: contacto@dane.gov.co'
          }
        ],
        footer: 'La información suministrada por el DANE es oficial, confiable y utilizada por el Estado para la toma de decisiones sobre la asignación de recursos.'
      }
    }
  ];

  // Control del popup de enlaces de interés
  popupVisible = false;
  popupSeleccionado: EnlacePopup | null = null;

  abrirPopupEnlace(enlace: EnlaceInteres): void {
    this.popupSeleccionado = enlace.popup;
    this.popupVisible = true;
  }

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
    this.observacionResguardos = resumen?.cantidadResguardos?.[0]?.Observacion ?? '';
    this.poblacionTotalHistorica = resumen?.poblacionIndigena?.[0]?.PoblacionTotalResguardosCertificados ?? 0;

    const historicoPresupuesto = resumen?.historicoPresupuesto ?? [];
    const historicoPoblacion = resumen?.historicoPoblacion ?? [];
    const cantidadResguardos = resumen?.cantidadResguardos ?? [];
    const poblacionPorVigencia = new Map(
      historicoPoblacion.map(h => [h.Vigencia, h.PoblacionCertificada])
    );
    const resguardosPorVigencia = new Map(
      cantidadResguardos.map(c => [c.Vigencia, c.CantidadResguardosCertificados])
    );

    if (historicoPresupuesto.length > 0) {
      this.datosHistoricos = historicoPresupuesto.map(h => ({
        vigencia: h.Vigencia,
        presupuesto: h.PresupuestoDistribuido,
        poblacion: poblacionPorVigencia.get(h.Vigencia) ?? 0,
        cantidadResguardos: resguardosPorVigencia.get(h.Vigencia) ?? 0
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

  /**
   * Abre/descarga el Excel de resguardos de vigencias anteriores a 2015 (CONPES).
   */
  descargarHistoricoConpes(): void {
    window.open(this.urlHistoricoConpes, '_blank');
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

  // Máximos para escalar las barras de "últimas tres vigencias"
  get maxPresupuesto(): number {
    return this.datosHistoricos.reduce((max, d) => Math.max(max, d.presupuesto), 0) || 1;
  }

  get maxPoblacion(): number {
    return this.datosHistoricos.reduce((max, d) => Math.max(max, d.poblacion), 0) || 1;
  }

  // Signo de la variación (para colorear verde/rojo y elegir el ícono ▲/▼)
  get variacionPresupuestoPositiva(): boolean {
    return this.diferenciaPresupuesto >= 0;
  }

  get variacionPoblacionPositiva(): boolean {
    return this.diferenciaPoblacion >= 0;
  }
}
