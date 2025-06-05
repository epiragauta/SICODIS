// ============================================
// SOLUCIÓN 1: proxy.conf.js CORREGIDO
// ============================================

const PROXY_CONFIG = {
  "/api/*": {
    "target": "https://sicodis.dnp.gov.co",
    "secure": true,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": {
      "^/api": ""  // Reemplazar /api con nada (string vacío)
    },
    // Configuración específica para cookies
    "cookieDomainRewrite": {
      "sicodis.dnp.gov.co": "localhost"
    },
    "cookiePathRewrite": {
      "/": "/"
    },
    "headers": {
      "Connection": "keep-alive"
    },
    "onProxyReq": function(proxyReq, req, res) {
      console.log('🚀 PROXY REQUEST:', {
        originalUrl: req.url,
        targetUrl: proxyReq.path,
        method: req.method,
        headers: req.headers
      });
      
      // Asegurar headers correctos
      proxyReq.setHeader('Host', 'sicodis.dnp.gov.co');
      proxyReq.setHeader('Origin', 'https://sicodis.dnp.gov.co');
      proxyReq.setHeader('Referer', 'https://sicodis.dnp.gov.co/');
      
      // User-Agent realista
      if (!proxyReq.getHeader('User-Agent')) {
        proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      }
    },
    "onProxyRes": function(proxyRes, req, res) {
      console.log('📥 PROXY RESPONSE:', {
        statusCode: proxyRes.statusCode,
        headers: proxyRes.headers,
        url: req.url
      });
      
      // Configurar CORS
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control');
      
      // Manejar cookies
      const setCookieHeaders = proxyRes.headers['set-cookie'];
      if (setCookieHeaders) {
        console.log('🍪 COOKIES ORIGINALES:', setCookieHeaders);
        
        const modifiedCookies = setCookieHeaders.map(cookie => {
          let modifiedCookie = cookie
            .replace(/Domain=([^;]+)/gi, 'Domain=localhost')
            .replace(/Secure[;]?/gi, '')  // Remover Secure para HTTP local
            .replace(/SameSite=None/gi, 'SameSite=Lax');
          
          console.log('🍪 COOKIE MODIFICADA:', modifiedCookie);
          return modifiedCookie;
        });
        
        proxyRes.headers['set-cookie'] = modifiedCookies;
        res.setHeader('Set-Cookie', modifiedCookies);
      }
    },
    "onError": function(err, req, res) {
      console.error('❌ PROXY ERROR:', {
        error: err.message,
        url: req.url,
        code: err.code
      });
    }
  }
};

module.exports = PROXY_CONFIG;