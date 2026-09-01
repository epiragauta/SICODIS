import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Select } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem, ConfirmationService } from 'primeng/api';
import { InfoPopupComponent } from '../info-popup/info-popup.component';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';
import {
  SicodisApiService,
  CorridaDistribucion,
  ResumenVerificacion,
  ChequeoItem,
  ConjuntoParametros,
  ParametroValor,
  TotalAsignacion,
  TipoSalidaCorrida
} from '../../services/sicodis-api.service';

type EstadoCorrida = CorridaDistribucion['estado'];

/**
 * Resumen de precondiciones: estado de carga de los insumos requeridos para un bienio.
 */
interface PrecondicionInsumos {
  seccionICargados: number;
  seccionITotal: number;
  seccionIIICargados: number;
  seccionIIITotal: number;
}

@Component({
  selector: 'app-sgr-ejecucion-distribucion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    CardModule,
    TableModule,
    TagModule,
    TooltipModule,
    DialogModule,
    ConfirmDialogModule,
    Select,
    FloatLabel,
    Breadcrumb,
    InfoPopupComponent,
    NumberFormatPipe
  ],
  providers: [ConfirmationService],
  templateUrl: './sgr-ejecucion-distribucion.component.html',
  styleUrl: './sgr-ejecucion-distribucion.component.scss'
})
export class SgrEjecucionDistribucionComponent implements OnInit, OnDestroy {

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  // Popups (Diccionario / Siglas)
  showDiccionarioPopup = false;
  showSiglasPopup = false;
  diccionarioContent = '';
  siglasContent = '';

  // Pestañas
  activeTab: 'ejecucion' | 'parametros' = 'ejecucion';

  // Filtros
  selectedBienio: any = { id: 1, label: '2027 - 2028' };
  bienios: any[] = [
    { id: 1, label: '2027 - 2028' },
    { id: 2, label: '2025 - 2026' },
    { id: 3, label: '2023 - 2024' }
  ];

  // Parámetros de cálculo vigentes (solo lectura)
  parametros: ConjuntoParametros | null = null;

  // Detalle de corrida (Incremento 2)
  showDetalleDialog = false;
  corridaDetalle: CorridaDistribucion | null = null;
  detalleChequeos: ChequeoItem[] = [];
  detalleTotales: TotalAsignacion[] = [];
  descargando: TipoSalidaCorrida | null = null;

  /** Base de ingresos corrientes proyectados por bienio (mock, en pesos). */
  private readonly baseIngresosPorBienio: { [id: number]: number } = {
    1: 25_000_000_000_000,
    2: 22_000_000_000_000,
    3: 19_000_000_000_000
  };

  /**
   * Mientras el backend (motor Python) no exponga los endpoints `sgrdistribucion/*`,
   * la ejecución y las precondiciones se simulan en el navegador. Al poner esto en
   * `false` el componente usa el servicio API real.
   */
  private readonly simularEjecucion = true;

  /** Igual que `simularEjecucion`, para los parámetros mientras no exista el backend. */
  private readonly simularParametros = true;

  // Precondiciones
  precondicion: PrecondicionInsumos = {
    seccionICargados: 0, seccionITotal: 10,
    seccionIIICargados: 0, seccionIIITotal: 3
  };

  // Ejecución en curso
  ejecucionEnCurso = false;
  progreso = 0;
  faseActual = '';
  private readonly fases = ['Tabla 2', 'AIL', 'AIR', 'FAE', 'FONPET', 'SSEC', 'Bolsas'];
  private ejecucionTimer: any = null;

  // Historial de corridas (versionado por fecha de ejecución)
  corridas: CorridaDistribucion[] = [];

  private readonly usuarioActual = 'jperez';

  constructor(
    private sicodisApiService: SicodisApiService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.items = [
      { label: 'SGR', routerLink: '/sgr-inicio' },
      { label: 'Distribución' },
      { label: 'Ejecución' }
    ];
    this.home = { icon: 'pi pi-home', routerLink: '/' };

    this.cargarPrecondiciones();
    this.cargarCorridas();
    this.cargarParametros();
  }

