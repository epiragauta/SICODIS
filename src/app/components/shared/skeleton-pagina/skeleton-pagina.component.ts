import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

/**
 * Placeholder de carga tipo "skeleton" que imita la estructura típica de las
 * páginas de reportes: fila de tarjetas KPI, un bloque de gráfico y filas de
 * tabla. Se usa dentro de los .loading-overlay en lugar del spinner para
 * reducir el salto de layout percibido mientras llegan los datos del API.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-skeleton-pagina',
  standalone: true,
  imports: [CommonModule, SkeletonModule],
  template: `
    <div class="skeleton-pagina" role="status" aria-live="polite" aria-label="Cargando contenido">
      <div class="skeleton-tarjetas" *ngIf="tarjetas > 0">
        <div class="skeleton-tarjeta" *ngFor="let t of tarjetasArr">
          <p-skeleton width="60%" height="1rem" />
          <p-skeleton width="80%" height="2rem" />
          <p-skeleton width="45%" height="0.75rem" />
        </div>
      </div>
      <p-skeleton *ngIf="grafico" width="100%" [height]="alturaGrafico" borderRadius="8px" />
      <div class="skeleton-filas" *ngIf="filas > 0">
        <p-skeleton *ngFor="let f of filasArr" width="100%" height="2.2rem" borderRadius="6px" />
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    .skeleton-pagina {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      width: 100%;
      padding: 1rem;
    }
    .skeleton-tarjetas {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .skeleton-tarjeta {
      flex: 1 1 200px;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      padding: 1rem;
      border: 1px solid var(--surface-border, #e2e8f0);
      border-radius: 8px;
      background: var(--surface-card, #fff);
    }
    .skeleton-filas {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  `]
})
export class SkeletonPaginaComponent {
  /** Número de tarjetas KPI en la fila superior (0 para omitir). */
  @Input() tarjetas = 3;
  /** Muestra el bloque rectangular que representa un gráfico. */
  @Input() grafico = true;
  /** Altura del bloque de gráfico. */
  @Input() alturaGrafico = '260px';
  /** Número de filas de tabla (0 para omitir). */
  @Input() filas = 5;

  get tarjetasArr(): unknown[] { return Array(this.tarjetas); }
  get filasArr(): unknown[] { return Array(this.filas); }
}
