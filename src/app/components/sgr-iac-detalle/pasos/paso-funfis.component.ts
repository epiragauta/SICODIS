import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ConfirmationService, MessageService } from 'primeng/api';

import { PasoDeterminacionesComponent } from './paso-determinaciones.component';
import { SgrIacService } from '../../../services/sgr-iac.service';
import { DefinicionParticipante, PARTICIPANTES } from '../../../models/sgr-iac.models';

/**
 * Paso 5 · Funcionamiento y Fiscalización.
 *
 * Es el único participante opcional: primero se declara si aplica y solo
 * entonces se habilita el cargue de determinaciones. Declarar "No" desactiva
 * las determinaciones cargadas, igual que `btnEliminarDeterminacionFunFis_Click`
 * en el legado.
 */
@Component({
  selector: 'app-paso-funfis',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, RadioButtonModule, PasoDeterminacionesComponent],
  templateUrl: './paso-funfis.component.html',
  styleUrl: './paso-funfis.component.scss',
})
export class PasoFunfisComponent implements OnInit {

  private iacService = inject(SgrIacService);
  private mensajes = inject(MessageService);
  private confirmacion = inject(ConfirmationService);

  @Input({ required: true }) idIac!: number;
  @Input() soloLectura = false;

  @Output() cambio = new EventEmitter<void>();

  /** `null` mientras no se ha consultado el estado. */
  aplica: boolean | null = null;
  /** Último valor confirmado por el servidor, para no reguardar al reclicar. */
  private aplicaPersistido: boolean | null = null;
  cargando = false;
  guardando = false;
  tieneCargueActivo = false;

  readonly participante: DefinicionParticipante = PARTICIPANTES.find(p => p.codigo === 'FUNFIS')!;

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.cargando = true;
    this.iacService.getEstadoFunFis(this.idIac).subscribe({
      next: estado => {
        this.aplica = estado.aplica;
        this.aplicaPersistido = estado.aplica;
        this.tieneCargueActivo = !!estado.cargueActivo;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.mensajes.add({
          severity: 'error',
          summary: 'Operación no realizada',
          detail: 'No fue posible consultar el estado de Funcionamiento y Fiscalización.',
        });
      },
    });
  }

  /**
   * Cambia la respuesta Sí/No.
   *
   * Pasar a "No" con determinaciones activas es destructivo, así que se confirma.
   */
  onAplicaChange(valor: boolean): void {
    if (this.soloLectura || this.guardando) { return; }
    if (valor === this.aplicaPersistido) { return; }   // reclic sobre la opción vigente

    if (!valor && this.tieneCargueActivo) {
      this.confirmacion.confirm({
        header: 'Eliminar las determinaciones de Funcionamiento y Fiscalización',
        message: 'Declarar que no aplica desactivará las determinaciones cargadas. '
               + 'El histórico de cargues se conserva. ¿Desea continuar?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí, no aplica',
        rejectLabel: 'Cancelar',
        acceptButtonStyleClass: 'p-button-danger',
        accept: () => this.persistir(false),
        reject: () => { this.aplica = this.aplicaPersistido; },
      });
      return;
    }

    this.persistir(valor);
  }

  private persistir(valor: boolean): void {
    this.guardando = true;
    this.iacService.setFunFisAplica(this.idIac, valor).subscribe({
      next: respuesta => {
        this.guardando = false;
        this.mensajes.add({
          severity: respuesta.ok ? 'success' : 'error',
          summary: respuesta.ok ? 'Operación exitosa' : 'Operación no realizada',
          detail: respuesta.mensaje,
        });
        this.cargar();
        this.cambio.emit();
      },
      error: () => {
        this.guardando = false;
        this.mensajes.add({
          severity: 'error',
          summary: 'Operación no realizada',
          detail: 'No fue posible guardar la respuesta de Funcionamiento y Fiscalización.',
        });
      },
    });
  }

  onCambioDeterminaciones(): void {
    this.cargar();
    this.cambio.emit();
  }
}