  ngOnDestroy(): void {
    if (this.ejecucionTimer) {
      clearInterval(this.ejecucionTimer);
    }
  }

  // ===================== Cambio de bienio =====================

  onBienioChange(): void {
    if (this.ejecucionEnCurso) { return; }
    this.cargarPrecondiciones();
    this.cargarCorridas();
    this.cargarParametros();
  }

  setTab(tab: 'ejecucion' | 'parametros'): void {
    this.activeTab = tab;
  }

  // ===================== Precondiciones =====================

  private cargarPrecondiciones(): void {
    if (this.simularEjecucion) {
      // Mock: insumos de Sección I completos; Sección III completa para el bienio vigente.
      this.precondicion = {
        seccionICargados: 10, seccionITotal: 10,
        seccionIIICargados: 3, seccionIIITotal: 3
      };
      return;
    }
    this.sicodisApiService.getEstadoInsumosDistribucionSgr(this.selectedBienio?.id).subscribe({
      next: (estados) => {
        const seccionIII = new Set(['factor-k', 'poblacion-etnica', 'acreditacion-etnica']);
        const cargadosIII = estados.filter(e => e.cargado && seccionIII.has(e.insumo)).length;
        const cargadosI = estados.filter(e => e.cargado && !seccionIII.has(e.insumo)).length;
        this.precondicion = {
          seccionICargados: cargadosI, seccionITotal: 10,
          seccionIIICargados: cargadosIII, seccionIIITotal: 3
        };
      },
      error: (error) => {
        console.error('Error al consultar estado de insumos:', error);
        this.precondicion = {
          seccionICargados: 0, seccionITotal: 10,
          seccionIIICargados: 0, seccionIIITotal: 3
        };
      }
    });
  }

  get seccionICompleta(): boolean {
    return this.precondicion.seccionICargados >= this.precondicion.seccionITotal;
  }

  get seccionIIICompleta(): boolean {
    return this.precondicion.seccionIIICargados >= this.precondicion.seccionIIITotal;
  }

  get puedeEjecutar(): boolean {
    return this.seccionICompleta && !this.ejecucionEnCurso;
  }

  // ===================== Historial =====================

  private cargarCorridas(): void {
    if (this.simularEjecucion) {
      this.corridas = this.corridasMock(this.selectedBienio);
      return;
    }
    this.sicodisApiService.getCorridasDistribucionSgr(this.selectedBienio?.id).subscribe({
      next: (corridas) => this.corridas = corridas ?? [],
      error: (error) => {
        console.error('Error al cargar corridas:', error);
        this.corridas = [];
      }
    });
  }

  private corridasMock(bienio: any): CorridaDistribucion[] {
    if (bienio?.id !== 1) {
      return [];
    }
    return [
      {
        idCorrida: 3, version: 3, idBienio: 1, bienio: bienio.label,
        fechaEjecucion: '2026-08-30T09:12:00', usuario: 'mruiz',
        versionInsumos: 'INS-2027-08', versionParametros: 'P-v2',
        hashResultados: 'a1f9c3', estado: 'con_diferencias', esOficial: false,
        resumenVerificacion: this.verificacionMock('advertencia')
      },
      {
        idCorrida: 2, version: 2, idBienio: 1, bienio: bienio.label,
        fechaEjecucion: '2026-08-28T15:03:00', usuario: 'jperez',
        versionInsumos: 'INS-2027-07', versionParametros: 'P-v2',
        hashResultados: 'd7b204', estado: 'exitosa', esOficial: true,
        resumenVerificacion: this.verificacionMock('ok')
      },
      {
        idCorrida: 1, version: 1, idBienio: 1, bienio: bienio.label,
        fechaEjecucion: '2026-08-26T11:20:00', usuario: 'jperez',
        versionInsumos: 'INS-2027-06', versionParametros: 'P-v1',
        hashResultados: '3c0e51', estado: 'fallida', esOficial: false,
        mensaje: 'Error de cuadratura en AIR (regiones).',
        resumenVerificacion: this.verificacionMock('error')
      }
    ];
  }

