import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Select } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { InfoPopupComponent } from '../info-popup/info-popup.component';
import {
  SicodisApiService,
  CargarInsumoDistribucionParams,
  InsumoCargaResultado
} from '../../services/sicodis-api.service';

/**
 * Estado posible del cargue de un insumo.
 */
type EstadoCarga = 'pendiente' | 'cargando' | 'cargado' | 'error';

/**
 * Definición de un insumo requerido para el cálculo de la distribución del SGR.
 * Los insumos se derivan del Manual M-CA-04 (v12) — sección "Ingesta y validación
 * de insumos" y del diagrama de insumos externos del plan de implementación.
 */
interface InsumoDefinicion {
  id: string;
  nombre: string;
  descripcion: string;
  fase: 'I' | 'III';
  formatos: string;
  // Estado en tiempo de ejecución
  estado: EstadoCarga;
  nombreArchivo?: string;
  fechaCarga?: Date;
  version?: number;
  mensaje?: string;
}

/**
 * Agrupación de insumos por entidad fuente (MME, DANE, MHCP, ANH/ANM, SGP, Min. Interior).
 */
interface FuenteInsumos {
  id: string;
  sigla: string;
  nombre: string;
  icono: string;
  insumos: InsumoDefinicion[];
}

@Component({
  selector: 'app-sgr-carga-insumos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    TableModule,
    TagModule,
    TooltipModule,
    Select,
    FloatLabel,
    Breadcrumb,
    InfoPopupComponent
  ],
  templateUrl: './sgr-carga-insumos.component.html',
  styleUrl: './sgr-carga-insumos.component.scss'
})
export class SgrCargaInsumosComponent implements OnInit {

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  // Popups (Diccionario / Siglas)
  showDiccionarioPopup = false;
  showSiglasPopup = false;
  diccionarioContent = '';
  siglasContent = '';

  // Filtros
  selectedBienio: any = { id: 1, label: '2027 - 2028' };
  bienios: any[] = [
    { id: 1, label: '2027 - 2028' },
    { id: 2, label: '2025 - 2026' },
    { id: 3, label: '2023 - 2024' }
  ];

  /**
   * Mientras no exista el backend de cargue (endpoint `sgrdistribucion/insumos/*`),
   * la carga se simula en el navegador para poder demostrar el flujo. Al poner esto
   * en `false` el componente usa el servicio API real.
   */
  private readonly simularCarga = true;

  // Insumos agrupados por entidad fuente
  fuentes: FuenteInsumos[] = [];

  // Formatos aceptados por defecto
  private readonly formatoExcel = '.xlsx, .xls';
  private readonly acceptExcel = '.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel';
  get accept(): string { return this.acceptExcel; }

  constructor(private sicodisApiService: SicodisApiService) { }

  ngOnInit(): void {
    this.items = [
      { label: 'SGR', routerLink: '/sgr-inicio' },
      { label: 'Distribución' },
      { label: 'Carga de insumos' }
    ];
    this.home = { icon: 'pi pi-home', routerLink: '/' };

    this.fuentes = this.construirCatalogoInsumos();
  }

