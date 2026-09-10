import { Component, Input, OnChanges, OnDestroy, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { Select } from 'primeng/select';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { NumberFormatPipe } from '../../../utils/numberFormatPipe';
import { SgrIacNotificacionesService } from '../../../services/sgr-iac-notificaciones.service';
import { SgrIacService } from '../../../services/sgr-iac.service';
import { UserAuthService } from '../../../auth/user-auth.service';
import {
  DestinatarioLote,
  EstadoDestinatario,
  EstadoLote,
  IacResumen,
  LoteNotificacion,
  MARCADORES_PLANTILLA,
  ReporteVariaciones,
} from '../../../models/sgr-iac.models';

type FiltroDestinatario = 'todos' | 'pendiente' | 'enviado' | 'fallido' | 'sin_correo';

/**
 * Notificación masiva a las entidades territoriales beneficiarias de la IAC.
 *
 * Flujo: preparar el lote (cruce del cálculo con el directorio) → redactar la
 * plantilla → previsualizar con los datos de una entidad concreta → enviar →
 * seguir el resultado destinatario a destinatario y reintentar los fallidos.
 */
@Component({
  selector: 'app-iac-notificaciones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    TagModule,
    TooltipModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    CheckboxModule,
    Select,
    NumberFormatPipe,
  ],
  templateUrl: './notificaciones.component.html',
  styleUrl: './notificaciones.component.scss',
})
export class NotificacionesComponent implements OnChanges, OnDestroy {

  private notificaciones = inject(SgrIacNotificacionesService);
  private iacService = inject(SgrIacService);
  private mensajes = inject(MessageService);
  private confirmacion = inject(ConfirmationService);
  private auth = inject(UserAuthService);
  private sanitizer = inject(DomSanitizer);

  @Input({ required: true }) iac!: IacResumen;
  /** El envío solo tiene sentido sobre una IAC ya calculada. */
  @Input() calculada = false;
  @Input() fechaCalculo: string | null = null;

  // Preparación
  destinatarios = signal<DestinatarioLote[]>([]);
  preparando = signal(false);
  variaciones: ReporteVariaciones | null = null;

  // Plantilla
  asunto = '';
  cuerpo = '';
  adjuntarDetalle = true;

  // Lotes
  lotes = signal<LoteNotificacion[]>([]);
  loteActivo = signal<LoteNotificacion | null>(null);
  enviando = signal(false);

  // Vista previa
  mostrarPrevia = false;
  entidadPrevia: DestinatarioLote | null = null;

  // Filtros del seguimiento
  filtroEstado: { id: FiltroDestinatario; label: string } = { id: 'todos', label: 'Todos' };
  readonly filtrosEstado: Array<{ id: FiltroDestinatario; label: string }> = [
    { id: 'todos', label: 'Todos' },
    { id: 'enviado', label: 'Enviados' },
    { id: 'fallido', label: 'Fallidos' },
    { id: 'pendiente', label: 'Pendientes' },
    { id: 'sin_correo', label: 'Sin correo' },
  ];

  readonly marcadores = MARCADORES_PLANTILLA;

  ngOnChanges(cambios: SimpleChanges): void {
    if (cambios['iac'] || cambios['fechaCalculo']) {
      const borrador = this.notificaciones.getBorrador(this.iac.id);
      this.asunto = borrador.asunto;
      this.cuerpo = borrador.cuerpo;
      this.adjuntarDetalle = borrador.adjuntarDetalle;
      this.cargarLotes();
      if (this.calculada) { this.prepararDestinatarios(); }
    }
  }

  /** El borrador sobrevive al cambio de pestaña, que desmonta el componente. */
  ngOnDestroy(): void {
    this.guardarBorrador();
  }

  private guardarBorrador(): void {
    if (!this.iac) { return; }
    this.notificaciones.guardarBorrador(this.iac.id, {
      asunto: this.asunto,
      cuerpo: this.cuerpo,
      adjuntarDetalle: this.adjuntarDetalle,
    });
  }

  // ===================== Preparación =====================