  private verificacionMock(tipo: 'ok' | 'advertencia' | 'error'): ResumenVerificacion {
    const r = (codigo: string, descripcion: string, resultado: ChequeoItem['resultado'], detalle?: string): ChequeoItem =>
      ({ codigo, descripcion, resultado, detalle });

    const chequeos: ChequeoItem[] = [
      r('3.3.a', 'Cuadratura del 100% de los recursos proyectados por año',
        tipo === 'error' ? 'error' : 'ok',
        tipo === 'error' ? 'Diferencia detectada en la partición de la AIR (regiones).' : undefined),
      r('3.3.b', 'Revisión por beneficiario y asignación (no solo por totales)', 'ok'),
      r('3.3.c', 'Consistencia con las AD remitidas por las agencias',
        tipo === 'advertencia' ? 'advertencia' : 'ok',
        tipo === 'advertencia' ? 'Descuentos de AD pendientes de conciliar en 2 entidades.' : undefined),
      r('4.2.a', 'Régimen de redondeo correcto según el destino de la cifra', 'ok'),
      r('3.3.d', 'Marcaciones ambientales presentes donde la norma las exige', 'ok'),
      r('III.a', 'Marcaciones y destinaciones étnicas presentes',
        tipo === 'advertencia' ? 'advertencia' : (tipo === 'error' ? 'ok' : 'ok'),
        tipo === 'advertencia' ? 'Ejecutada sin insumos de Sección III.' : undefined)
    ];
    const ok = chequeos.filter(c => c.resultado === 'ok').length;

    return {
      cuadraturaOk: tipo === 'ok',
      chequeosTotales: chequeos.length,
      chequeosOk: ok,
      chequeos
    };
  }

  // ===================== Ejecución =====================

  ejecutarCalculo(): void {
    if (!this.puedeEjecutar) { return; }

    if (this.simularEjecucion) {
      this.simularCorrida();
    } else {
      this.sicodisApiService.ejecutarDistribucionSgr(this.selectedBienio?.id).subscribe({
        next: (corrida) => this.iniciarSeguimiento(corrida),
        error: (error) => {
          console.error('Error al iniciar la ejecución:', error);
          this.ejecucionEnCurso = false;
        }
      });
    }
  }

  /**
   * Simulación local de una corrida: avanza por las fases del motor y, al terminar,
   * registra una nueva versión en el historial.
   */
  private simularCorrida(): void {
    this.ejecucionEnCurso = true;
    this.progreso = 0;
    let faseIndex = 0;
    this.faseActual = this.fases[0];

    this.ejecucionTimer = setInterval(() => {
      faseIndex++;
      if (faseIndex < this.fases.length) {
        this.faseActual = this.fases[faseIndex];
        this.progreso = Math.round((faseIndex / this.fases.length) * 100);
      } else {
        clearInterval(this.ejecucionTimer);
        this.ejecucionTimer = null;
        this.progreso = 100;
        this.finalizarCorridaSimulada();
      }
    }, 700);
  }

  private finalizarCorridaSimulada(): void {
    const nuevaVersion = this.corridas.reduce((max, c) => Math.max(max, c.version), 0) + 1;
    const conDiferencias = !this.seccionIIICompleta; // sin étnicas → advertencias
    const nueva: CorridaDistribucion = {
      idCorrida: Date.now(),
      version: nuevaVersion,
      idBienio: this.selectedBienio?.id,
      bienio: this.selectedBienio?.label,
      fechaEjecucion: new Date().toISOString(),
      usuario: this.usuarioActual,
      versionInsumos: 'INS-2027-08',
      versionParametros: 'P-v2',
      hashResultados: Math.random().toString(16).slice(2, 8),
      estado: conDiferencias ? 'con_diferencias' : 'exitosa',
      esOficial: false,
      mensaje: conDiferencias ? 'Ejecutada sin insumos de Sección III (destinaciones étnicas).' : undefined,
      resumenVerificacion: this.verificacionMock(conDiferencias ? 'advertencia' : 'ok')
    };
    this.corridas = [nueva, ...this.corridas];
    this.ejecucionEnCurso = false;
    this.faseActual = '';
  }

