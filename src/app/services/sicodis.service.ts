// ============================================
// ALTERNATIVA 1: Servicio mejorado que maneja redirecciones
// ============================================

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SicodisService {
  
  private baseUrl = '/api'; //'https://sicodis.dnp.gov.co';
  private apiUrl = `${this.baseUrl}/Aspx/SICODISProxy.aspx?metodo=getVigencias`;
  private loginUrl = `${this.baseUrl}/logon.aspx`;

  constructor(private http: HttpClient) { }

  /**
   * MÉTODO 1: Manejo completo del flujo de autenticación
   */
  getVigenciasWithAuth(): Observable<any> {
    return this.authenticateAndGetData();
  }

  private authenticateAndGetData(): Observable<any> {
    // Paso 1: Ir a la página de login para obtener cookies de sesión
    return this.http.get(this.loginUrl, {
      observe: 'response',
      responseType: 'text',
      withCredentials: true
    }).pipe(
      switchMap((loginResponse: HttpResponse<string>) => {
        console.log('Respuesta de login obtenida');
        
        // Paso 2: Intentar acceder a la API con las cookies de sesión
        return this.http.get(this.apiUrl, {
          responseType: 'text',
          withCredentials: true
        });
      }),
      catchError(error => {
        console.error('Error en autenticación:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * MÉTODO 2: Validación de endpoints alternativos
   */
  validateEndpoints(): Observable<any[]> {
    const endpoints = [
      '/Aspx/SICODISProxy.aspx?metodo=getVigencias',
      '/api/vigencias',
      '/services/vigencias',
      '/data/vigencias.json',
      '/Aspx/SICODISProxy.aspx?metodo=test',
      '/Aspx/SICODISProxy.aspx?metodo=getMetodos'
    ];

    const validationPromises = endpoints.map(endpoint => 
      this.http.get(`${this.baseUrl}${endpoint}`, {
        observe: 'response',
        responseType: 'text',
        withCredentials: true
      }).toPromise().catch(err => ({ endpoint, error: err }))
    );

    return new Observable(observer => {
      Promise.all(validationPromises).then(results => {
        observer.next(results);
        observer.complete();
      });
    });
  }

  /**
   * MÉTODO 3: Inspección de la página principal para encontrar endpoints
   */
  discoverApiEndpoints(): void {
    
    /* return this.http.get(this.baseUrl, {
      responseType: 'text',
      withCredentials: true
    }).pipe(
      tap(html => {
        // Buscar patrones de API en el HTML
        const apiPatterns = [
          /SICODISProxy\.aspx\?metodo=\w+/g,
          /\/api\/\w+/g,
          /\/services\/\w+/g,
          /\.aspx\?[\w=&]+/g
        ];

        const foundEndpoints: string[] = [];
        apiPatterns.forEach(pattern => {
          const matches = html.match(pattern);
          if (matches) {
            foundEndpoints.push(...matches);
          }
        });

        console.log('Endpoints encontrados:', [...new Set(foundEndpoints)]);
      })
    ); */
  }
}

// ============================================
// ALTERNATIVA 2: Herramientas de Debug/Testing
// ============================================

export class ApiDebugService {
  
  constructor(private http: HttpClient) {}

  /**
   * Función para probar diferentes configuraciones de headers
   */
  testDifferentConfigurations(): void {
    const configurations = [
      // Config 1: Sin headers especiales
      {
        name: 'Sin headers',
        options: { responseType: 'text' as const }
      },
      // Config 2: Con User-Agent de navegador
      {
        name: 'Con User-Agent',
        options: {
          headers: new HttpHeaders({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }),
          responseType: 'text' as const
        }
      },
      // Config 3: Con headers de referrer
      {
        name: 'Con Referrer',
        options: {
          headers: new HttpHeaders({
            'Referer': 'https://sicodis.dnp.gov.co/',
            'Origin': 'https://sicodis.dnp.gov.co'
          }),
          responseType: 'text' as const
        }
      },
      // Config 4: Simulando petición AJAX
      {
        name: 'Como AJAX',
        options: {
          headers: new HttpHeaders({
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json, text/plain, */*'
          }),
          responseType: 'text' as const
        }
      }
    ];

    configurations.forEach(config => {
      this.http.get('https://sicodis.dnp.gov.co/Aspx/SICODISProxy.aspx?metodo=getVigencias', config.options)
        .subscribe({
          next: (response) => {
            console.log(`✅ ${config.name} - Éxito:`, response.substring(0, 200));
          },
          error: (error) => {
            console.log(`❌ ${config.name} - Error:`, error.status, error.message);
          }
        });
    });
  }

  /**
   * Verificar qué métodos están disponibles
   */
  checkAvailableMethods(): void {
    const methods = [
      'getVigencias',
      'getMunicipios',
      'getDepartamentos',
      'getRecursos',
      'getSectores',
      'test',
      'help',
      'info'
    ];

    methods.forEach(method => {
      this.http.get(`https://sicodis.dnp.gov.co/Aspx/SICODISProxy.aspx?metodo=${method}`, {
        responseType: 'text'
      }).subscribe({
        next: (response) => {
          console.log(`✅ Método '${method}' disponible:`, response.substring(0, 100));
        },
        error: (error) => {
          console.log(`❌ Método '${method}' no disponible:`, error.status);
        }
      });
    });
  }
}

// ============================================
// ALTERNATIVA 3: Proxy personalizado en Node.js
// ============================================

/* 
Para crear un proxy intermedio que maneje la autenticación:

// server.js (Node.js + Express)
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const session = require('express-session');

const app = express();

app.use(session({
  secret: 'sicodis-proxy',
  resave: false,
  saveUninitialized: true
}));

app.use('/api/sicodis', createProxyMiddleware({
  target: 'https://sicodis.dnp.gov.co',
  changeOrigin: true,
  pathRewrite: {
    '^/api/sicodis': '/Aspx/SICODISProxy.aspx'
  },
  onProxyReq: (proxyReq, req, res) => {
    // Manejar cookies de sesión aquí
    console.log('Proxy request:', req.url);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log('Proxy response:', proxyRes.statusCode);
  }
}));

app.listen(3000, () => {
  console.log('Proxy server running on port 3000');
});
*/

// ============================================
// ALTERNATIVA 4: Implementación con fetch nativo
// ============================================
@Injectable({
  providedIn: 'root'  // ← ESTA LÍNEA ES CRÍTICA
})
export class FetchBasedService {
  
  async getVigenciasWithFetch(): Promise<any> {
    try {
      // Primer intento: obtener cookies de sesión
      const loginResponse = await fetch('https://sicodis.dnp.gov.co/logon.aspx', {
        method: 'GET',
        credentials: 'include', // Importante para cookies
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Angular App)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });

      console.log('Login response status:', loginResponse.status);
      
      // Segundo intento: usar las cookies para acceder a la API
      const apiResponse = await fetch('https://sicodis.dnp.gov.co/Aspx/SICODISProxy.aspx?metodo=getVigencias', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Referer': 'https://sicodis.dnp.gov.co/',
          'User-Agent': 'Mozilla/5.0 (compatible; Angular App)',
          'Accept': 'application/json, text/plain, */*'
        }
      });

      const responseText = await apiResponse.text();
      
      try {
        return JSON.parse(responseText);
      } catch {
        return responseText;
      }
      
    } catch (error) {
      console.error('Error with fetch approach:', error);
      throw error;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class ProxyAwareSicodisService {

  constructor(private http: HttpClient) { }

  /**
   * Método que utiliza el proxy de Angular correctamente
   */
  getVigenciasWithProxy(): Observable<any> {
    // Primero ir al login a través del proxy para establecer sesión
    return this.http.get('/api/logon.aspx', {
      observe: 'response',
      responseType: 'text',
      withCredentials: true,
      headers: new HttpHeaders({
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (compatible; Angular App)'
      })
    }).pipe(
      tap(response => {
        console.log('Login response status:', response.status);
        console.log('Login response headers:', response.headers.keys());
        
        // Verificar cookies en la respuesta
        const cookies = response.headers.get('Set-Cookie');
        console.log('Cookies del login:', cookies);
      }),
      switchMap(() => {
        // Ahora hacer la petición a la API
        return this.http.get('/api/Aspx/SICODISProxy.aspx?metodo=getVigencias', {
          responseType: 'text',
          withCredentials: true,
          headers: new HttpHeaders({
            'Accept': 'application/json, text/plain, */*',
            'Referer': '/api/',
            'X-Requested-With': 'XMLHttpRequest'
          })
        });
      }),
      tap(apiResponse => {
        console.log('API Response:', apiResponse);
        try {
          const jsonData = JSON.parse(apiResponse);
          console.log('Parsed JSON:', jsonData);
        } catch (e) {
          console.log('Response is not JSON:', apiResponse.substring(0, 500));
        }
      }),
      catchError(error => {
        console.error('Error en el flujo completo:', error);
        throw error;
      })
    );
  }

  /**
   * Método alternativo usando fetch con el proxy
   */
  async getVigenciasWithFetchProxy(): Promise<any> {
    try {
      console.log('🔄 Iniciando login...');
      
      // Paso 1: Login para establecer sesión
      const loginResponse = await fetch('/api/logon.aspx', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'User-Agent': 'Mozilla/5.0 (compatible; Angular App)'
        }
      });

      console.log('✅ Login status:', loginResponse.status);
      
      // Obtener headers de forma compatible
      const loginHeaders: any = {};
      loginResponse.headers.forEach((value, key) => {
        loginHeaders[key] = value;
      });
      console.log('📝 Login headers:', loginHeaders);

      // Verificar cookies en DevTools
      if (document.cookie) {
        document.cookie.split(';').forEach(cookie => {
          console.log('🍪 Cookie:', cookie.trim());
        });
      } else {
        console.log('⚠️ No hay cookies en document.cookie');
      }

      // Paso 2: API call
      console.log('🔄 Llamando a la API...');
      const apiResponse = await fetch('/api/Aspx/SICODISProxy.aspx?metodo=getVigencias', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Referer': window.location.origin + '/api/',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      console.log('✅ API status:', apiResponse.status);
      
      // Obtener headers de forma compatible
      const apiHeaders: any = {};
      apiResponse.headers.forEach((value, key) => {
        apiHeaders[key] = value;
      });
      console.log('📝 API headers:', apiHeaders);

      const responseText = await apiResponse.text();
      console.log('📄 Response preview:', responseText.substring(0, 300));

      try {
        return JSON.parse(responseText);
      } catch {
        return responseText;
      }

    } catch (error) {
      console.error('❌ Error completo:', error);
      throw error;
    }
  }

  /**
   * Método de diagnóstico para verificar el proxy
   */
  async diagnosticProxy(): Promise<void> {
    console.log('=== DIAGNÓSTICO DEL PROXY ===');
    
    const endpoints = [
      '/api/',
      '/api/logon.aspx',
      '/api/Aspx/SICODISProxy.aspx?metodo=getVigencias'
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`\n🔍 Probando: ${endpoint}`);
        
        const response = await fetch(endpoint, {
          method: 'HEAD', // Solo headers, sin body
          credentials: 'include'
        });

        console.log(`✅ Status: ${response.status}`);
        
        // Obtener headers de forma compatible con todos los navegadores
        const headers: any = {};
        response.headers.forEach((value, key) => {
          headers[key] = value;
        });
        console.log(`📝 Headers:`, headers);
        
      } catch (error) {
        console.log(`❌ Error en ${endpoint}:`, error);
      }
    }
  }
}