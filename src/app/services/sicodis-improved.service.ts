import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SicodisImprovedService {

  constructor(private http: HttpClient) { }

  /**
   * Método mejorado que evita cache y obtiene la respuesta completa
   */
  async getVigenciasImproved(): Promise<any> {
    try {
      console.log('🚀 Iniciando flujo mejorado...');

      // Paso 1: Hacer petición GET completa al login con parámetros anti-cache
      const timestamp = Date.now();
      const loginUrl = `/api/logon.aspx?_t=${timestamp}`;
      
      console.log('🔐 Accediendo al login...', loginUrl);
      
      const loginResponse = await fetch(loginUrl, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-cache', // Evitar cache del navegador
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'es-CO,es;q=0.9,en;q=0.8',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Upgrade-Insecure-Requests': '1',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      console.log('📋 Login Status:', loginResponse.status);
      
      // Obtener el contenido HTML del login
      const loginHtml = await loginResponse.text();
      console.log('📄 Login HTML preview:', loginHtml.substring(0, 500));

      // Verificar si hay algún formulario o token en el HTML
      this.analyzeLoginPage(loginHtml);

      // Paso 2: Esperar un momento para que se establezca la sesión
      await this.sleep(1000);

      // Verificar cookies después del login
      console.log('🍪 Cookies después del login:', document.cookie);

      // Paso 3: Hacer la petición a la API con headers completos
      const apiUrl = `/api/Aspx/SICODISProxy.aspx?metodo=getVigencias&_t=${Date.now()}`;
      
      console.log('📡 Llamando a la API...', apiUrl);
      
      const apiResponse = await fetch(apiUrl, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-cache',
        headers: {
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'Accept-Language': 'es-CO,es;q=0.9,en;q=0.8',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'X-Requested-With': 'XMLHttpRequest',
          'Referer': window.location.origin + '/api/',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'set-cookie': document.cookie // Incluir cookies de sesión
        }
      });

      console.log('📊 API Status:', apiResponse.status);
      
      // Analizar headers de respuesta
      const responseHeaders: any = {};
      apiResponse.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });
      console.log('📝 API Response Headers:', responseHeaders);

      // Obtener la respuesta
      const responseText = await apiResponse.text();
      console.log('📄 API Response preview:', responseText.substring(0, 500));

      // Analizar el tipo de respuesta
      return this.analyzeApiResponse(responseText, apiResponse.status);

    } catch (error) {
      console.error('❌ Error en flujo mejorado:', error);
      throw error;
    }
  }

  /**
   * Analizar la página de login para encontrar pistas
   */
  private analyzeLoginPage(html: string): void {
    console.log('🔍 Analizando página de login...');

    // Buscar formularios
    const formMatches = html.match(/<form[^>]*>/gi);
    if (formMatches) {
      console.log('📝 Formularios encontrados:', formMatches.length);
      formMatches.forEach((form, index) => {
        console.log(`Form ${index + 1}:`, form);
      });
    }

    // Buscar campos hidden que podrían ser tokens
    const hiddenMatches = html.match(/<input[^>]*type=["']hidden["'][^>]*>/gi);
    if (hiddenMatches) {
      console.log('🔒 Campos hidden encontrados:', hiddenMatches.length);
      hiddenMatches.forEach((hidden, index) => {
        console.log(`Hidden ${index + 1}:`, hidden);
      });
    }

    // Buscar scripts que podrían hacer peticiones automáticas
    const scriptMatches = html.match(/<script[^>]*>[\s\S]*?<\/script>/gi);
    if (scriptMatches) {
      console.log('📜 Scripts encontrados:', scriptMatches.length);
      
      // Buscar XMLHttpRequest o fetch en los scripts
      scriptMatches.forEach((script, index) => {
        if (script.includes('XMLHttpRequest') || script.includes('fetch') || script.includes('ajax')) {
          console.log(`🎯 Script ${index + 1} con peticiones HTTP:`, script.substring(0, 300));
        }
      });
    }

    // Buscar meta refresh o redirects
    const metaMatches = html.match(/<meta[^>]*http-equiv=["']refresh["'][^>]*>/gi);
    if (metaMatches) {
      console.log('🔄 Meta refresh encontrado:', metaMatches);
    }
  }

  /**
   * Analizar la respuesta de la API
   */
  private analyzeApiResponse(responseText: string, status: number): any {
    console.log('🔍 Analizando respuesta de la API...');

    // Verificar si es JSON
    try {
      const jsonData = JSON.parse(responseText);
      console.log('✅ Respuesta es JSON válido:', jsonData);
      return jsonData;
    } catch (e) {
      console.log('⚠️ Respuesta no es JSON, analizando como HTML/texto...');
    }

    // Verificar si es una redirección HTML
    if (responseText.includes('Object moved') || responseText.includes('Moved')) {
      console.log('🔄 Detectada redirección en la respuesta');
      
      // Buscar la URL de redirección
      const locationMatch = responseText.match(/href=["']([^"']+)["']/i);
      if (locationMatch) {
        console.log('🎯 URL de redirección encontrada:', locationMatch[1]);
      }
    }

    // Verificar si es una página de error
    if (responseText.includes('error') || responseText.includes('Error') || status >= 400) {
      console.log('❌ Posible página de error detectada');
    }

    // Verificar si contiene datos que parecen vigencias
    if (responseText.includes('vigencia') || responseText.includes('año') || responseText.includes('2024') || responseText.includes('2025')) {
      console.log('🎯 La respuesta parece contener datos de vigencias');
    }

    // Verificar si es una página de login
    if (responseText.includes('login') || responseText.includes('password') || responseText.includes('usuario')) {
      console.log('🔐 La respuesta parece ser una página de login');
    }

    return {
      type: 'html/text',
      content: responseText,
      preview: responseText.substring(0, 1000),
      containsVigencias: responseText.includes('vigencia'),
      isLogin: responseText.includes('login'),
      isError: responseText.includes('error') || status >= 400,
      isRedirect: responseText.includes('Object moved')
    };
  }

  /**
   * Método alternativo: Intentar obtener el token de autenticación del login
   */
  async getVigenciasWithToken(): Promise<any> {
    try {
      // Paso 1: Obtener la página de login y extraer tokens
      const loginResponse = await fetch('/api/logon.aspx', {
        credentials: 'include',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });

      const loginHtml = await loginResponse.text();
      
      // Extraer ViewState y otros campos hidden
      const viewStateMatch = loginHtml.match(/name="__VIEWSTATE"[^>]*value="([^"]+)"/);
      const eventValidationMatch = loginHtml.match(/name="__EVENTVALIDATION"[^>]*value="([^"]+)"/);
      
      if (viewStateMatch || eventValidationMatch) {
        console.log('🎯 Tokens ASP.NET encontrados');
        
        // Si hay formulario, podríamos necesitar hacer POST
        const formData = new FormData();
        if (viewStateMatch) formData.append('__VIEWSTATE', viewStateMatch[1]);
        if (eventValidationMatch) formData.append('__EVENTVALIDATION', eventValidationMatch[1]);
        
        // Hacer POST al login si es necesario
        const postResponse = await fetch('/api/logon.aspx', {
          method: 'POST',
          credentials: 'include',
          body: formData
        });
        
        console.log('📬 POST login status:', postResponse.status);
      }

      // Intentar la API después
      return await this.callApi();

    } catch (error) {
      console.error('❌ Error con método de token:', error);
      throw error;
    }
  }

  /**
   * Método de utilidad para hacer la llamada a la API
   */
  private async callApi(): Promise<any> {
    const apiResponse = await fetch(`/api/Aspx/SICODISProxy.aspx?metodo=getVigencias&t=${Date.now()}`, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    const text = await apiResponse.text();
    return this.analyzeApiResponse(text, apiResponse.status);
  }

  /**
   * Utilidad para pausar la ejecución
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}