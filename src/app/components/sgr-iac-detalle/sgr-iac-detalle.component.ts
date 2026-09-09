import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

import { NumberFormatPipe } from '../../utils/numberFormatPipe';
import { PercentFormatPipe } from '../../utils/percentFormatPipe';
import { dispararDescarga, extraerNombreArchivo } from '../../utils/descarga-archivo';
import { SgrIacService } from '../../services/sgr-iac.service';
import {
  SgrParametrosService,
  formatValorParametro,
  modoRedondeoLabel,
} from '../../services/sgr-parametros.service';
import { ConjuntoParametros, ParametroValor } from '../../services/sicodis-api.service';
import { UserAuthService } from '../../auth/user-auth.service';
import { PasoMhcpComponent } from './pasos/paso-mhcp.component';
import { PasoDeterminacionesComponent } from './pasos/paso-determinaciones.component';
import { PasoFunfisComponent } from './pasos/paso-funfis.component';
import {
  ArchivoIacCalculada,
  DefinicionParticipante,
  EstadoIac,
  EstadoInsumosIac,
  EstadoPaso,
  IacResumen,
  PARTICIPANTES,
  ParticipanteIac,
  ResultadoCalculoIac,
} from '../../models/sgr-iac.models';

type Seccion = 'resumen' | 'insumos' | 'calculo' | 'parametros';

/**
 * Detalle de una Instrucción de Abono a Cuenta.
 *
 * Sustituye el modal de `IACAutomatica4.aspx`: los cinco pasos de insumos, el
 * cálculo y el envío a validación viven en una ruta propia con enlace directo.
 */
@Component({
  selector: 'app-sgr-iac-detalle',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    TableModule,
    TagModule,
    TooltipModule,
    ConfirmDialogModule,
    NumberFormatPipe,
    PercentFormatPipe,
    PasoMhcpComponent,
    PasoDeterminacionesComponent,
    PasoFunfisComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './sgr-iac-detalle.component.html',
  styleUrl: './sgr-iac-detalle.component.scss',
})
export class SgrIacDetalleComponent implements OnInit {

  private ruta = inject(ActivatedRoute);
  private router = inject(Router);
  private iacService = inject(SgrIacService);
  private parametrosService = inject(SgrParametrosService);
  private mensajes = inject(MessageService);
  private confirmacion = inject(ConfirmationService);
  private auth = inject(UserAuthService);

  idIac = 0;
  iac = signal<IacResumen | null>(null);
  estadoInsumos = signal<EstadoInsumosIac | null>(null);
  resultado = signal<ResultadoCalculoIac | null>(null);
  parametros = signal<ConjuntoParametros | null>(null);

  seccion: Seccion = 'insumos';
  indicePaso = 0;
  cargando = signal(true);
  calculando = signal(false);
  enviando = signal(false);
  noEncontrada = signal(false);

  readonly participantes = PARTICIPANTES;

