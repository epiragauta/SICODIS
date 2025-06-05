import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DiagnosticoProxyService {

  async verificarProxy(): Promise<void> {
    console.log('=== DIAGNÓSTICO COMPLETO DEL PROXY ===');
    
    // Test 1: Verificar que el proxy está funcionando
    console.log('🔍 Test 1: Verificando configuración básica del proxy...');
    
    try {
      const response = await fetch('/api/Aspx/SICODISProxy.aspx?metodo=getVigencias', {
        method: 'HEAD'
      });
      
      console.log('✅ Proxy básico funciona:', response.status);
      console.log('🌐 Response URL:', response.url);
      
      // Si response.url sigue siendo localhost, el proxy NO está funcionando
      if (response.url.includes('localhost') || response.url.includes('127.0.0.1')) {
        console.error('❌ PROBLEMA: El proxy NO está redirigiendo. La petición se queda en localhost.');
        console.error('🔧 SOLUCIÓN: Verifica que ng serve se ejecute con: ng serve --proxy-config proxy.conf.js');
        return;
      }
      
    } catch (error) {
      console.error('❌ Error en test básico del proxy:', error);
      return;
    }

    // Test 2: Verificar headers
    console.log('\n🔍 Test 2: Verificando headers...');
    
    try {
      const response = await fetch('/api/logon.aspx', {
        method: 'GET',
        credentials: 'include'
      });
      
      console.log('📊 Status:', response.status);
      console.log('🌐 Final URL:', response.url);
      console.log('📄 Content-Type:', response.headers.get('content-type'));
      
      const text = await response.text();
      
      // Verificar si realmente llegamos al servidor correcto
      if (text.includes('sicodis') || text.includes('SICODIS') || text.includes('dnp.gov.co')) {
        console.log('✅ ¡El proxy está funcionando! Llegamos al servidor de SICODIS');
      } else if (text.includes('<app-root>') || text.includes('ng-version')) {
        console.error('❌ PROBLEMA: Estamos recibiendo la aplicación Angular, no el servidor remoto');
        console.error('🔧 El proxy NO está funcionando correctamente');
      } else {
        console.log('⚠️ Respuesta inesperada:', text.substring(0, 200));
      }
      
    } catch (error) {
      console.error('❌ Error en test de headers:', error);
    }

    // Test 3: Verificar comando de ejecución
    console.log('\n🔍 Test 3: Información del entorno...');
    console.log('🌐 Current URL:', window.location.href);
    console.log('🌐 Origin:', window.location.origin);
    console.log('📂 Base href:', document.querySelector('base')?.href || 'No base tag');
  }

  async probarEndpointDirecto(): Promise<void> {
    console.log('\n=== PRUEBA DIRECTA SIN PROXY ===');
    
    try {
      // Intentar llamada directa (esto debería fallar por CORS, pero nos dará información)
      const response = await fetch('https://sicodis.dnp.gov.co/Aspx/SICODISProxy.aspx?metodo=getVigencias', {
        method: 'GET',
        mode: 'cors',
        credentials: 'include'
      });
      
      console.log('✅ Llamada directa exitosa:', response.status);
      const text = await response.text();
      console.log('📄 Respuesta directa:', text.substring(0, 300));
      
    } catch (error) {
      console.log('❌ Error esperado en llamada directa (CORS):', error);
      console.log('🔧 Esto confirma que necesitamos el proxy funcionando');
    }
  }

  mostrarInstruccionesProxy(): void {
    console.log('\n=== INSTRUCCIONES PARA ARREGLAR EL PROXY ===');
    console.log('');
    console.log('1. 📁 Crea/actualiza el archivo proxy.conf.js (NO .json) en la raíz del proyecto');
    console.log('2. 🔧 Copia la configuración del PROXY_CONFIG mostrada arriba');
    console.log('3. ⚙️ Actualiza angular.json para usar "proxy.conf.js"');
    console.log('4. 🛑 Detén ng serve si está corriendo');
    console.log('5. 🚀 Ejecuta: ng serve --proxy-config proxy.conf.js');
    console.log('6. 🔍 Abre DevTools > Console y ejecuta el diagnóstico nuevamente');
    console.log('7. ✅ Deberías ver "¡El proxy está funcionando!" en el Test 2');
    console.log('');
    console.log('🎯 COMANDO EXACTO: ng serve --proxy-config proxy.conf.js');
    console.log('');
  }
}