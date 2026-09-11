import { Component, Input, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';

/**
 * Sistemas soportados por la infografía de bienvenida.
 * Cada uno se asocia a un PDF en `src/assets/infografias/`.
 */
export type SistemaInfografia = 'sgr' | 'sgp' | 'funcionamiento';

interface EstadoInfografia {
  /** Fecha (YYYY-MM-DD) de la primera visualización. */
  first: string;
  /** Fecha (YYYY-MM-DD) del día que corresponde al contador actual. */
  day: string;
  /** Veces mostrada en el día `day`. */
  count: number;
}

/**
 * Popup que muestra la infografía (PDF) de bienvenida en las páginas de inicio
 * de SGR, SGP y Funcionamiento.
 *
 * Regla de despliegue gestionada por cookie:
 * se muestra hasta 5 veces por día (una por cada refresco/carga) durante los
 * primeros 3 días contados desde la primera visualización. Pasados esos 3 días
 * —o alcanzadas las 5 apariciones del día— deja de mostrarse.
 */
@Component({
  selector: 'app-infografia-popup',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  providers: [CookieService],
  templateUrl: './infografia-popup.component.html',
  styleUrls: ['./infografia-popup.component.scss']
})
export class InfografiaPopupComponent implements OnInit {
  /** Sistema cuya infografía se debe mostrar. */
  @Input() sistema!: SistemaInfografia;

  /** Máximo de apariciones por día. */
  private readonly maxPorDia = 5;
  /** Ventana de días desde la primera visualización (incluyente). */
  private readonly diasVentana = 3;

  displayPopup = false;
  pdfUrl: SafeResourceUrl | null = null;
  titulo = '';

  private readonly meta: Record<SistemaInfografia, { archivo: string; titulo: string }> = {
    sgr: { archivo: 'INFOGRAFIA_SGR.pdf', titulo: 'Sistema General de Regalías (SGR)' },
    sgp: { archivo: 'INFOGRAFIA_SGP.pdf', titulo: 'Sistema General de Participaciones (SGP)' },
    funcionamiento: { archivo: 'INFOGRAFIA_FUNCIONAMIENTO.pdf', titulo: 'Funcionamiento del SGR' }
  };

  constructor(
    private cookieService: CookieService,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId) || !this.sistema) {
      return;
    }

    const info = this.meta[this.sistema];
    if (!info) {
      return;
    }

    if (!this.debeMostrar()) {
      return;
    }

    this.titulo = info.titulo;
    // #toolbar=1 conserva la barra del visor de PDF (descargar/imprimir).
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `assets/infografias/${info.archivo}#view=FitH`
    );

    // Pequeño retraso para no competir con la carga inicial de la vista.
    setTimeout(() => {
      this.displayPopup = true;
    }, 750);
  }

  /**
   * Evalúa la regla de la cookie y, si corresponde mostrar la infografía,
   * actualiza el contador. Devuelve `true` si se debe mostrar.
   */
  private debeMostrar(): boolean {
    const nombre = this.nombreCookie();
    const hoy = this.fechaISO(new Date());

    let estado = this.leerEstado(nombre);
    if (!estado) {
      estado = { first: hoy, day: hoy, count: 0 };
    }

    // Fuera de la ventana de los primeros 3 días: no mostrar.
    if (this.diasEntre(estado.first, hoy) >= this.diasVentana) {
      return false;
    }

    // Nuevo día dentro de la ventana: reinicia el contador diario.
    if (estado.day !== hoy) {
      estado.day = hoy;
      estado.count = 0;
    }

    // Alcanzado el tope del día: persiste el posible cambio de día y no muestra.
    if (estado.count >= this.maxPorDia) {
      this.guardarEstado(nombre, estado);
      return false;
    }

    estado.count++;
    this.guardarEstado(nombre, estado);
    return true;
  }

  private nombreCookie(): string {
    return `infografia_${this.sistema}`;
  }

  private leerEstado(nombre: string): EstadoInfografia | null {
    const raw = this.cookieService.get(nombre);
    if (!raw) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw) as Partial<EstadoInfografia>;
      if (parsed && parsed.first && parsed.day && typeof parsed.count === 'number') {
        return parsed as EstadoInfografia;
      }
      return null;
    } catch {
      return null;
    }
  }

  private guardarEstado(nombre: string, estado: EstadoInfografia): void {
    // La cookie debe sobrevivir toda la ventana; se le da margen extra.
    this.cookieService.set(nombre, JSON.stringify(estado), this.diasVentana + 4, '/');
  }

  /** Fecha en formato YYYY-MM-DD según la zona horaria local. */
  private fechaISO(fecha: Date): string {
    const y = fecha.getFullYear();
    const m = `${fecha.getMonth() + 1}`.padStart(2, '0');
    const d = `${fecha.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  /** Diferencia en días completos entre dos fechas YYYY-MM-DD (b - a). */
  private diasEntre(aIso: string, bIso: string): number {
    const a = new Date(`${aIso}T00:00:00`);
    const b = new Date(`${bIso}T00:00:00`);
    const ms = b.getTime() - a.getTime();
    return Math.floor(ms / (1000 * 60 * 60 * 24));
  }

  cerrar(): void {
    this.displayPopup = false;
  }
}
