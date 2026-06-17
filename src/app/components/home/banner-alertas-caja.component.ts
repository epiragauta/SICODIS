import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente para mostrar el banner de Alertas de Caja del SGR
 * Este banner muestra una infografía con información sobre:
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
export class BannerAlertasCajaComponent {

  /**
   * Abre el enlace a más información sobre Alertas de Caja
   */
  verMasInformacion(): void {
    // Aquí puedes agregar la URL específica cuando esté disponible
    window.open('https://sicodis.dnp.gov.co/Alertas/AlertasCaja', '_blank');
  }

  /**
   * Método para cerrar el banner (llamado desde el componente padre)
   */
  cerrar(): void {
    // Este método será manejado por el componente padre (home.component)
  }
}
