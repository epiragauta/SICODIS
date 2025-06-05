import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SicodisFinalService {

  private sessionCookie: string = '';

  constructor(private http: HttpClient) { }

  /**
   * SOLUCIÓN FINAL: Manejo manual de cookies como Postman
   */
  async getVigenciasComplete(): Promise<any> {
    try {
      console.log('🚀 Iniciando flujo completo con manejo manual de cookies...');

      // Paso 1: Primera petición para generar la cookie
      console.log('📞 Primera petición - Generando cookie...');
      
      const firstResponse = await fetch('/api/Aspx/SICODISProxy.aspx?metodo=getVigencias', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept-Language': 'es-CO,es;q=0.9,en;q=0.8',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      console.log('✅ Primera respuesta status:', firstResponse.status);
      let firstReponseText = await firstResponse.text();
      console.log('📄 Primera respuesta preview:', firstReponseText.substring(0, 300));
      
      // Verificar que se estableció la cookie
      const currentCookies = document.cookie;
      console.log('🍪 Cookies después de primera petición:', currentCookies);

      if (!currentCookies.includes('adAuthCookie')) {
        throw new Error('No se estableció la cookie adAuthCookie en la primera petición');
      }

      // Extraer la cookie específica
      const authCookieMatch = currentCookies.match(/adAuthCookie=([^;]+)/);
      if (authCookieMatch) {
        this.sessionCookie = authCookieMatch[1];
        console.log('🎯 Cookie extraída:', this.sessionCookie.substring(0, 50) + '...');
      }

      // Paso 2: Esperar un momento (como haría Postman)
      console.log('⏳ Esperando 2 segundos...');
      await this.sleep(2000);

      // Paso 3: Segunda petición con la cookie establecida
      console.log('📞 Segunda petición - Obteniendo datos JSON...');
      
      const secondResponse = await fetch('/api/Aspx/SICODISProxy.aspx?metodo=getVigencias', {
        method: 'GET',
        credentials: 'include', // Importante: incluir cookies
        headers: {
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'X-Requested-With': 'XMLHttpRequest',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Referer': window.location.origin + '/api/',
          'Accept-Language': 'es-CO,es;q=0.9,en;q=0.8',
          'Cache-Control': 'no-cache'
        }
      });

      console.log('✅ Segunda respuesta status:', secondResponse.status);
      console.log('📄 Content-Type:', secondResponse.headers.get('content-type'));

      const responseText = await secondResponse.text();
      console.log('📄 Respuesta preview:', responseText.substring(0, 300));

      // Verificar si es JSON
      if (this.isValidJson(responseText)) {
        const jsonData = JSON.parse(responseText);
        console.log('✅ ¡JSON obtenido exitosamente!', jsonData);
        return jsonData;
      } else {
        console.log('⚠️ Segunda petición tampoco devolvió JSON');
        console.log('🔍 Analizando respuesta...', responseText.substring(0, 1000));
        
        // Si aún no es JSON, podría necesitar más tiempo o diferentes headers
        return this.tryAlternativeApproach(responseText);
      }

    } catch (error) {
      console.error('❌ Error en flujo completo:', error);
      throw error;
    }
  }

  /**
   * Método alternativo si el anterior no funciona
   */
  async tryAlternativeApproach(previousResponse: string): Promise<any> {
    console.log('🔄 Intentando enfoque alternativo...');

    // Intentar con diferentes timing y headers
    const attempts = [
      {
        name: 'Con delay mayor',
        delay: 5000,
        headers: {
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'X-Requested-With': 'XMLHttpRequest'
        }
      },
      {
        name: 'Como llamada AJAX típica',
        delay: 1000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      },
      {
        name: 'Con headers mínimos',
        delay: 500,
        headers: {
          'Accept': '*/*',
          'X-Requested-With': 'XMLHttpRequest'
        }
      }
    ];

    for (const attempt of attempts) {
      try {
        console.log(`🔄 Intentando: ${attempt.name}`);
        
        await this.sleep(attempt.delay);
        
        const response = await fetch('/api/Aspx/SICODISProxy.aspx?metodo=getVigencias', {
          method: 'GET',
          credentials: 'include',
          
        });

        const text = await response.text();
        
        if (this.isValidJson(text)) {
          console.log(`✅ ¡Éxito con: ${attempt.name}!`);
          return JSON.parse(text);
        } else {
          console.log(`⚠️ ${attempt.name} - No JSON:`, text.substring(0, 100));
        }

      } catch (error) {
        console.log(`❌ Error en ${attempt.name}:`, error);
      }
    }

    // Si nada funciona, devolver análisis
    return {
      error: 'No se pudo obtener JSON después de múltiples intentos',
      lastResponse: previousResponse,
      suggestion: 'Verificar configuración del proxy o contactar al administrador de la API'
    };
  }

  /**
   * Método usando HttpClient de Angular (alternativo)
   */
  async getVigenciasWithHttpClient(): Promise<any> {
    try {
      console.log('🚀 Intentando con HttpClient...');

      // Primera petición
      const firstCall = await this.http.get('/api/Aspx/SICODISProxy.aspx?metodo=getVigencias', {
        responseType: 'text',
        withCredentials: true,
        headers: new HttpHeaders({
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        })
      }).toPromise();

      console.log('✅ Primera petición HttpClient completada');
      console.log('🍪 Cookies:', document.cookie);

      // Esperar
      await this.sleep(2000);

      // Segunda petición
      const secondCall = await this.http.get('/api/Aspx/SICODISProxy.aspx?metodo=getVigencias', {
        responseType: 'text',
        withCredentials: true,
        headers: new HttpHeaders({
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'X-Requested-With': 'XMLHttpRequest'
        })
      }).toPromise();

      console.log('📄 Segunda petición HttpClient:', secondCall?.substring(0, 300));

      if (secondCall && this.isValidJson(secondCall)) {
        return JSON.parse(secondCall);
      }

      return { error: 'HttpClient approach failed', response: secondCall };

    } catch (error) {
      console.error('❌ Error con HttpClient:', error);
      throw error;
    }
  }

  /**
   * Método de diagnóstico para comparar con Postman
   */
  async simulatePostmanBehavior(): Promise<any> {
    console.log('🔧 Simulando comportamiento de Postman...');

    // Limpiar cookies existentes (si es posible)
    console.log('🧹 Estado inicial de cookies:', document.cookie);

    try {
      // Paso 1: Exactamente como Postman - primera petición
      console.log('📞 Petición 1 (como Postman)...');
      
      const request1 = await fetch('/api/Aspx/SICODISProxy.aspx?metodo=getVigencias', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': '*/*',
          'User-Agent': 'PostmanRuntime/7.29.0', // Simular Postman
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive'
        }
      });

      console.log('Response 1 status:', request1.status);
      //console.log('Response 1 headers:', Array.from(request1.headers.entries()));
      
      const response1Text = await request1.text();
      console.log('Response 1 preview:', response1Text.substring(0, 200));

      // Verificar cookies después de primera petición
      console.log('🍪 Cookies después de petición 1:', document.cookie);

      // Paso 2: Pequeña pausa como haría un usuario
      console.log('⏳ Pausa de 3 segundos...');
      await this.sleep(3000);

      // Paso 3: Segunda petición exactamente como Postman
      console.log('📞 Petición 2 (como Postman)...');
      
      const request2 = await fetch('/api/Aspx/SICODISProxy.aspx?metodo=getVigencias', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': '*/*',
          'User-Agent': 'PostmanRuntime/7.29.0',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive'
        }
      });

      console.log('Response 2 status:', request2.status);
      //console.log('Response 2 headers:', Array.from(request2.headers.entries()));
      
      const response2Text = await request2.text();
      console.log('Response 2 preview:', response2Text.substring(0, 500));

      // Analizar la segunda respuesta
      if (this.isValidJson(response2Text)) {
        console.log('✅ ¡Segunda petición devolvió JSON como Postman!');
        return JSON.parse(response2Text);
      } else {
        console.log('⚠️ Segunda petición aún no devuelve JSON');
        return {
          success: false,
          response1: response1Text.substring(0, 500),
          response2: response2Text.substring(0, 500),
          cookies: document.cookie
        };
      }

    } catch (error) {
      console.error('❌ Error simulando Postman:', error);
      throw error;
    }
  }

  // Métodos de utilidad
  private isValidJson(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Método para verificar el estado actual de las cookies
   */
  checkCookieStatus(): void {
    console.log('=== ESTADO DE COOKIES ===');
    console.log('📋 Todas las cookies:', document.cookie);
    
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      console.log(`🍪 ${name}: ${value?.substring(0, 50)}${value?.length > 50 ? '...' : ''}`);
    });

    const hasAuthCookie = document.cookie.includes('adAuthCookie');
    console.log(`🎯 adAuthCookie presente: ${hasAuthCookie ? '✅' : '❌'}`);
  }
}