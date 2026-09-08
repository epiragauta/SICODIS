import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { ErrorAutenticacion } from '../../auth/auth.models';
import { UserAuthService } from '../../auth/user-auth.service';

/**
 * Ventana de autenticación. Reemplaza a `Autenticacion.aspx` del SICODIS legado.
 *
 * Diferencias deliberadas con el original:
 *  - Solo usuarios DNP: se retira el selector de entidad, cuya opción "Otra"
 *    ya estaba comentada en el WebForms.
 *  - El mensaje de error es genérico. El legado mostraba `ex.Message` de Active
 *    Directory en `lblError`, lo que revelaba detalles de la infraestructura.
 *
 * Cuando ya hay sesión, la pantalla actúa como panel de sesión y permite
 * cerrarla: es el único punto de entrada y salida, porque el menú superior no
 * expone acceso autenticado.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    MessageModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(UserAuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @ViewChild('resumenError') resumenError?: ElementRef<HTMLElement>;

  readonly estaAutenticado = this.auth.estaAutenticado;
  readonly nombre = this.auth.nombre;
  readonly usuario = this.auth.usuario;

  readonly enviando = signal(false);
  readonly error = signal<string | null>(null);

  readonly formulario = this.fb.nonNullable.group({
    usuario: ['', [Validators.required, Validators.maxLength(64)]],
    // 128 es el MaxLength que tenía el campo de contraseña en el WebForms.
    password: ['', [Validators.required, Validators.maxLength(128)]],
  });

  get campoUsuario() {
    return this.formulario.controls.usuario;
  }

  get campoPassword() {
    return this.formulario.controls.password;
  }

  ingresar(): void {
    this.error.set(null);

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.error.set('Diligencie el usuario y la contraseña para continuar.');
      this.enfocarError();
      return;
    }

    const { usuario, password } = this.formulario.getRawValue();
    this.enviando.set(true);

    this.auth.login(usuario, password).subscribe({
      next: () => {
        this.enviando.set(false);
        this.formulario.reset();
        this.router.navigateByUrl(this.destino());
      },
      error: (err: unknown) => {
        this.enviando.set(false);
        this.campoPassword.reset();
        this.error.set(
          err instanceof ErrorAutenticacion
            ? err.message
            : 'No fue posible iniciar sesión. Intente nuevamente.',
        );
        this.enfocarError();
      },
    });
  }

  cerrarSesion(): void {
    this.auth.logout().subscribe(() => this.router.navigateByUrl('/'));
  }

  /** Ruta a la que se vuelve tras autenticarse. Solo se aceptan rutas internas. */
  private destino(): string {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    return returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//')
      ? returnUrl
      : '/';
  }

  /** Lleva el foco al mensaje de error para que un lector de pantalla lo anuncie. */
  private enfocarError(): void {
    setTimeout(() => this.resumenError?.nativeElement.focus());
  }
}