  ngOnInit(): void {
    this.ruta.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (!Number.isFinite(id) || id <= 0) {
        this.noEncontrada.set(true);
        this.cargando.set(false);
        return;
      }
      this.idIac = id;
      this.cargarTodo();
    });

    this.ruta.queryParamMap.subscribe(params => {
      const seccion = params.get('seccion') as Seccion | null;
      if (seccion && ['resumen', 'insumos', 'calculo', 'parametros'].includes(seccion)) {
        this.seccion = seccion;
      }
    });
  }

  // ===================== Carga =====================

  private cargarTodo(): void {
    this.cargando.set(true);
    this.iacService.getIac(this.idIac).subscribe({
      next: iac => {
        this.cargando.set(false);
        if (!iac) {
          this.noEncontrada.set(true);
          return;
        }
        this.iac.set(iac);
        this.cargarParametros(iac);
      },
      error: () => {
        this.cargando.set(false);
        this.error('No fue posible consultar la Instrucción de Abono a Cuenta.');
      },
    });

    this.recargarEstadoInsumos();
    this.recargarResultado();
  }

  private cargarParametros(iac: IacResumen): void {
    this.parametrosService.getVigentes(iac.idVigencia, iac.bienio).subscribe({
      next: conjunto => this.parametros.set(conjunto),
      error: () => this.parametros.set(null),
    });
  }

  recargarEstadoInsumos(): void {
    this.iacService.getEstadoInsumos(this.idIac).subscribe({
      next: estado => this.estadoInsumos.set(estado),
      error: () => this.error('No fue posible consultar el estado de los insumos.'),
    });
  }

  private recargarResultado(): void {
    this.iacService.getResultado(this.idIac).subscribe({
      next: resultado => this.resultado.set(resultado),
      error: () => this.resultado.set(null),
    });
  }

  /** Un cambio en cualquier paso puede invalidar el cálculo previo. */
  onCambioPaso(): void {
    this.recargarEstadoInsumos();
    this.recargarResultado();
    this.iacService.getIac(this.idIac).subscribe({ next: iac => iac && this.iac.set(iac) });
  }

  // ===================== Navegación =====================

  // ===================== Parámetros aplicados =====================

  formatValor(p: ParametroValor): string {
    return formatValorParametro(p);
  }

  redondeoModoLabel(modo: 'redondeo' | 'truncamiento'): string {
    return modoRedondeoLabel(modo);
  }

  /** Versión de parámetros con la que se calculó esta IAC, si ya se calculó. */
  get versionAplicada(): string | null {
    return this.resultado()?.versionParametros ?? null;
  }

  /**
   * La IAC queda anclada a la versión de parámetros con la que se calculó. Si
   * después se publica una versión nueva, lo que se muestra abajo ya no es lo
   * que se aplicó, y hay que advertirlo.
   */
  get parametrosDesactualizados(): boolean {
    const aplicada = this.versionAplicada;
    const vigente = this.parametros()?.etiquetaVersion;
    return !!aplicada && !!vigente && aplicada !== vigente;
  }

  /** Redondeo que rige la salida de la IAC (límite del SPGR). */
  get redondeoIac(): { etiqueta: string; decimales: number; modo: 'redondeo' | 'truncamiento' } | null {
    return this.parametros()?.redondeo.find(r => r.tipoSalida === 'IAC') ?? null;
  }

  // ===================== Navegación =====================

  irASeccion(seccion: Seccion): void {
    this.seccion = seccion;
    this.router.navigate([], {
      relativeTo: this.ruta,
      queryParams: { seccion },
      replaceUrl: true,
    });
  }

  irAPaso(indice: number): void {
    if (indice < 0 || indice >= this.participantes.length) { return; }
    this.indicePaso = indice;
    if (this.seccion !== 'insumos') { this.irASeccion('insumos'); }
  }

  pasoAnterior(): void { this.irAPaso(this.indicePaso - 1); }
  pasoSiguiente(): void { this.irAPaso(this.indicePaso + 1); }

  get participanteActivo(): DefinicionParticipante {
    return this.participantes[this.indicePaso];
  }

  get hayAnterior(): boolean { return this.indicePaso > 0; }
  get haySiguiente(): boolean { return this.indicePaso < this.participantes.length - 1; }

  volverAlListado(): void {
    this.router.navigate(['/sgr-iac']);
  }

  // ===================== Estado de los pasos =====================

  estadoDe(participante: ParticipanteIac): EstadoPaso {
    return this.estadoInsumos()?.pasos.find(p => p.participante === participante)?.estado ?? 'pendiente';
  }

  iconoPaso(participante: ParticipanteIac): string {
    switch (this.estadoDe(participante)) {
      case 'completo': return 'pi pi-check';
      case 'error': return 'pi pi-times';
      case 'cargando': return 'pi pi-spin pi-spinner';
      default: return 'pi pi-circle';
    }
  }

  get pasosObligatoriosCompletos(): number {
    return (this.estadoInsumos()?.pasos ?? [])
      .filter(p => p.obligatorio && p.estado === 'completo').length;
  }

  get totalPasosObligatorios(): number {
    return this.participantes.filter(p => p.obligatorio).length;
  }

  get insumosCompletos(): boolean {
    return this.estadoInsumos()?.completo ?? false;
  }

  /** Participantes obligatorios que aún faltan, para explicar el bloqueo. */
  get faltantes(): string[] {
    return (this.estadoInsumos()?.pasos ?? [])
      .filter(p => p.obligatorio && p.estado !== 'completo')
      .map(p => this.participantes.find(x => x.codigo === p.participante)?.sigla ?? p.participante);
  }

  get motivoBloqueoCalculo(): string {
    if (this.soloLectura) {
      return 'La IAC ya fue enviada a validación y no admite un nuevo cálculo.';
    }
    if (!this.insumosCompletos) {
      return `Aún no se encuentran los insumos completos para calcular la IAC. Faltan: ${this.faltantes.join(', ')}.`;
    }
    return '';
  }

  /** Una IAC enviada a validación queda congelada. */
  get soloLectura(): boolean {
    return this.iac()?.estado === 'enviada' || this.iac()?.estado === 'anulada';
  }

  // ===================== Cálculo =====================

  calcular(): void {
    if (!this.insumosCompletos || this.soloLectura || this.calculando()) { return; }

    this.calculando.set(true);
    this.iacService.calcularIac(this.idIac).subscribe({
      next: respuesta => {
        this.calculando.set(false);
        if (!respuesta.ok) {
          this.error(respuesta.mensaje);
          return;
        }
        this.resultado.set(respuesta.datos ?? null);
        this.exito(respuesta.mensaje);
        this.onCambioPaso();
        this.irASeccion('calculo');
      },
      error: () => {
        this.calculando.set(false);
        this.error('No fue posible calcular la IAC.');
      },
    });
  }

  get puedeEnviarAValidacion(): boolean {
    const r = this.resultado();
    return !!r && !r.enviadaAValidacion && !this.enviando();
  }

  enviarAValidacion(): void {
    if (!this.puedeEnviarAValidacion) { return; }

    this.confirmacion.confirm({
      header: 'Enviar la IAC a validación',
      message: 'Después de enviarla, la IAC no admitirá cambios en los insumos ni un nuevo cálculo. '
             + '¿Confirma el envío a validación?',
      icon: 'pi pi-send',
      acceptLabel: 'Enviar a validación',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.enviando.set(true);
        this.iacService.enviarAValidacion(this.idIac, this.auth.usuario() || 'anonimo').subscribe({
          next: respuesta => {
            this.enviando.set(false);
            respuesta.ok ? this.exito(respuesta.mensaje) : this.error(respuesta.mensaje);
            this.onCambioPaso();
          },
          error: () => {
            this.enviando.set(false);
            this.error('No fue posible enviar la IAC a validación.');
          },
        });
      },
    });
  }

  // ===================== Descargas =====================

  get descargasDisponibles(): boolean {
    return this.iacService.descargasDisponibles;
  }

  descargarSalida(archivo: ArchivoIacCalculada): void {
    if (!this.descargasDisponibles) { return; }
    this.iacService.descargarArchivo(archivo.idArchivo).subscribe({
      next: (respuesta: HttpResponse<Blob>) => {
        if (!respuesta.body) {
          this.error('El servidor no devolvió contenido para el archivo solicitado.');
          return;
        }
        const nombre = extraerNombreArchivo(respuesta.headers.get('Content-Disposition')) ?? archivo.nombre;
        dispararDescarga(respuesta.body, nombre);
      },
      error: () => this.error('No fue posible descargar el archivo.'),
    });
  }

  // ===================== Presentación =====================

  estadoLabel(estado: EstadoIac | undefined): string {
    switch (estado) {
      case 'calculada': return 'Calculada';
      case 'enviada': return 'Enviada a validación';
      case 'anulada': return 'Anulada';
      default: return 'En borrador';
    }
  }

  estadoSeverity(estado: EstadoIac | undefined): 'success' | 'info' | 'warn' | 'danger' {
    switch (estado) {
      case 'calculada': return 'info';
      case 'enviada': return 'success';
      case 'anulada': return 'danger';
      default: return 'warn';
    }
  }

  private exito(mensaje: string): void {
    this.mensajes.add({ severity: 'success', summary: 'Operación exitosa', detail: mensaje });
  }

  private error(mensaje: string): void {
    this.mensajes.add({ severity: 'error', summary: 'Operación no realizada', detail: mensaje });
  }
}