  /**
   * Cruza los beneficiarios del cálculo con el directorio de entidades.
   *
   * Necesita el resultado (valores) y, si existe, las variaciones (para poder
   * incluirlas en el cuerpo del correo).
   */
  prepararDestinatarios(): void {
    this.preparando.set(true);

    this.iacService.getResultado(this.iac.id).subscribe({
      next: resultado => {
        if (!resultado) {
          this.preparando.set(false);
          this.destinatarios.set([]);
          return;
        }

        this.iacService.getReporteVariaciones(this.iac.id).subscribe({
          next: variaciones => {
            this.variaciones = variaciones;
            this.notificaciones.getDirectorio().subscribe({
              next: directorio => {
                this.destinatarios.set(
                  this.notificaciones.prepararDestinatarios(
                    resultado.resumenPorEntidad, directorio, variaciones,
                  ),
                );
                this.preparando.set(false);
              },
              error: () => this.fallo('No fue posible consultar el directorio de entidades territoriales.'),
            });
          },
          error: () => this.fallo('No fue posible obtener las variaciones para el correo.'),
        });
      },
      error: () => this.fallo('No fue posible consultar el resultado del cálculo.'),
    });
  }

  private fallo(detalle: string): void {
    this.preparando.set(false);
    this.mensajes.add({ severity: 'error', summary: 'Operación no realizada', detail: detalle });
  }

  get conCorreo(): DestinatarioLote[] {
    return this.destinatarios().filter(d => d.estado !== 'sin_correo');
  }

  get sinCorreo(): DestinatarioLote[] {
    return this.destinatarios().filter(d => d.estado === 'sin_correo');
  }

  get totalADistribuir(): number {
    return this.destinatarios().reduce((acc, d) => acc + d.valorDistribuir, 0);
  }

  // ===================== Plantilla =====================

  get marcadoresInvalidos(): string[] {
    const admitidos = this.marcadores.map(m => m.clave);
    return [
      ...this.notificaciones.marcadoresDesconocidos(this.asunto, admitidos),
      ...this.notificaciones.marcadoresDesconocidos(this.cuerpo, admitidos),
    ];
  }

  get plantillaValida(): boolean {
    return this.asunto.trim().length >= 5
        && this.cuerpo.trim().length >= 20
        && this.marcadoresInvalidos.length === 0;
  }

  get puedeEnviar(): boolean {
    return this.calculada
        && this.plantillaValida
        && this.conCorreo.length > 0
        && !this.enviando();
  }

  restaurarPlantilla(): void {
    this.asunto = this.notificaciones.asuntoPorDefecto;
    this.cuerpo = this.notificaciones.cuerpoPorDefecto;
  }

  insertarMarcador(clave: string): void {
    this.cuerpo = `${this.cuerpo}${clave}`;
  }

  // ===================== Vista previa =====================

  abrirPrevia(destinatario?: DestinatarioLote): void {
    this.entidadPrevia = destinatario ?? this.conCorreo[0] ?? this.destinatarios()[0] ?? null;
    this.mostrarPrevia = true;
  }

  get asuntoPrevia(): string {
    if (!this.entidadPrevia) { return ''; }
    return this.notificaciones.resolverPlantilla(this.asunto, this.entidadPrevia, this.iac);
  }

