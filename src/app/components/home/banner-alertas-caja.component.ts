import { Component, OnInit, signal, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { SicodisApiService, AlertasCajaResponse, AlertasCajaMonto, AlertasCajaEntidad } from '../../services/sicodis-api.service';

/**
 * Componente para mostrar el banner de Alertas de Caja del SGR
 * Este banner muestra una infografía con información dinámica sobre:
 * - Situación de caja frente a aprobaciones de proyectos
 * - Panorama general del recaudo
 * - Estado de asignaciones directas y anticipadas
 * - Acciones recomendadas para las entidades territoriales
 */
@Component({
  selector: 'app-banner-alertas-caja',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner-alertas-caja.html',
  styleUrls: ['./banner-alertas-caja.scss']
})
export class BannerAlertasCajaComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  // Signals para los datos dinámicos
  isLoading = signal<boolean>(true);
  hasError = signal<boolean>(false);
  periodo = signal<string>('');

  // Datos de montos
  recaudoTotal = signal<string>('$0');
  aprobacionesTotal = signal<string>('$0');
  diferenciaRecaudo = signal<string>('$0');

  // Datos de Asignaciones Directas (ADIR)
  adirTotal = signal<number>(0);
  adirSinCaja = signal<number>(0);
  adirConCajaParcial = signal<number>(0);
  adirConCajaCompleta = signal<number>(0);

  // Datos de AD Anticipadas (ADAN)
  adanTotal = signal<number>(0);
  adanSinCaja = signal<number>(0);
  adanConCajaParcial = signal<number>(0);
  adanConCajaCompleta = signal<number>(0);

  constructor(private sicodisApiService: SicodisApiService) {}

  ngOnInit(): void {
    this.loadAlertasCajaData();
  }

  /**
   * Carga los datos del servicio de alertas de caja
   */
  private loadAlertasCajaData(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.sicodisApiService.getSgrInsumosBoletinAlertas().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data: AlertasCajaResponse) => {
        this.processData(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar datos de alertas de caja:', error);
        this.hasError.set(true);
        this.isLoading.set(false);
        // Mantener valores por defecto en caso de error
      }
    });
  }

  /**
   * Procesa los datos recibidos del servicio
   */
  private processData(data: AlertasCajaResponse): void {
    // Procesar montos
    if (data.montos && data.montos.length > 0) {
      const monto = data.montos[0];
      this.periodo.set(monto.periodo_corto);
      this.recaudoTotal.set(this.formatearBillones(monto.recaudo));
      this.aprobacionesTotal.set(this.formatearBillones(monto.aprobaciones));
      this.diferenciaRecaudo.set(this.formatearBillones(monto.recaudo_supera_aprobaciones));
    }

    // Procesar entidades
    if (data.entidades && data.entidades.length > 0) {
      // Buscar ADIR (Asignaciones Directas)
      const adir = data.entidades.find(e => e.codigo_spgr === 'ADIR');
      if (adir) {
        this.adirTotal.set(adir.entidades_total);
        this.adirSinCaja.set(adir.entidades_no_caja);
        this.adirConCajaParcial.set(adir.entidades_caja_compromisos_no_total);
        this.adirConCajaCompleta.set(adir.entidades_caja);
      }

      // Buscar ADAN (AD Anticipadas)
      const adan = data.entidades.find(e => e.codigo_spgr === 'ADAN');
      if (adan) {
        this.adanTotal.set(adan.entidades_total);
        this.adanSinCaja.set(adan.entidades_no_caja);
        this.adanConCajaParcial.set(adan.entidades_caja_compromisos_no_total);
        this.adanConCajaCompleta.set(adan.entidades_caja);
      }
    }
  }

  /**
   * Formatea un número grande a billones con un decimal
   * @param valor - Valor numérico a formatear
   * @returns String formateado (ej: "$11.3 Billones")
   */
  private formatearBillones(valor: number): string {
    const billones = valor / 1_000_000_000_000;

    if (billones >= 1) {
      return `$${billones.toFixed(1)} Billones`;
    } else {
      // Si es menor a un billón, mostrar en millones
      const millones = valor / 1_000_000_000;
      return `$${millones.toFixed(0)} Mil Millones`;
    }
  }

  /**
   * Abre el enlace a más información sobre Alertas de Caja
   * Redirige a la página oficial del DNP sobre el Sistema General de Regalías - Alertas de Caja
   */
  verMasInformacion(): void {
    window.open('https://www.dnp.gov.co/LaEntidad_/subdireccion-general-inversiones-seguimiento-evaluacion/direccion-programacion-inversiones-publicas/Paginas/sistema-general-de-regalias.aspx#veinticincoseiscaja', '_blank');
  }

  /**
   * Método para cerrar el banner (llamado desde el componente padre)
   */
  cerrar(): void {
    // Este método será manejado por el componente padre (home.component)
  }
}
