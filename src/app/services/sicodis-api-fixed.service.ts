import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SicodisApiFixedService {

  constructor(private http: HttpClient) { }

  /**
   * Método corregido con los headers exactos que espera la API
   */
  async getVigenciasFixed(): Promise<any> {
    try {
      console.log('🚀 Iniciando con headers corregidos...');

      // Paso 1: Asegurar que tenemos la cookie (ya funciona)
      const loginResponse = await fetch(`/api/logon.aspx?_t=${Date.now()}`, {
        credentials: 'include',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      console.log('✅ Login status:', loginResponse.status);
      console.log('🍪 Cookies:', document.cookie);

      // Paso 2: API call con headers específicos para JSON
      const apiResponse = await fetch(`/api/Aspx/SICODISProxy.aspx?metodo=getVigencias`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          // Headers críticos para APIs ASP.NET que devuelven JSON
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'Content-Type': 'application/json; charset=utf-8',
          'X-Requested-With': 'XMLHttpRequest', // CRÍTICO para ASP.NET
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': window.location.origin + '/api/',
          'Accept-Language': 'es-CO,es;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Set-Cookie': document.cookie // Asegurar que se envían las cookies
        }
      });

      console.log('📊 API Status:', apiResponse.status);
      console.log('📄 Content-Type:', apiResponse.headers.get('content-type'));

      const responseText = await apiResponse.text();
      console.log('📄 Response preview:', responseText.substring(0, 500));   

      // Intentar parsear como JSON
      try {
        const jsonData = JSON.parse(responseText);
        console.log('✅ ¡JSON válido recibido!', jsonData);
        return jsonData;
      } catch (e) {
        console.log('⚠️ Respuesta no es JSON, continuando análisis...');
        return this.analyzeHtmlResponse(responseText);
      }

    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  }

  /**
   * Probar diferentes variaciones del endpoint
   */
  async testDifferentEndpoints(): Promise<any> {
    const endpoints = [
      // Variaciones del método
      'getVigencias',
      'GetVigencias', 
      'getvigencias',
      'GETVIGENCIAS',
      
      // Posibles métodos alternativos
      'getAnios',
      'getAños',
      'getYears',
      'getMethods',
      'getMetodos',
      'help',
      'test'
    ];

    const results: any[] = [];

    for (const method of endpoints) {
      try {
        console.log(`🔍 Probando método: ${method}`);
        
        const response = await fetch(`/api/Aspx/SICODISProxy.aspx?metodo=${method}&_t=${Date.now()}`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json; charset=utf-8'
          }
        });

        const text = await response.text();
        const isJson = this.isValidJson(text);
        
        results.push({
          method,
          status: response.status,
          contentType: response.headers.get('content-type'),
          isJson,
          preview: text.substring(0, 200),
          length: text.length
        });

        if (isJson) {
          console.log(`✅ ${method} devuelve JSON:`, text);
        } else {
          console.log(`⚠️ ${method} devuelve HTML/texto (${text.length} chars)`);
        }

      } catch (error) {
        console.log(`❌ Error con ${method}:`, error);
        results.push({
          method,
          error: error
        });
      }

      // Pequeña pausa entre peticiones
      await this.sleep(100);
    }

    console.log('📊 Resumen de todos los métodos:', results);
    return results;
  }

  /**
   * Método POST - algunas APIs ASP.NET requieren POST
   */
  async getVigenciasWithPost(): Promise<any> {
    try {
      console.log('🚀 Probando con método POST...');

      // Asegurar login
      await fetch('/api/logon.aspx', { credentials: 'include' });

      // Intentar POST
      const response = await fetch('/api/Aspx/SICODISProxy.aspx', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        body: 'metodo=getVigencias'
      });

      const text = await response.text();
      console.log('📊 POST Status:', response.status);
      console.log('📄 POST Response:', text.substring(0, 500));

      if (this.isValidJson(text)) {
        return JSON.parse(text);
      }

      return { type: 'html', content: text };

    } catch (error) {
      console.error('❌ Error con POST:', error);
      throw error;
    }
  }

  /**
   * Método para explorar la estructura de la aplicación
   */
  async exploreApiStructure(): Promise<any> {
    const explorationUrls = [
      '/api/Aspx/SICODISProxy.aspx',
      '/api/Aspx/SICODISProxy.aspx?help',
      '/api/Aspx/SICODISProxy.aspx?methods',
      '/api/Services/',
      '/api/API/',
      '/api/Data/',
      '/api/Json/',
      '/api/WebMethod/',
      '/api/Handler/',
      '/api/Aspx/Default.aspx',
      '/api/Scripts/', // Para ver si hay scripts JS que muestren cómo llamar la API
    ];

    const results: any[] = [];

    for (const url of explorationUrls) {
      try {
        const response = await fetch(url, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json, text/html, */*'
          }
        });

        const text = await response.text();
        
        results.push({
          url,
          status: response.status,
          contentType: response.headers.get('content-type'),
          hasJson: text.includes('{') && text.includes('}'),
          hasVigencias: text.includes('vigencia') || text.includes('Vigencia'),
          hasMetodos: text.includes('metodo') || text.includes('method'),
          preview: text.substring(0, 300)
        });

        console.log(`📍 ${url}: ${response.status} - ${text.length} chars`);

      } catch (error: any) {
        console.log(`❌ Error explorando ${url}:`, error);
      }
    }

    return results;
  }

  /**
   * Análisis específico de la respuesta HTML para encontrar pistas
   */
  private analyzeHtmlResponse(html: string): any {
    console.log('🔍 Analizando respuesta HTML...');

    const analysis = {
      isLoginPage: html.includes('login') || html.includes('password'),
      isErrorPage: html.includes('error') || html.includes('Error') || html.includes('Exception'),
      hasJavaScript: html.includes('<script'),
      hasForm: html.includes('<form'),
      hasMetaRefresh: html.includes('http-equiv="refresh"'),
      containsVigencias: html.includes('vigencia') || html.includes('Vigencia'),
      containsData: html.includes('data') || html.includes('Data'),
      title: this.extractTitle(html),
      scripts: this.extractScripts(html),
      forms: this.extractForms(html)
    };

    console.log('📊 Análisis HTML:', analysis);

    // Si hay scripts, podrían contener llamadas a la API real
    if (analysis.scripts.length > 0) {
      console.log('🎯 Scripts encontrados que podrían contener llamadas a API:');
      analysis.scripts.forEach((script, index) => {
        if (script.includes('ajax') || script.includes('fetch') || script.includes('XMLHttpRequest')) {
          console.log(`Script ${index + 1}:`, script.substring(0, 500));
        }
      });
    }

    return {
      type: 'html_analysis',
      analysis,
      content: html.substring(0, 2000)
    };
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

  private extractTitle(html: string): string {
    const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return match ? match[1] : '';
  }

  private extractScripts(html: string): string[] {
    const matches = html.match(/<script[^>]*>[\s\S]*?<\/script>/gi);
    return matches || [];
  }

  private extractForms(html: string): string[] {
    const matches = html.match(/<form[^>]*>[\s\S]*?<\/form>/gi);
    return matches || [];
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}