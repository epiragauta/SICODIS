import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';

import { NumberFormatPipe } from '../../../utils/numberFormatPipe';
import { SelectorArchivoComponent } from '../../shared/selector-archivo/selector-archivo.component';
import { descargarTexto, dispararDescarga, extraerNombreArchivo } from '../../../utils/descarga-archivo';
import { validarPlantillaDeterminaciones } from '../../../utils/plantilla-excel.validator';
import { SgrIacService } from '../../../services/sgr-iac.service';
import { UserAuthService } from '../../../auth/user-auth.service';
import {
  CargueDeterminaciones,
  DefinicionPlantilla,
  DefinicionParticipante,
  ResumenValidacionDeterminaciones,
} from '../../../models/sgr-iac.models';

/** Estado local del cargue en curso. */
type FaseCargue = 'inactivo' | 'validando' | 'validado' | 'enviando';

/**
 * Paso de cargue de determinaciones, parametrizado por participante.
 *
 * Cubre ANH, ANM, MME y Fun&Fis: en el legado son cuatro bloques con la misma
 * lógica y distintos nombres de control (`BtnGuardarDatosANH/ANM/MME/FunFis`).
 */
@Component({
  selector: 'app-paso-determinaciones',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule, TagModule, TooltipModule, NumberFormatPipe, SelectorArchivoComponent],
  templateUrl: './paso-determinaciones.component.html',
  styleUrl: './paso-determinaciones.component.scss',
})
export class PasoDeterminacionesComponent implements OnInit {

  private iacService = inject(SgrIacService);
  private mensajes = inject(MessageService);
  private confirmacion = inject(ConfirmationService);
  private auth = inject(UserAuthService);

  @Input({ required: true }) idIac!: number;
  @Input({ required: true }) participante!: DefinicionParticipante;
  /** La IAC enviada a validación ya no admite cambios de insumos. */
  @Input() soloLectura = false;

  /** Avisa al contenedor para que recargue el estado de los pasos. */
  @Output() cambio = new EventEmitter<void>();

  definicion: DefinicionPlantilla | null = null;
  cargueActivo: CargueDeterminaciones | null = null;
  historico: CargueDeterminaciones[] = [];
  mostrarHistorico = false;

  fase: FaseCargue = 'inactivo';
  archivoSeleccionado: File | null = null;
  resumen: ResumenValidacionDeterminaciones | null = null;
  logValidacion = '';
  cargandoDatos = false;

  get descargasDisponibles(): boolean {
    return this.iacService.descargasDisponibles;
  }

  ngOnInit(): void {
    this.cargar();
  }

  // ===================== Carga =====================

  cargar(): void {
    this.cargandoDatos = true;
    this.iacService.getDefinicionPlantilla(this.participante.codigo).subscribe({
      next: d => { this.definicion = d; },
      error: () => this.error('No fue posible obtener la definición de la plantilla de cargue.'),
    });

    this.iacService.getCargueActivo(this.idIac, this.participante.codigo).subscribe({
      next: c => {
        this.cargueActivo = c;
        this.cargandoDatos = false;
      },
      error: () => {
        this.cargandoDatos = false;
        this.error('No fue posible consultar el cargue activo.');
      },
    });

    this.cargarHistorico();
  }

  private cargarHistorico(): void {
    this.iacService.getHistorico(this.idIac, this.participante.codigo).subscribe({
      next: h => { this.historico = h; },
      error: () => { this.historico = []; },
    });
  }

  // ===================== Selección y prevalidación =====================

  onArchivoRechazado(motivo: string): void {
    this.error(motivo);
  }

  async onArchivoSeleccionado(archivo: File): Promise<void> {
    if (!this.definicion) {
      this.error('Aún no se ha cargado la definición de la plantilla. Intente de nuevo en unos segundos.');
      return;
    }

    this.archivoSeleccionado = archivo;
    this.resumen = null;
    this.fase = 'validando';

    try {
      const resultado = await validarPlantillaDeterminaciones(archivo, this.definicion);
      this.resumen = resultado.resumen;
      this.logValidacion = resultado.log;
      this.fase = 'validado';

      if (resultado.resumen.validacion === 'Con Errores') {
        this.error('La plantilla tiene hallazgos de validación. Revíselos antes de cargarla.');
      }
    } catch (e) {
      this.fase = 'inactivo';
      this.archivoSeleccionado = null;
      console.error('Error al leer el archivo de determinaciones:', e);
      this.error('No fue posible leer el archivo. Verifique que sea un Excel válido y no esté protegido.');
    }
  }

  descartarSeleccion(): void {
    this.archivoSeleccionado = null;
    this.resumen = null;
    this.logValidacion = '';
    this.fase = 'inactivo';
  }

  // ===================== Envío =====================

  get puedeEnviar(): boolean {
    return !this.soloLectura
      && this.fase === 'validado'
      && this.resumen?.validacion === 'Sin Errores';
  }