  /**
   * Cuerpo con los marcadores resueltos.
   *
   * La plantilla la redacta un administrador autenticado y solo se muestra aquí
   * como previsualización de lo que se enviará, así que se marca como confiable.
   */
  get cuerpoPrevia(): SafeHtml {
    if (!this.entidadPrevia) { return ''; }
    const html = this.notificaciones.resolverPlantilla(this.cuerpo, this.entidadPrevia, this.iac);
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  cambiarEntidadPrevia(destinatario: DestinatarioLote): void {
    this.entidadPrevia = destinatario;
  }

  // ===================== Envío =====================

  confirmarEnvio(): void {
    if (!this.puedeEnviar) { return; }

    const total = this.conCorreo.length;
    this.confirmacion.confirm({
      header: 'Enviar la notificación a las entidades',
      message: `Se enviarán ${total} correos, uno por entidad beneficiaria, con su propio valor a `
             + 'distribuir. Es una comunicación externa: revise la vista previa antes de continuar. '
             + '¿Confirma el envío?',
      icon: 'pi pi-send',
      acceptLabel: `Enviar ${total} correos`,
      rejectLabel: 'Cancelar',
      accept: () => this.crearYEnviar(),
    });
  }

  private crearYEnviar(): void {
    this.enviando.set(true);

    this.notificaciones.crearLote(
      this.iac,
      this.asunto.trim(),
      this.cuerpo.trim(),
      this.adjuntarDetalle,
      this.destinatarios(),
      this.auth.usuario() || 'anonimo',
    ).subscribe({
      next: respuesta => {
        if (!respuesta.ok || !respuesta.datos) {
          this.enviando.set(false);
          this.mensajes.add({ severity: 'error', summary: 'Operación no realizada', detail: respuesta.mensaje });
          return;
        }

        this.notificaciones.enviarLote(this.iac.id, respuesta.datos.id).subscribe({
          next: envio => {
            this.enviando.set(false);
            this.mensajes.add({
              severity: envio.ok ? 'success' : 'error',
              summary: envio.ok ? 'Envío finalizado' : 'Operación no realizada',
              detail: envio.mensaje,
            });
            if (envio.datos) { this.loteActivo.set(envio.datos); }
            this.cargarLotes();
          },
          error: () => {
            this.enviando.set(false);
            this.mensajes.add({ severity: 'error', summary: 'Operación no realizada', detail: 'El envío no pudo completarse.' });
          },
        });
      },
      error: () => {
        this.enviando.set(false);
        this.mensajes.add({ severity: 'error', summary: 'Operación no realizada', detail: 'No fue posible preparar el lote.' });
      },
    });
  }

  reintentar(lote: LoteNotificacion): void {
    this.enviando.set(true);
    this.notificaciones.reintentarFallidos(this.iac.id, lote.id).subscribe({
      next: respuesta => {
        this.enviando.set(false);
        this.mensajes.add({
          severity: respuesta.ok ? 'success' : 'error',
          summary: respuesta.ok ? 'Reintento finalizado' : 'Operación no realizada',
          detail: respuesta.mensaje,
        });
        if (respuesta.datos) { this.loteActivo.set(respuesta.datos); }
        this.cargarLotes();
      },
      error: () => {
        this.enviando.set(false);
        this.mensajes.add({ severity: 'error', summary: 'Operación no realizada', detail: 'No fue posible reintentar el envío.' });
      },
    });
  }

  // ===================== Lotes =====================

  cargarLotes(): void {
    if (!this.iac) { return; }
    this.notificaciones.getLotes(this.iac.id).subscribe({
      next: lotes => {
        this.lotes.set(lotes);
        const activo = this.loteActivo();
        if (activo) {
          this.loteActivo.set(lotes.find(l => l.id === activo.id) ?? null);
        }
      },
      error: () => this.lotes.set([]),
    });
  }

  verLote(lote: LoteNotificacion): void {
    this.loteActivo.set(this.loteActivo()?.id === lote.id ? null : lote);
  }

  get destinatariosLoteActivo(): DestinatarioLote[] {
    const lote = this.loteActivo();
    if (!lote) { return []; }
    const filtro = this.filtroEstado?.id ?? 'todos';
    return filtro === 'todos'
      ? lote.destinatarios
      : lote.destinatarios.filter(d => d.estado === filtro);
  }

  tieneFallidos(lote: LoteNotificacion | null): boolean {
    return !!lote && lote.totales.fallidos > 0;
  }

  // ===================== Presentación =====================

  estadoDestinatarioLabel(estado: EstadoDestinatario): string {
    switch (estado) {
      case 'enviado': return 'Enviado';
      case 'fallido': return 'Fallido';
      case 'enviando': return 'Enviando…';
      case 'sin_correo': return 'Sin correo';
      default: return 'Pendiente';
    }
  }

  estadoDestinatarioSeverity(estado: EstadoDestinatario): 'success' | 'danger' | 'warn' | 'info' | 'secondary' {
    switch (estado) {
      case 'enviado': return 'success';
      case 'fallido': return 'danger';
      case 'enviando': return 'info';
      case 'sin_correo': return 'secondary';
      default: return 'warn';
    }
  }

  estadoLoteLabel(estado: EstadoLote): string {
    switch (estado) {
      case 'enviando': return 'Enviando';
      case 'completado': return 'Completado';
      case 'completado_con_errores': return 'Completado con errores';
      case 'cancelado': return 'Cancelado';
      default: return 'Borrador';
    }
  }

  estadoLoteSeverity(estado: EstadoLote): 'success' | 'danger' | 'warn' | 'info' {
    switch (estado) {
      case 'completado': return 'success';
      case 'completado_con_errores': return 'warn';
      case 'cancelado': return 'danger';
      default: return 'info';
    }
  }

  porcentajeTexto(valor: number | null | undefined): string {
    if (valor === null || valor === undefined) { return '—'; }
    const pct = valor * 100;
    return `${pct > 0 ? '+' : ''}${pct.toFixed(2).replace('.', ',')} %`;
  }
}