  /**
   * Seguimiento por polling de una corrida real (usado cuando simularEjecucion = false).
   */
  private iniciarSeguimiento(corrida: CorridaDistribucion): void {
    this.ejecucionEnCurso = true;
    this.progreso = 0;
    this.faseActual = this.fases[0];

    this.ejecucionTimer = setInterval(() => {
      this.sicodisApiService.getEstadoEjecucionSgr(corrida.idCorrida).subscribe({
        next: (estado) => {
          this.progreso = estado.progreso ?? this.progreso;
          this.faseActual = estado.faseActual ?? this.faseActual;
          if (estado.estado !== 'en_proceso') {
            clearInterval(this.ejecucionTimer);
            this.ejecucionTimer = null;
            this.ejecucionEnCurso = false;
            this.faseActual = '';
            this.cargarCorridas();
          }
        },
        error: (error) => {
          console.error('Error al consultar el estado de la ejecución:', error);
          clearInterval(this.ejecucionTimer);
          this.ejecucionTimer = null;
          this.ejecucionEnCurso = false;
        }
      });
    }, 1500);
  }

  // ===================== Etiquetas =====================

  estadoLabel(estado: EstadoCorrida): string {
    switch (estado) {
      case 'exitosa': return 'Exitosa';
      case 'con_diferencias': return 'Con diferencias';
      case 'fallida': return 'Fallida';
      default: return 'En proceso';
    }
  }

  estadoSeverity(estado: EstadoCorrida): 'success' | 'warn' | 'danger' | 'info' {
    switch (estado) {
      case 'exitosa': return 'success';
      case 'con_diferencias': return 'warn';
      case 'fallida': return 'danger';
      default: return 'info';
    }
  }

  verificacionTexto(corrida: CorridaDistribucion): string {
    const v = corrida.resumenVerificacion;
    if (!v) { return '—'; }
    if (corrida.estado === 'fallida') { return 'Error'; }
    if (v.cuadraturaOk && v.chequeosOk === v.chequeosTotales) { return '100%'; }
    return `${v.chequeosOk}/${v.chequeosTotales}`;
  }

  verificacionIcono(corrida: CorridaDistribucion): string {
    if (corrida.estado === 'fallida') { return 'pi pi-times-circle'; }
    if (corrida.estado === 'con_diferencias') { return 'pi pi-exclamation-triangle'; }
    return 'pi pi-check-circle';
  }

  // ===================== Detalle de corrida (Incremento 2) =====================

  verDetalle(corrida: CorridaDistribucion): void {
    this.corridaDetalle = corrida;
    this.detalleChequeos = corrida.resumenVerificacion?.chequeos ?? [];
    this.detalleTotales = this.construirTotales(corrida);
    this.showDetalleDialog = true;

    if (!this.simularEjecucion) {
      this.sicodisApiService.getDetalleCorridaSgr(corrida.idCorrida).subscribe({
        next: (detalle) => {
          this.detalleChequeos = detalle.chequeos ?? this.detalleChequeos;
          this.detalleTotales = detalle.totales ?? this.detalleTotales;
        },
        error: (error) => console.error('Error al cargar el detalle de la corrida:', error)
      });
    }
  }

  cerrarDetalle(): void {
    this.showDetalleDialog = false;
    this.corridaDetalle = null;
  }