  /**
   * Catálogo de insumos por fuente según el Manual M-CA-04 (v12).
   */
  private construirCatalogoInsumos(): FuenteInsumos[] {
    const f = this.formatoExcel;
    const nuevo = (id: string, nombre: string, descripcion: string, fase: 'I' | 'III'): InsumoDefinicion =>
      ({ id, nombre, descripcion, fase, formatos: f, estado: 'pendiente' });

    return [
      {
        id: 'mme',
        sigla: 'MME',
        nombre: 'Ministerio de Minas y Energía',
        icono: 'pi pi-bolt',
        insumos: [
          nuevo('proyecciones', 'Proyecciones de ingresos', 'Proyección de ingresos corrientes del SGR a 10 años. Insumo principal del cálculo.', 'I'),
          nuevo('recaudo', 'Recaudo', 'Recaudo efectivo reportado para el seguimiento y la ejecución.', 'I')
        ]
      },
      {
        id: 'dane',
        sigla: 'DANE',
        nombre: 'Departamento Administrativo Nacional de Estadística',
        icono: 'pi pi-chart-bar',
        insumos: [
          nuevo('poblacion', 'Población', 'Población por entidad territorial (código DANE a 5 dígitos). Variable de AIL, AIR y FONPET.', 'I'),
          nuevo('nbi', 'NBI', 'Índice de Necesidades Básicas Insatisfechas por entidad territorial.', 'I'),
          nuevo('desempleo', 'Tasa de desempleo', 'Tasa de desempleo departamental. Factor de la AIR (0,1).', 'I'),
          nuevo('factor-k', 'Factor K', 'Factor K para el cálculo indicativo de destinaciones étnicas.', 'III'),
          nuevo('poblacion-etnica', 'Población étnica', 'Población de grupos étnicos por entidad territorial.', 'III')
        ]
      },
      {
        id: 'mhcp',
        sigla: 'MHCP',
        nombre: 'Ministerio de Hacienda y Crédito Público',
        icono: 'pi pi-wallet',
        insumos: [
          nuevo('ppnc', 'PPNC', 'Pasivo Pensional No Cubierto por entidad territorial. Insumo del FONPET.', 'I'),
          nuevo('porcentaje-fae-fonpet', '% FAE / FONPET', 'Porcentaje de reparto del ahorro entre FAE y FONPET (comunicado a más tardar el 8 de agosto).', 'I'),
          nuevo('recaudo-cuenta-unica', 'Recaudo en cuenta única', 'Recaudo en la cuenta única del SGR para el seguimiento de caja.', 'I')
        ]
      },
      {
        id: 'agencias',
        sigla: 'ANH / ANM',
        nombre: 'Agencia Nacional de Hidrocarburos · Agencia Nacional de Minería',
        icono: 'pi pi-cog',
        insumos: [
          nuevo('ad-beneficiario', 'AD por beneficiario', 'Asignaciones Directas (20% + 5%) por beneficiario, determinadas por las agencias.', 'I')
        ]
      },
      {
        id: 'sgp',
        sigla: 'SGP',
        nombre: 'Sistema General de Participaciones',
        icono: 'pi pi-sitemap',
        insumos: [
          nuevo('categorias-municipales', 'Categorías municipales', 'Categorización de municipios (4, 5 y 6) para la elegibilidad de la AIL.', 'I')
        ]
      },
      {
        id: 'mininterior',
        sigla: 'Min. Interior',
        nombre: 'Ministerio del Interior',
        icono: 'pi pi-users',
        insumos: [
          nuevo('acreditacion-etnica', 'Acreditación étnica', 'Matriz binaria de acreditación de grupos étnicos para el cálculo indicativo.', 'III')
        ]
      }
    ];
  }

  // ===================== Resumen de avance =====================

  get totalInsumos(): number {
    return this.fuentes.reduce((acc, fte) => acc + fte.insumos.length, 0);
  }

  get insumosCargados(): number {
    return this.fuentes.reduce(
      (acc, fte) => acc + fte.insumos.filter(i => i.estado === 'cargado').length, 0
    );
  }

  get porcentajeAvance(): number {
    return this.totalInsumos === 0 ? 0 : Math.round((this.insumosCargados / this.totalInsumos) * 100);
  }

  cargadosPorFuente(fuente: FuenteInsumos): number {
    return fuente.insumos.filter(i => i.estado === 'cargado').length;
  }

  // ===================== Etiquetas de estado =====================

  estadoLabel(estado: EstadoCarga): string {
    switch (estado) {
      case 'cargado': return 'Cargado';
      case 'cargando': return 'Cargando…';
      case 'error': return 'Error';
      default: return 'Pendiente';
    }
  }