  enviarCargue(): void {
    if (!this.puedeEnviar || !this.archivoSeleccionado || !this.resumen) { return; }

    if (this.cargueActivo) {
      const fecha = new Date(this.cargueActivo.fechaCargue).toLocaleDateString('es-CO');
      this.confirmacion.confirm({
        header: 'Reemplazar el cargue activo',
        message: `Ya existe un cargue activo de ${this.participante.sigla} validado el ${fecha}. `
               + '¿Desea reemplazarlo? El anterior quedará inactivo pero se conservará en el histórico.',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Reemplazar',
        rejectLabel: 'Cancelar',
        accept: () => this.persistirCargue(true),
      });
      return;
    }

    this.persistirCargue(true);
  }

  private persistirCargue(activar: boolean): void {
    if (!this.archivoSeleccionado || !this.resumen) { return; }

    this.fase = 'enviando';
    this.iacService.registrarCargueDeterminaciones(
      this.idIac,
      this.participante.codigo,
      this.archivoSeleccionado,
      this.resumen,
      this.logValidacion,
      this.auth.usuario() || 'anonimo',
      activar,
    ).subscribe({
      next: respuesta => {
        if (respuesta.ok) {
          this.exito(respuesta.mensaje);
          this.descartarSeleccion();
          this.cargar();
          this.cambio.emit();
        } else {
          this.fase = 'validado';
          this.error(respuesta.mensaje);
          this.cargarHistorico();
        }
      },
      error: () => {
        this.fase = 'validado';
        this.error('No fue posible registrar el cargue de determinaciones.');
      },
    });
  }

  // ===================== Eliminación =====================

  eliminarCargueActivo(): void {
    if (this.soloLectura || !this.cargueActivo) { return; }

    this.confirmacion.confirm({
      header: 'Eliminar las determinaciones activas',
      message: `Se desactivarán las determinaciones de ${this.participante.sigla} y el paso volverá a quedar pendiente. `
             + 'El histórico de cargues se conserva. ¿Desea continuar?',
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.iacService.eliminarDeterminaciones(this.idIac, this.participante.codigo).subscribe({
          next: respuesta => {
            respuesta.ok ? this.exito(respuesta.mensaje) : this.error(respuesta.mensaje);
            this.cargar();
            this.cambio.emit();
          },
          error: () => this.error('No fue posible eliminar las determinaciones.'),
        });
      },
    });
  }

  // ===================== Descargas =====================

  descargarLogPrevalidacion(): void {
    if (!this.logValidacion) { return; }
    descargarTexto(this.logValidacion, `Log_Prevalidacion_${this.participante.codigo}_IAC_${this.idIac}.txt`);
  }

  descargarLogCargue(cargue: CargueDeterminaciones): void {
    this.iacService.getLogValidacion(cargue.idArchivo).subscribe({
      next: log => descargarTexto(log, `Log_Validacion_${cargue.idArchivo}_IAC_${this.idIac}.txt`),
      error: () => this.error('No fue posible obtener el log de validación.'),
    });
  }

  /** Plantilla oficial del participante; requiere backend. */
  descargarPlantillaOficial(): void {
    if (!this.descargasDisponibles) { return; }
    this.iacService.descargarPlantilla(this.participante.codigo).subscribe({
      next: respuesta => this.guardarBlob(respuesta, `Plantilla_${this.participante.codigo}.xlsx`),
      error: () => this.error('No fue posible descargar la plantilla oficial.'),
    });
  }

  /** Excel efectivamente cargado; requiere backend. */
  descargarArchivoCargue(cargue: CargueDeterminaciones): void {
    if (!this.descargasDisponibles) { return; }
    this.iacService.descargarArchivo(cargue.idArchivo).subscribe({
      next: respuesta => this.guardarBlob(respuesta, cargue.nombreArchivo),
      error: () => this.error('No fue posible descargar el archivo.'),
    });
  }

  private guardarBlob(respuesta: HttpResponse<Blob>, nombrePorDefecto: string): void {
    if (!respuesta.body) {
      this.error('El servidor no devolvió contenido para el archivo solicitado.');
      return;
    }
    const nombre = extraerNombreArchivo(respuesta.headers.get('Content-Disposition')) ?? nombrePorDefecto;
    dispararDescarga(respuesta.body, nombre);
  }

  // ===================== Presentación =====================

  severidadValidacion(validacion: 'Sin Errores' | 'Con Errores'): 'success' | 'danger' {
    return validacion === 'Sin Errores' ? 'success' : 'danger';
  }

  /** Muestra los primeros hallazgos; el log completo queda como descarga. */
  get erroresVisibles(): string[] {
    return (this.resumen?.errores ?? []).slice(0, 20);
  }

  get erroresRestantes(): number {
    return Math.max(0, (this.resumen?.errores.length ?? 0) - 20);
  }

  alternarHistorico(): void {
    this.mostrarHistorico = !this.mostrarHistorico;
  }

  private exito(mensaje: string): void {
    this.mensajes.add({ severity: 'success', summary: 'Operación exitosa', detail: mensaje });
  }

  private error(mensaje: string): void {
    this.mensajes.add({ severity: 'error', summary: 'Operación no realizada', detail: mensaje });
  }
}
