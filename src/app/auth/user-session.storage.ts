import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SesionUsuario } from './auth.models';

const CLAVE_SESION = 'sicodis_sesion_usuario';

/**
 * Persistencia de la sesión de usuario.
 *
 * Se usa `sessionStorage` —no `localStorage`— para que la sesión muera con la
 * pestaña, más cerca del comportamiento del ticket de 20 minutos del legado.
 *
 * Todo acceso está protegido para SSR: en el servidor no existe
 * `sessionStorage`, y en el navegador puede lanzar (modo privado, cookies
 * bloqueadas), así que las operaciones nunca propagan excepciones.
 */
@Injectable({ providedIn: 'root' })
export class UserSessionStorage {
  private esNavegador = isPlatformBrowser(inject(PLATFORM_ID));

  leer(): SesionUsuario | null {
    if (!this.esNavegador) return null;

    try {
      const crudo = sessionStorage.getItem(CLAVE_SESION);
      if (!crudo) return null;

      const sesion = JSON.parse(crudo) as SesionUsuario;
      if (!sesion?.token || !sesion?.usuario || typeof sesion.expiraEn !== 'number') {
        this.limpiar();
        return null;
      }
      return sesion;
    } catch {
      this.limpiar();
      return null;
    }
  }

  guardar(sesion: SesionUsuario): void {
    if (!this.esNavegador) return;
    try {
      sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    } catch {
      // Sin almacenamiento la sesión vive solo en memoria; no es un error fatal.
    }
  }

  limpiar(): void {
    if (!this.esNavegador) return;
    try {
      sessionStorage.removeItem(CLAVE_SESION);
    } catch {
      /* nada que hacer */
    }
  }
}