  estadoSeverity(estado: EstadoCarga): 'success' | 'info' | 'danger' | 'warn' {
    switch (estado) {
      case 'cargado': return 'success';
      case 'cargando': return 'info';
      case 'error': return 'danger';
      default: return 'warn';
    }
  }

  // ===================== Carga de archivos =====================

  /**
   * Dispara el diálogo nativo de selección de archivo asociado a un insumo.
   */
  triggerFileInput(inputId: string): void {
    const el = document.getElementById(inputId) as HTMLInputElement | null;
    el?.click();
  }

  /**
   * Maneja la selección de archivo para un insumo concreto de una fuente.
   */
  onFileSelected(event: Event, fuente: FuenteInsumos, insumo: InsumoDefinicion): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files && input.files.length ? input.files[0] : null;
    if (!archivo) {
      return;
    }

    // Validación mínima de extensión
    const nombre = archivo.name.toLowerCase();
    if (!nombre.endsWith('.xlsx') && !nombre.endsWith('.xls')) {
      insumo.estado = 'error';
      insumo.nombreArchivo = archivo.name;
      insumo.mensaje = 'Formato no válido. Use un archivo de Excel (.xlsx o .xls).';
      input.value = '';
      return;
    }

    insumo.estado = 'cargando';
    insumo.nombreArchivo = archivo.name;
    insumo.mensaje = undefined;

    if (this.simularCarga) {
      this.simularCargue(insumo);
    } else {
      this.cargarEnServidor(fuente, insumo, archivo);
    }

