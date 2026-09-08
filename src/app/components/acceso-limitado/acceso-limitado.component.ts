import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserAuthService } from '../../auth/user-auth.service';

/**
 * Equivalente a `AccesoLimitado.aspx`: el usuario tiene sesión válida pero su
 * perfil no incluye la pantalla solicitada (`Consulta_AccesoPaginas` → NOK).
 */
@Component({
  selector: 'app-acceso-limitado',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './acceso-limitado.component.html',
  styleUrl: './acceso-limitado.component.scss',
})
export class AccesoLimitadoComponent {
  private auth = inject(UserAuthService);
  readonly nombre = this.auth.nombre;
}