  /**
   * Construye los totales por asignación a partir de los porcentajes de la versión
   * de parámetros y de la base de ingresos corrientes del bienio (mock).
   */
  private construirTotales(corrida: CorridaDistribucion): TotalAsignacion[] {
    const base = this.baseIngresosPorBienio[corrida.idBienio] ?? 0;
    const fuente = this.parametros?.porcentajes ?? [];
    if (!base || !fuente.length) { return []; }

    const totales: TotalAsignacion[] = fuente
      .filter(p => typeof p.valor === 'number')
      .map(p => {
        const pct = p.valor as number;
        return {
          concepto: p.etiqueta,
          porcentaje: pct,
          valor: Math.round(base * pct / 100),
          esSubnivel: p.etiqueta.trim().startsWith('—')
        };
      });

    totales.push({
      concepto: 'Total ingresos corrientes',
      porcentaje: 100,
      valor: base,
      isTotal: true
    });
    return totales;
  }

  /**
   * Indica si los valores de parámetros mostrados (versión vigente cargada) corresponden
   * a la versión aplicada en la corrida.
   */
  parametrosAplicadosDisponibles(corrida: CorridaDistribucion | null): boolean {
    return !!corrida && !!this.parametros && this.parametros.etiquetaVersion === corrida.versionParametros;
  }

  chequeoIcono(resultado: ChequeoItem['resultado']): string {
    switch (resultado) {
      case 'ok': return 'pi pi-check-circle';
      case 'advertencia': return 'pi pi-exclamation-triangle';
      default: return 'pi pi-times-circle';
    }
  }

  // ===================== Descargas (Incremento 2) =====================

  descargarSalida(corrida: CorridaDistribucion, tipo: TipoSalidaCorrida): void {
    if (this.simularEjecucion) {
      this.descargarSimulado(corrida, tipo);
      return;
    }
    this.descargando = tipo;
    this.sicodisApiService.descargarSalidaCorridaSgr(corrida.idCorrida, tipo).subscribe({
      next: (response) => {
        const blob = response.body;
        this.descargando = null;
        if (!blob) { return; }
        this.dispararDescarga(blob, this.nombreArchivoSalida(corrida, tipo));
      },
      error: (error) => {
        console.error('Error al descargar la salida:', error);
        this.descargando = null;
      }
    });
  }

  private descargarSimulado(corrida: CorridaDistribucion, tipo: TipoSalidaCorrida): void {
    const encabezado = `SICODIS · Distribución SGR (contenido simulado — pendiente de backend)\n` +
      `Bienio: ${corrida.bienio}\nCorrida: v${corrida.version} · ${corrida.fechaEjecucion}\n` +
      `Versión de insumos: ${corrida.versionInsumos}\nVersión de parámetros: ${corrida.versionParametros}\n` +
      `Hash: ${corrida.hashResultados}\nSalida: ${tipo.toUpperCase()}\n`;
    const contenido = tipo === 'xml'
      ? `<?xml version="1.0" encoding="UTF-8"?>\n<!-- ${encabezado.replace(/\n/g, ' · ')} -->\n<distribucionSGR bienio="${corrida.bienio}" version="v${corrida.version}"/>`
      : encabezado + '\n' + this.detalleTotales.map(t => `${t.concepto};${t.porcentaje};${t.valor}`).join('\n');
    const mime = tipo === 'xml' ? 'application/xml' : 'text/plain;charset=utf-8';
    this.dispararDescarga(new Blob([contenido], { type: mime }), this.nombreArchivoSalida(corrida, tipo));
  }

  private nombreArchivoSalida(corrida: CorridaDistribucion, tipo: TipoSalidaCorrida): string {
    const bienio = (corrida.bienio || '').replace(/\s/g, '');
    const ext = tipo === 'excel' ? 'xlsx' : (tipo === 'xml' ? 'xml' : 'txt');
    const base = tipo === 'reporte' ? 'reporte_verificacion' : (tipo === 'xml' ? 'xml_spgr' : 'distribucion');
    return `${base}_${bienio}_v${corrida.version}.${ext}`;
  }

