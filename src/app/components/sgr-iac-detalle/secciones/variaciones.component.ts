import { Component, Input, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { MessageService } from 'primeng/api';

import { NumberFormatPipe } from '../../../utils/numberFormatPipe';
import { descargarVariacionesExcel } from '../../../utils/variaciones-excel';
import { SgrIacService } from '../../../services/sgr-iac.service';
import {
  PresenciaEntidad,
  ReporteVariaciones,
  VariacionEntidad,
  VariacionValor,
} from '../../../models/sgr-iac.models';

type FiltroSentido = 'todas' | 'suben' | 'bajan' | 'nuevas' | 'retiradas';

/**
 * Reporte de variaciones de la IAC frente al periodo anterior del mismo tipo.
 *
 * Responde a la pregunta que hace una entidad territorial cuando recibe su
 * abono: por qué es distinto del periodo pasado.
 */
@Component({
  selector: 'app-iac-variaciones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    TagModule,
    TooltipModule,
    InputTextModule,
    Select,
    NumberFormatPipe,
  ],
  templateUrl: './variaciones.component.html',
  styleUrl: './variaciones.component.scss',
})
export class VariacionesComponent implements OnChanges {

  private iacService = inject(SgrIacService);
  private mensajes = inject(MessageService);

  @Input({ required: true }) idIac!: number;
  /** Fecha del cálculo: al recalcular, el reporte debe volver a pedirse. */
  @Input() fechaCalculo: string | null = null;

  reporte = signal<ReporteVariaciones | null>(null);
  cargando = signal(false);
  exportando = signal(false);

  filtroTexto = '';
  filtroSentido: { id: FiltroSentido; label: string } = { id: 'todas', label: 'Todas' };

  readonly sentidos: Array<{ id: FiltroSentido; label: string }> = [
    { id: 'todas', label: 'Todas' },
    { id: 'suben', label: 'Con aumento' },
    { id: 'bajan', label: 'Con disminución' },
    { id: 'nuevas', label: 'Nuevas' },
    { id: 'retiradas', label: 'Retiradas' },
  ];

  ngOnChanges(cambios: SimpleChanges): void {
    if (cambios['idIac'] || cambios['fechaCalculo']) {
      this.cargar();
    }
  }

  cargar(): void {
    if (!this.idIac) { return; }
    this.cargando.set(true);
    this.iacService.getReporteVariaciones(this.idIac).subscribe({
      next: reporte => {
        this.reporte.set(reporte);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.reporte.set(null);
        this.mensajes.add({
          severity: 'error',
          summary: 'Operación no realizada',
          detail: 'No fue posible generar el reporte de variaciones.',
        });
      },
    });
  }

  // ===================== Filtrado =====================

  get entidades(): VariacionEntidad[] {
    const r = this.reporte();
    if (!r) { return []; }

    const texto = this.filtroTexto.trim().toLowerCase();
    const sentido = this.filtroSentido?.id ?? 'todas';

    return r.porEntidad.filter(e => {
      if (texto && !e.entidad.toLowerCase().includes(texto) && !e.codigoDane.includes(texto)) {
        return false;
      }
      switch (sentido) {
        case 'suben': return e.total.variacionPesos > 0;
        case 'bajan': return e.total.variacionPesos < 0;
        case 'nuevas': return e.presencia === 'nueva';
        case 'retiradas': return e.presencia === 'retirada';
        default: return true;
      }
    });
  }

  get hayFiltros(): boolean {
    return this.filtroTexto.trim().length > 0 || (this.filtroSentido?.id ?? 'todas') !== 'todas';
  }

  limpiarFiltros(): void {
    this.filtroTexto = '';
    this.filtroSentido = this.sentidos[0];
  }

  // ===================== Presentación =====================

  /** `null` cuando no hay base anterior: se muestra un guion, no un número. */
  porcentajeTexto(valor: VariacionValor): string {
    if (valor.variacionPorcentaje === null) { return '—'; }
    const pct = valor.variacionPorcentaje * 100;
    const signo = pct > 0 ? '+' : '';
    return `${signo}${pct.toFixed(2).replace('.', ',')} %`;
  }

  claseVariacion(valor: VariacionValor): string {
    if (valor.variacionPesos > 0) { return 'sube'; }
    if (valor.variacionPesos < 0) { return 'baja'; }
    return 'igual';
  }

  iconoVariacion(valor: VariacionValor): string {
    if (valor.variacionPesos > 0) { return 'pi pi-arrow-up-right'; }
    if (valor.variacionPesos < 0) { return 'pi pi-arrow-down-right'; }
    return 'pi pi-minus';
  }

  etiquetaPresencia(presencia: PresenciaEntidad): string {
    switch (presencia) {
      case 'nueva': return 'Nueva';
      case 'retirada': return 'Retirada';
      default: return '';
    }
  }

  severidadPresencia(presencia: PresenciaEntidad): 'info' | 'warn' {
    return presencia === 'nueva' ? 'info' : 'warn';
  }

  get sinReferencia(): boolean {
    const r = this.reporte();
    return !!r && r.idIacAnterior === null;
  }

  // ===================== Exportación =====================

  async exportar(): Promise<void> {
    const r = this.reporte();
    if (!r || this.exportando()) { return; }

    this.exportando.set(true);
    try {
      await descargarVariacionesExcel(r);
      this.mensajes.add({
        severity: 'success',
        summary: 'Operación exitosa',
        detail: 'El reporte de variaciones se descargó en formato Excel.',
      });
    } catch (e) {
      console.error('Error al exportar variaciones:', e);
      this.mensajes.add({
        severity: 'error',
        summary: 'Operación no realizada',
        detail: 'No fue posible generar el archivo de Excel.',
      });
    } finally {
      this.exportando.set(false);
    }
  }
}