    // Permite volver a seleccionar el mismo archivo
    input.value = '';
  }

  /**
   * Simulación local del cargue (mientras no exista el backend).
   */
  private simularCargue(insumo: InsumoDefinicion): void {
    setTimeout(() => {
      insumo.estado = 'cargado';
      insumo.fechaCarga = new Date();
      insumo.version = (insumo.version ?? 0) + 1;
      insumo.mensaje = 'Cargue simulado (pendiente de backend).';
    }, 700);
  }

  /**
   * Cargue real contra el servicio API.
   */
  private cargarEnServidor(fuente: FuenteInsumos, insumo: InsumoDefinicion, archivo: File): void {
    const params: CargarInsumoDistribucionParams = {
      idBienio: this.selectedBienio?.id,
      bienio: this.selectedBienio?.label,
      fuente: fuente.sigla,
      insumo: insumo.id,
      archivo
    };

    this.sicodisApiService.cargarInsumoDistribucionSgr(params).subscribe({
      next: (response) => {
        const body: InsumoCargaResultado | null = response.body;
        insumo.estado = 'cargado';
        insumo.fechaCarga = body?.fechaCarga ? new Date(body.fechaCarga) : new Date();
        insumo.version = body?.version ?? (insumo.version ?? 0) + 1;
        insumo.mensaje = body?.mensaje;
      },
      error: (error) => {
        console.error('Error al cargar insumo:', error);
        insumo.estado = 'error';
        insumo.mensaje = 'No fue posible cargar el archivo. Intente nuevamente.';
      }
    });
  }

  /**
   * Quita el archivo cargado de un insumo y lo regresa a pendiente.
   */
  quitarArchivo(insumo: InsumoDefinicion): void {
    insumo.estado = 'pendiente';
    insumo.nombreArchivo = undefined;
    insumo.fechaCarga = undefined;
    insumo.version = undefined;
    insumo.mensaje = undefined;
  }

  /**
   * Descarga la plantilla oficial del insumo.
   */
  descargarPlantilla(fuente: FuenteInsumos, insumo: InsumoDefinicion): void {
    if (this.simularCarga) {
      console.log(`Descarga de plantilla (simulada): ${fuente.sigla} · ${insumo.nombre}`);
      return;
    }
    this.sicodisApiService.descargarPlantillaInsumoDistribucionSgr(fuente.sigla, insumo.id).subscribe({
      next: (response) => {
        const blob = response.body;
        if (!blob) { return; }
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `plantilla_${fuente.id}_${insumo.id}.xlsx`;
        link.click();
        window.URL.revokeObjectURL(link.href);
      },
      error: (error) => console.error('Error al descargar plantilla:', error)
    });
  }

  // ===================== Popups =====================

  showPopupDiccionario(): void {
    this.diccionarioContent = this.generarContenidoDiccionario();
    this.showDiccionarioPopup = true;
  }

  showPopupSiglas(): void {
    this.siglasContent = this.generarContenidoSiglas();
    this.showSiglasPopup = true;
  }

  closeDiccionarioPopup(): void { this.showDiccionarioPopup = false; }
  closeSiglasPopup(): void { this.showSiglasPopup = false; }

  private generarContenidoDiccionario(): string {
    return `
      <div style="font-size: 11px; line-height: 1.6;">
        <h4 style="margin-bottom: 1rem; color: #333;">Insumos para la distribución del SGR</h4>
        <ul style="list-style-type: none; padding: 0;">
          <li style="margin-bottom: 0.5rem;"><strong>Proyecciones de ingresos:</strong> proyección del MME de los ingresos corrientes del SGR a 10 años; insumo principal del cálculo.</li>
          <li style="margin-bottom: 0.5rem;"><strong>NBI:</strong> Necesidades Básicas Insatisfechas; variable de las asignaciones AIL y AIR.</li>
          <li style="margin-bottom: 0.5rem;"><strong>PPNC:</strong> Pasivo Pensional No Cubierto; insumo del componente FONPET.</li>
          <li style="margin-bottom: 0.5rem;"><strong>AD por beneficiario:</strong> Asignaciones Directas determinadas por la ANH y la ANM.</li>
          <li style="margin-bottom: 0.5rem;"><strong>Factor K:</strong> factor del cálculo indicativo de destinaciones étnicas.</li>
          <li style="margin-bottom: 0.5rem;"><strong>Acreditación étnica:</strong> matriz binaria de acreditación de grupos étnicos (Min. Interior).</li>
        </ul>
      </div>
    `;
  }

  private generarContenidoSiglas(): string {
    return `
      <div style="font-size: 11px; line-height: 1.6;">
        <h4 style="margin-bottom: 1rem; color: #333;">Siglas y Abreviaciones</h4>
        <ul style="list-style-type: none; padding: 0;">
          <li style="margin-bottom: 0.5rem;"><strong>SGR:</strong> Sistema General de Regalías</li>
          <li style="margin-bottom: 0.5rem;"><strong>MME:</strong> Ministerio de Minas y Energía</li>
          <li style="margin-bottom: 0.5rem;"><strong>DANE:</strong> Departamento Administrativo Nacional de Estadística</li>
          <li style="margin-bottom: 0.5rem;"><strong>MHCP:</strong> Ministerio de Hacienda y Crédito Público</li>
          <li style="margin-bottom: 0.5rem;"><strong>ANH:</strong> Agencia Nacional de Hidrocarburos</li>
          <li style="margin-bottom: 0.5rem;"><strong>ANM:</strong> Agencia Nacional de Minería</li>
          <li style="margin-bottom: 0.5rem;"><strong>SGP:</strong> Sistema General de Participaciones</li>
          <li style="margin-bottom: 0.5rem;"><strong>AIL:</strong> Asignación para Inversión Local</li>
          <li style="margin-bottom: 0.5rem;"><strong>AIR:</strong> Asignación para Inversión Regional</li>
          <li style="margin-bottom: 0.5rem;"><strong>AD:</strong> Asignaciones Directas</li>
          <li style="margin-bottom: 0.5rem;"><strong>FAE:</strong> Fondo de Ahorro y Estabilización</li>
          <li style="margin-bottom: 0.5rem;"><strong>FONPET:</strong> Fondo Nacional de Pensiones de las Entidades Territoriales</li>
          <li style="margin-bottom: 0.5rem;"><strong>PPNC:</strong> Pasivo Pensional No Cubierto</li>
        </ul>
      </div>
    `;
  }
}
