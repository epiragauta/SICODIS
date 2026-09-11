import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

/** Contador de instancias, para que cada input oculto tenga un `id` único. */
let secuencia = 0;

/**
 * Botón de selección de archivo con `<input type="file">` oculto.
 *
 * Concentra el patrón que repetían las pantallas de administración del SGR:
 * disparar el diálogo nativo desde un botón, validar extensión y tamaño, y
 * limpiar el `value` del input para poder volver a elegir el mismo archivo.
 *
 * Emite el archivo ya validado (`archivoSeleccionado`) o el motivo del rechazo
 * (`archivoRechazado`), y deja al componente contenedor decidir qué hacer con él.
 */
@Component({
  selector: 'app-selector-archivo',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule],
  templateUrl: './selector-archivo.component.html',
  styleUrl: './selector-archivo.component.scss',
})
export class SelectorArchivoComponent {

  /** Rótulo del botón. */
  @Input() label = 'Seleccionar archivo…';
  @Input() icon = 'pi pi-upload';
  @Input() styleClass = 'p-button-primary p-button-sm';
  @Input() disabled = false;
  @Input() tooltip = '';

  /** Valor del atributo `accept` del input nativo. */
  @Input() accept = '.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel';

  /**
   * Extensiones admitidas, sin punto y en minúscula. El `accept` es solo una
   * sugerencia al diálogo del sistema: el usuario puede saltárselo, así que la
   * comprobación real se hace aquí.
   */
  @Input() extensiones: string[] = ['xlsx', 'xls'];

  /** Tamaño máximo en megabytes. `0` desactiva la comprobación. */
  @Input() maxMb = 0;

  /** Descripción accesible del control; cae al `label` si no se indica. */
  @Input() ariaLabel = '';

  @Output() archivoSeleccionado = new EventEmitter<File>();
  @Output() archivoRechazado = new EventEmitter<string>();

  readonly idInput = `selector-archivo-${++secuencia}`;

  get etiquetaAccesible(): string {
    return this.ariaLabel || this.label;
  }

  abrir(): void {
    if (this.disabled) { return; }
    document.getElementById(this.idInput)?.click();
  }

  onCambio(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const archivo = input.files?.[0] ?? null;
    input.value = '';   // permite volver a elegir el mismo archivo
    if (!archivo) { return; }

    const motivo = this.validar(archivo);
    if (motivo) {
      this.archivoRechazado.emit(motivo);
      return;
    }
    this.archivoSeleccionado.emit(archivo);
  }

  /** Devuelve el motivo del rechazo, o `null` si el archivo es admisible. */
  private validar(archivo: File): string | null {
    if (this.extensiones.length) {
      const nombre = archivo.name.toLowerCase();
      const admitida = this.extensiones.some(ext => nombre.endsWith(`.${ext.toLowerCase()}`));
      if (!admitida) {
        const lista = this.extensiones.map(e => `.${e}`).join(', ');
        return `Formato no válido. Use un archivo con extensión ${lista}.`;
      }
    }

    if (this.maxMb > 0 && archivo.size > this.maxMb * 1024 * 1024) {
      return `El archivo supera el tamaño máximo permitido (${this.maxMb} MB).`;
    }

    return null;
  }
}