  private dispararDescarga(blob: Blob, filename: string): void {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(link.href);
  }

  // ===================== Oficialización (Incremento 3) =====================

  puedeMarcarOficial(corrida: CorridaDistribucion | null): boolean {
    return !!corrida && !corrida.esOficial && corrida.estado !== 'fallida';
  }

  marcarOficial(corrida: CorridaDistribucion): void {
    if (!this.puedeMarcarOficial(corrida)) { return; }

    const oficialActual = this.corridas.find(c => c.esOficial && c.idBienio === corrida.idBienio);
    const advertencia = corrida.estado === 'con_diferencias'
      ? ' Esta corrida presenta diferencias en la verificación.'
      : '';
    const reemplazo = oficialActual
      ? ` Reemplazará a la versión oficial actual (v${oficialActual.version}).`
      : '';

    this.confirmationService.confirm({
      header: 'Marcar versión oficial',
      message: `¿Marcar la corrida v${corrida.version} del bienio ${corrida.bienio} como la versión oficial?${reemplazo}${advertencia}`,
      icon: 'pi pi-star',
      acceptLabel: 'Marcar oficial',
      rejectLabel: 'Cancelar',
      accept: () => this.aplicarOficial(corrida)
    });
  }

  private aplicarOficial(corrida: CorridaDistribucion): void {
    if (this.simularEjecucion) {
      this.actualizarOficialLocal(corrida.idCorrida);
      return;
    }
    this.sicodisApiService.marcarCorridaOficialSgr(corrida.idCorrida).subscribe({
      next: () => {
        this.cargarCorridas();
        this.actualizarOficialLocal(corrida.idCorrida);
      },
      error: (error) => console.error('Error al marcar la corrida como oficial:', error)
    });
  }

  private actualizarOficialLocal(idCorrida: number): void {
    this.corridas = this.corridas.map(c => ({
      ...c,
      esOficial: c.idBienio === this.selectedBienio?.id ? c.idCorrida === idCorrida : c.esOficial
    }));
    if (this.corridaDetalle) {
      const actualizada = this.corridas.find(c => c.idCorrida === this.corridaDetalle!.idCorrida);
      if (actualizada) { this.corridaDetalle = actualizada; }
    }
  }

  // ===================== Parámetros =====================

  private cargarParametros(): void {
    if (this.simularParametros) {
      this.parametros = this.parametrosMock(this.selectedBienio);
      return;
    }
    this.sicodisApiService.getParametrosVigentesSgr(this.selectedBienio?.id).subscribe({
      next: (conjunto) => this.parametros = conjunto,
      error: (error) => {
        console.error('Error al cargar parámetros:', error);
        this.parametros = null;
      }
    });
  }

  /**
   * Formatea el valor de un parámetro según su unidad.
   */
  formatValor(p: ParametroValor): string {
    if (typeof p.valor === 'boolean') {
      return p.valor ? 'Sí' : 'No';
    }
    const n = p.valor;
    switch (p.unidad) {
      case '%': return this.formatNumero(n, 2) + '%';
      case 'factor': return this.formatNumero(n, 2);
      case 'pp': return this.formatNumero(n, 0) + ' p.p.';
      default: return String(n);
    }
  }

