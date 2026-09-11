import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';

import { NumberFormatPipe } from '../../../utils/numberFormatPipe';
import { SelectorArchivoComponent } from '../../shared/selector-archivo/selector-archivo.component';
import { SgrIacService } from '../../../services/sgr-iac.service';
import { InsumoMhcp, PATRON_RADICADO_MHCP } from '../../../models/sgr-iac.models';

/**
 * Paso 1 · Ministerio de Hacienda y Crédito Público.
 *
 * Único participante que aporta un formulario en lugar de una plantilla:
 * número y fecha del radicado, ingresos a distribuir de ANH y ANM (el total es
 * calculado) y el soporte del radicado.
 */
@Component({
  selector: 'app-paso-mhcp',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DatePickerModule,
    TooltipModule,
    NumberFormatPipe,
    SelectorArchivoComponent,
  ],
  templateUrl: './paso-mhcp.component.html',
  styleUrl: './paso-mhcp.component.scss',
})
export class PasoMhcpComponent implements OnInit {

  private iacService = inject(SgrIacService);
  private mensajes = inject(MessageService);

  @Input({ required: true }) idIac!: number;
  @Input() soloLectura = false;

  @Output() cambio = new EventEmitter<void>();

  // Modelo del formulario
  noRadicado = '';
  fechaRadicado: Date | null = null;
  ingresosAnh: number | null = null;
  ingresosAnm: number | null = null;

  // Soporte
  soporte: File | null = null;
  nombreSoporteGuardado: string | null = null;
  idArchivoSoporte: number | null = null;

  cargando = false;
  guardando = false;
  intentoGuardar = false;
  /** El formulario arranca bloqueado cuando ya hay datos, como en el legado. */
  editando = false;

  readonly acceptSoporte = '.pdf,.xlsx,.xls,.doc,.docx,application/pdf';
  readonly extensionesSoporte = ['pdf', 'xlsx', 'xls', 'doc', 'docx'];
  /** El radicado no puede ser posterior a hoy. */
  readonly hoy = new Date();

  ngOnInit(): void {
    this.cargar();
  }

  // ===================== Carga =====================

  private cargar(): void {
    this.cargando = true;
    this.iacService.getInsumoMhcp(this.idIac).subscribe({
      next: dato => {
        this.cargando = false;
        if (dato) {
          this.aplicar(dato);
          this.editando = false;
        } else {
          this.editando = !this.soloLectura;
        }
      },
      error: () => {
        this.cargando = false;
        this.error('No fue posible consultar la información del MHCP.');
      },
    });
  }

  private aplicar(dato: InsumoMhcp): void {
    this.noRadicado = dato.noRadicado;
    this.fechaRadicado = dato.fechaRadicado ? new Date(dato.fechaRadicado) : null;
    this.ingresosAnh = dato.ingresosAnh;
    this.ingresosAnm = dato.ingresosAnm;
    this.idArchivoSoporte = dato.idArchivoSoporte ?? null;
    this.nombreSoporteGuardado = dato.nombreArchivoSoporte ?? null;
    this.soporte = null;
  }

  // ===================== Total calculado =====================

  get totalIngresos(): number {
    return (this.ingresosAnh ?? 0) + (this.ingresosAnm ?? 0);
  }

  // ===================== Validaciones =====================

  get radicadoValido(): boolean {
    return PATRON_RADICADO_MHCP.test(this.noRadicado.trim());
  }

  get fechaValida(): boolean {
    return this.fechaRadicado instanceof Date && !isNaN(this.fechaRadicado.getTime());
  }

  get ingresosAnhValido(): boolean {
    return this.ingresosAnh !== null && this.ingresosAnh >= 0;
  }

  get ingresosAnmValido(): boolean {
    return this.ingresosAnm !== null && this.ingresosAnm >= 0;
  }

  get soporteValido(): boolean {
    return !!this.soporte || !!this.nombreSoporteGuardado;
  }

  get formularioValido(): boolean {
    return this.radicadoValido && this.fechaValida
      && this.ingresosAnhValido && this.ingresosAnmValido && this.soporteValido;
  }

  // ===================== Soporte =====================

  onSoporteSeleccionado(archivo: File): void {
    this.soporte = archivo;
  }

  onSoporteRechazado(motivo: string): void {
    this.error(motivo);
  }

  quitarSoporteNuevo(): void {
    this.soporte = null;
  }

  // ===================== Edición y guardado =====================

  habilitarEdicion(): void {
    if (this.soloLectura) { return; }
    this.editando = true;
  }

  cancelarEdicion(): void {
    this.intentoGuardar = false;
    this.cargar();
  }

  guardar(): void {
    this.intentoGuardar = true;
    if (!this.formularioValido || this.guardando) { return; }

    this.guardando = true;
    const insumo: InsumoMhcp = {
      noRadicado: this.noRadicado.trim(),
      fechaRadicado: this.fechaRadicado!.toISOString(),
      ingresosAnh: this.ingresosAnh ?? 0,
      ingresosAnm: this.ingresosAnm ?? 0,
      totalIngresos: this.totalIngresos,
      idArchivoSoporte: this.idArchivoSoporte ?? undefined,
      nombreArchivoSoporte: this.nombreSoporteGuardado ?? undefined,
    };

    this.iacService.guardarInsumoMhcp(this.idIac, insumo, this.soporte).subscribe({
      next: respuesta => {
        this.guardando = false;
        if (!respuesta.ok) {
          this.error(respuesta.mensaje);
          return;
        }
        if (respuesta.datos) { this.aplicar(respuesta.datos); }
        this.editando = false;
        this.intentoGuardar = false;
        this.exito(respuesta.mensaje);
        this.cambio.emit();
      },
      error: () => {
        this.guardando = false;
        this.error('No fue posible guardar la información del MHCP.');
      },
    });
  }

  private exito(mensaje: string): void {
    this.mensajes.add({ severity: 'success', summary: 'Operación exitosa', detail: mensaje });
  }

  private error(mensaje: string): void {
    this.mensajes.add({ severity: 'error', summary: 'Operación no realizada', detail: mensaje });
  }
}
