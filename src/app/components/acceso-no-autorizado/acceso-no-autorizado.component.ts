import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Equivalente a `AccesoNoAutorizado.html`: la verificación de acceso devolvió
 * `UNOK` (usuario sin autorización sobre la pantalla solicitada).
 */
@Component({
  selector: 'app-acceso-no-autorizado',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './acceso-no-autorizado.component.html',
  styleUrl: './acceso-no-autorizado.component.scss',
})
export class AccesoNoAutorizadoComponent {}
