// auth.service.ts - VERSIÓN ACTUALIZADA
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';

// Interface para la respuesta del login
interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  
  private tokenKey = 'sicodis_token';
  private tokenExpiryKey = 'sicodis_token_expiry';
  
  // Credenciales públicas
  private readonly AUTH_URL = 'https://sicodis.dnp.gov.co/apiws/auth/login';
  private readonly PUBLIC_USER = 'app.public.read';
  private readonly PUBLIC_PASSWORD = 'T9@kL2#vQ7!mX4$Zp8R%uC3';
  
  private autoRenewTimer: any;

  constructor() {
    // Verificar y renovar token al iniciar
    this.checkAndRenewToken();
  }

  /**
   * 🔐 LOGIN AUTOMÁTICO - Llama al API de SICODIS
   */
  autoLogin(): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.AUTH_URL, {
      usuario: this.PUBLIC_USER,
      password: this.PUBLIC_PASSWORD
    }).pipe(
      tap(response => {
        // Guardar token y expiración
        this.setToken(response.access_token);
        this.setTokenExpiry(response.expires_in);
        
        // Programar renovación automática
        this.scheduleTokenRenewal(response.expires_in);
        
      }),
      catchError(error => {
        console.error('❌ Error al obtener token:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Guarda el token en localStorage
   */
  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Obtiene el token de localStorage
   */
  getToken(): string | null {
    if (this.hasValidToken()) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  /**
   * Limpia el token
   */
  clearToken() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.tokenExpiryKey);
    
    if (this.autoRenewTimer) {
      clearTimeout(this.autoRenewTimer);
    }
  }

  /**
   * 🆕 Guarda la fecha de expiración del token
   */
  private setTokenExpiry(expiresIn: number) {
    const expiryTime = new Date().getTime() + (expiresIn * 1000);
    localStorage.setItem(this.tokenExpiryKey, expiryTime.toString());
  }

  /**
   * 🆕 Verifica si el token es válido
   */
  hasValidToken(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    const expiry = localStorage.getItem(this.tokenExpiryKey);

    if (!token || !expiry) {
      return false;
    }

    const now = new Date().getTime();
    return now < parseInt(expiry);
  }

  /**
   * 🆕 Verifica y renueva el token si es necesario
   */
  private checkAndRenewToken(): void {
    if (!this.hasValidToken()) {
      this.autoLogin().subscribe({
        error: (err) => console.error('❌ Error al renovar token:', err)
      });
    }
  }

  /**
   * 🆕 Programa la renovación automática del token
   * Se ejecuta 2 minutos antes de expirar (28 minutos)
   */
  private scheduleTokenRenewal(expiresIn: number): void {
    // Limpiar timer anterior
    if (this.autoRenewTimer) {
      clearTimeout(this.autoRenewTimer);
    }

    // Renovar 2 minutos antes de expirar
    const renewalTime = Math.max((expiresIn - 120), 60) * 1000;
    

    this.autoRenewTimer = setTimeout(() => {
      this.autoLogin().subscribe({
        error: (err) => console.error('❌ Error al renovar token:', err)
      });
    }, renewalTime);
  }

  /**
   * 🆕 Obtiene el tiempo restante del token en segundos
   */
  getTokenRemainingTime(): number {
    const expiry = localStorage.getItem(this.tokenExpiryKey);
    if (!expiry) return 0;

    const now = new Date().getTime();
    const expiryTime = parseInt(expiry);
    const remaining = Math.floor((expiryTime - now) / 1000);

    return remaining > 0 ? remaining : 0;
  }

  /**
   * 🆕 Fuerza la renovación del token (opcional)
   */
  forceRenewToken(): Observable<LoginResponse> {
    return this.autoLogin();
  }
}
