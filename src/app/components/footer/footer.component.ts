import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserAuthService } from '../../auth/user-auth.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  private auth = inject(UserAuthService);

  /** Alterna el ícono y el texto del acceso autenticado en la sección Contacto. */
  readonly estaAutenticado = this.auth.estaAutenticado;
  readonly nombre = this.auth.nombre;
}