  private formatNumero(n: number, dec: number): string {
    return n.toLocaleString('es-CO', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  }

  redondeoModoLabel(modo: 'redondeo' | 'truncamiento'): string {
    return modo === 'redondeo' ? 'Redondeo' : 'Truncamiento';
  }

  private parametrosMock(bienio: any): ConjuntoParametros {
    const pct = (clave: string, etiqueta: string, valor: number, ref?: string): ParametroValor =>
      ({ clave, etiqueta, valor, unidad: '%', referenciaNormativa: ref });
    const fac = (clave: string, etiqueta: string, valor: number): ParametroValor =>
      ({ clave, etiqueta, valor, unidad: 'factor' });

    return {
      idVersion: 2,
      etiquetaVersion: 'P-v2',
      vigencia: bienio?.label ?? '',
      fecha: '2026-08-12T00:00:00',
      autor: 'admin',
      motivo: 'Parámetros de referencia tabla 2 · Ley 2056 de 2020',
      porcentajes: [
        pct('inversion', 'Inversión', 92.5, 'Art. 361 C.P. · art. 22 L2056'),
        pct('inversion.ad', '— Asignaciones Directas (20% + 5%)', 25, 'Arts. 22 y 23 L2056'),
        pct('inversion.ail', '— Asignación Inversión Local (12,68% + 2,32%)', 15, 'Art. 48 L2056'),
        pct('inversion.air', '— Asignación Inversión Regional (20,4% dptos / 13,6% reg.)', 34, 'Arts. 44 y 45 L2056'),
        pct('inversion.acti', '— Ciencia, Tecnología e Innovación', 10, 'Art. 52 L2056'),
        pct('inversion.paz', '— Asignación para la Paz', 7, 'Parág. 7.º trans. art. 361 C.P.'),
        pct('inversion.ambiental', '— Asignación Ambiental', 1, 'Art. 50 L2056'),
        pct('inversion.cormagdalena', '— Cormagdalena', 0.5, 'Art. 331 C.P.'),
        pct('ahorro', 'Ahorro', 4.5, 'Art. 361 C.P. · art. 22 L2056'),
        pct('ahorro.fae', '— FAE (referencia)', 2.25, 'Art. 113 L2056'),
        pct('ahorro.fonpet', '— FONPET (referencia)', 2.25, 'Art. 122 L2056'),
        pct('administracion', 'Administración', 3, 'Art. 361 C.P. · art. 22 L2056'),
        pct('administracion.funcionamiento', '— Funcionamiento y fiscalización', 2, 'Art. 12 L2056'),
        pct('administracion.ssec', '— SSEC (CGR · PGN · DNP)', 1, 'Art. 167 L2056')
      ],
      ponderadores: [
        fac('ail.nbi', 'AIL · NBI', 0.6),
        fac('ail.poblacion', 'AIL · Población', 0.4),
        fac('air.nbi', 'AIR · NBI', 0.5),
        fac('air.poblacion', 'AIR · Población', 0.4),
        fac('air.desempleo', 'AIR · Desempleo', 0.1),
        fac('air.particion.dptos', 'AIR · Partición departamentos', 0.6),
        fac('air.particion.regiones', 'AIR · Partición regiones', 0.4),
        fac('fonpet.ppnc', 'FONPET · PPNC', 0.8),
        fac('fonpet.nbi', 'FONPET · NBI', 0.1),
        fac('fonpet.poblacion', 'FONPET · Población', 0.1),
        fac('etnico.urbano', 'Étnico · Ponderador urbano', 0.4),
        fac('etnico.rural', 'Étnico · Ponderador rural', 0.6)
      ],
      umbrales: [
        { clave: 'ail.compensacion.umbral', etiqueta: 'Compensación AIL · garantía', valor: 75, unidad: '%', referenciaNormativa: 'num. 3.1.1.2.2' },
        { clave: 'ail.compensacion.parcial', etiqueta: 'Permitir compensación parcial', valor: true, unidad: 'flag' },
        { clave: 'fae.piso', etiqueta: 'Piso FAE (del ahorro)', valor: 50, unidad: '%', referenciaNormativa: 'num. 3.2.1.1' },
        { clave: 'etnico.bloqueo', etiqueta: 'Bloqueo étnico', valor: 20, unidad: '%', referenciaNormativa: 'Sección III' },
        { clave: 'ambiental.minimo', etiqueta: 'Mínimo ambiental del SGR', valor: 2, unidad: 'pp' },
        { clave: 'noaforados.corriente', etiqueta: 'No aforados · bolsa corriente', valor: 75, unidad: '%', referenciaNormativa: 'num. 5.1.1.f' },
        { clave: 'noaforados.restante', etiqueta: 'No aforados · bolsa restante', valor: 25, unidad: '%', referenciaNormativa: 'num. 5.1.1.f' },
        { clave: 'etnico.excluir.car', etiqueta: 'Excluir CAR de la base étnica', valor: true, unidad: 'flag' },
        { clave: 'etnico.excluir.indeterminados', etiqueta: 'Excluir indeterminados de la base étnica', valor: true, unidad: 'flag' }
      ],
      redondeo: [
        { tipoSalida: 'PR', etiqueta: 'Plan de Recursos (decenal)', decimales: 0, modo: 'redondeo' },
        { tipoSalida: 'desahorroFAE', etiqueta: 'Desahorro FAE', decimales: 0, modo: 'redondeo' },
        { tipoSalida: 'mayorRecaudo', etiqueta: 'Mayor recaudo', decimales: 0, modo: 'redondeo' },
        { tipoSalida: 'multas', etiqueta: 'Multas', decimales: 0, modo: 'redondeo' },
        { tipoSalida: 'etnicas', etiqueta: 'Destinaciones étnicas', decimales: 0, modo: 'redondeo' },
        { tipoSalida: 'PBC', etiqueta: 'Plan Bienal de Caja', decimales: 2, modo: 'redondeo' },
        { tipoSalida: 'IAC', etiqueta: 'IAC (límite SPGR)', decimales: 2, modo: 'redondeo' }
      ]
    };
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
        <h4 style="margin-bottom: 1rem; color: #333;">Ejecución de la distribución del SGR</h4>
        <ul style="list-style-type: none; padding: 0;">
          <li style="margin-bottom: 0.5rem;"><strong>Corrida:</strong> ejecución del motor de cálculo para un bienio; se guarda como una versión inmutable identificada por su fecha/hora.</li>
          <li style="margin-bottom: 0.5rem;"><strong>Versión de insumos:</strong> huella del conjunto de insumos usado en la corrida.</li>
          <li style="margin-bottom: 0.5rem;"><strong>Versión de parámetros:</strong> conjunto de porcentajes y umbrales normativos aplicados.</li>
          <li style="margin-bottom: 0.5rem;"><strong>Hash de resultados:</strong> huella que permite reproducir exactamente la distribución.</li>
          <li style="margin-bottom: 0.5rem;"><strong>Verificación:</strong> listas de chequeo del manual (cuadratura del 100%, revisión por beneficiario y asignación).</li>
          <li style="margin-bottom: 0.5rem;"><strong>Versión oficial:</strong> corrida promovida como la distribución comunicada del bienio.</li>
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
          <li style="margin-bottom: 0.5rem;"><strong>AIL:</strong> Asignación para Inversión Local</li>
          <li style="margin-bottom: 0.5rem;"><strong>AIR:</strong> Asignación para Inversión Regional</li>
          <li style="margin-bottom: 0.5rem;"><strong>AD:</strong> Asignaciones Directas</li>
          <li style="margin-bottom: 0.5rem;"><strong>FAE:</strong> Fondo de Ahorro y Estabilización</li>
          <li style="margin-bottom: 0.5rem;"><strong>FONPET:</strong> Fondo Nacional de Pensiones de las Entidades Territoriales</li>
          <li style="margin-bottom: 0.5rem;"><strong>SSEC:</strong> Sistema de Seguimiento, Evaluación y Control</li>
          <li style="margin-bottom: 0.5rem;"><strong>PBC:</strong> Plan Bienal de Caja</li>
          <li style="margin-bottom: 0.5rem;"><strong>IAC:</strong> Instrucción de Abono a Cuenta</li>
          <li style="margin-bottom: 0.5rem;"><strong>SPGR:</strong> Sistema de Presupuesto y Giro de Regalías</li>
        </ul>
      </div>
    `;
  }
}
