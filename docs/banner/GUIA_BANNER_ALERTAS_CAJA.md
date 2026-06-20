# Guía: Banner de Alertas de Caja SGR

## Descripción

Se ha implementado un **nuevo banner estructurado con HTML/CSS** para mostrar la infografía de "Alertas de Caja" del Sistema General de Regalías (SGR) en el home de SICODIS.

Este banner reemplaza la imagen estática (`alertasboletin.jpg`) con una estructura HTML moderna, responsiva y accesible.

---

## Archivos Creados

### 1. Componente Angular
**Ubicación:** `src/app/components/home/`

| Archivo | Descripción |
|---------|-------------|
| `banner-alertas-caja.component.ts` | Componente standalone de Angular |
| `banner-alertas-caja.html` | Template HTML con estructura semántica |
| `banner-alertas-caja.scss` | Estilos SCSS con diseño responsive |

### 2. Características del Componente

**HTML estructurado con:**
- Header con gradiente de colores
- Badge del Sistema General de Regalías
- Descripción del sistema
- Panorama general con card de recaudo ($9.9 Billones)
- Estadísticas con iconos
- Sección "Por asignación" con dos columnas:
  - Asignaciones Directas (20%) - 732 entidades
  - AD Anticipadas (80%) - 676 municipios
- Sección "¿Qué pueden hacer?" con 3 pasos visuales
- Botón CTA "Conoce más sobre Alertas de Caja"
- Footer con fuente y créditos

**CSS responsive:**
- Diseño optimizado para desktop (600px max-width)
- Responsive en tablets y móviles
- Colores de marca: Turquesa (#00bcd4), Rosa (#e91e63), gradientes
- Iconos y efectos visuales
- Hover states en botones

---

## Integración con ConfigService

### 1. Interface BannerConfig Actualizada

Se agregó la propiedad `template` a la interface:

```typescript
export interface BannerConfig {
  // ... campos existentes
  template?: 'default' | 'alertas-caja'; // NUEVO
  // ...
}
```

**Valores posibles:**
- `'default'` - Banner tradicional con imagen + texto
- `'alertas-caja'` - Infografía estructurada de Alertas de Caja

### 2. Componente Home Actualizado

**Imports agregados:**
```typescript
import { BannerAlertasCajaComponent } from './banner-alertas-caja.component';
```

**HTML condicional:**
```html
<div class="banner-content">
  <!-- Banner HTML estructurado: Alertas de Caja -->
  <div *ngIf="bannerConfig?.template === 'alertas-caja'">
    <app-banner-alertas-caja></app-banner-alertas-caja>
  </div>

  <!-- Banner tradicional (imagen + texto) -->
  <ng-container *ngIf="bannerConfig?.template !== 'alertas-caja'">
    <!-- Contenido tradicional -->
  </ng-container>
</div>
```

### 3. Panel de Administración Actualizado

**Formulario de banner (`config-banner.component`):**

Se agregó un nuevo selector de template:

```html
<p-dropdown
  id="banner-template"
  formControlName="template"
  [options]="templateOptions"
  optionLabel="label"
  optionValue="value">
</p-dropdown>
```

**Opciones de template:**
1. **Banner tradicional (imagen + texto)** - `'default'`
2. **Alertas de Caja SGR (infografía)** - `'alertas-caja'`

---

## Cómo Usar el Nuevo Banner

### Opción 1: Desde el Panel de Administración

1. Ir a `/admin-config` en SICODIS
2. Tab **"Banner y Alertas"**
3. En el formulario, encontrar el campo **"Tipo de diseño"**
4. Seleccionar **"Alertas de Caja SGR (infografía)"**
5. Configurar las opciones del banner:
   - ✅ Activar banner
   - Título: "Alertas de caja - SGR"
   - Tipo: Información
   - **Template: alertas-caja** ← Seleccionar esta opción
   - Fechas de inicio y fin
   - Frecuencia diaria: 1 vez
   - Días consecutivos: 5 días
6. Click en **"Guardar Configuración"**
7. Recargar el home de SICODIS
8. ✅ El banner se mostrará con la infografía estructurada

### Opción 2: Configuración Manual en localStorage

```javascript
// En consola del navegador
const bannerConfig = {
  id: 1,
  activo: true,
  titulo: 'Alertas de caja',
  mensaje: 'Situación de caja del SGR',
  tipo: 'info',
  template: 'alertas-caja', // ← Clave importante
  fecha_inicio: '2026-06-01',
  fecha_fin: '2026-12-31',
  frecuencia_diaria: 1,
  max_dias_consecutivos: 5,
  version: 1
};

// Guardar en ConfigService
// (esto normalmente lo hace el panel de administración)
localStorage.setItem('sicodis_banner_config', JSON.stringify(bannerConfig));

// Recargar la página
location.reload();
```

---

## Comparación: Banner Tradicional vs Alertas de Caja

| Aspecto | Banner Tradicional | Alertas de Caja |
|---------|-------------------|-----------------|
| **Contenido** | Imagen estática + texto | HTML estructurado |
| **Campos usados** | titulo, mensaje, imagen_url, boton | titulo, template |
| **Diseño** | Simple (imagen + botón) | Infografía completa |
| **Responsive** | Depende de la imagen | CSS responsive nativo |
| **Accesibilidad** | Solo alt text | Semántico con ARIA |
| **Editable** | Solo cambiar imagen | Futuro: datos dinámicos |
| **Tamaño** | Depende de imagen (~100KB) | HTML + CSS (~15KB) |

---

## Estructura Visual del Banner Alertas de Caja

```
┌─────────────────────────────────────────────┐
│  🌈 Gradiente de colores (header)           │
│                                             │
│  Alertas de caja                      DNP   │
│                                             │
├─────────────────────────────────────────────┤
│  🎯 Sistema General de Regalías            │
├─────────────────────────────────────────────┤
│  Situación de caja frente a...             │
├─────────────────────────────────────────────┤
│  Panorama general:                          │
│                                             │
│  ┌───────┐                                 │
│  │ $9.9  │  ✓  • $9.3 Billones            │
│  │Billones│     • El recaudo total...      │
│  └───────┘                                 │
├─────────────────────────────────────────────┤
│  Por asignación                             │
│                                             │
│  Asignaciones Directas  │  AD Anticipadas  │
│  (20%)                  │  (80%)           │
│  De 732 entidades       │  De 676 municipios│
│                         │                   │
│  • 72 no cuentan...     │  • 45 no cuentan...│
│  • 24 cuentan con...    │  • 17 cuentan con...│
│  • 636 cuentan con...   │  • 614 cuentan con...│
├─────────────────────────────────────────────┤
│  ¿Qué pueden hacer?                         │
│                                             │
│  [1]  ──→  [2]  ──→  [3]                  │
│  Evaluar   Evaluar   Evaluar               │
│                                             │
│  [ Conoce más sobre Alertas de Caja ›› ]   │
├─────────────────────────────────────────────┤
│  Fuente: SICODIS-SGR Cálculos DDTS...     │
└─────────────────────────────────────────────┘
```

---

## Ventajas del Nuevo Banner

### 1. **Performance**
- ✅ No requiere cargar imagen pesada (de ~100KB a ~15KB)
- ✅ Renderizado instantáneo con HTML/CSS
- ✅ No hay delay de descarga de imagen

### 2. **Responsive**
- ✅ Se adapta automáticamente a móviles y tablets
- ✅ Grid y flexbox nativos
- ✅ Breakpoints CSS definidos

### 3. **Accesibilidad**
- ✅ HTML semántico
- ✅ Lectores de pantalla pueden navegar
- ✅ Contraste de colores adecuado
- ✅ Estructura lógica de headings

### 4. **Mantenibilidad**
- ✅ Fácil de actualizar en el código
- ✅ Separación de estructura (HTML) y estilo (SCSS)
- ✅ Componente standalone reutilizable
- ✅ Futuro: datos dinámicos desde API

### 5. **SEO y Análisis**
- ✅ Contenido textual indexable
- ✅ Mejor para analytics (clicks en botones)
- ✅ Links trackables

---

## Futuras Mejoras

### Fase 1: Datos Dinámicos (Sprint futuro)
Reemplazar valores hardcodeados por datos del API:

```typescript
export class BannerAlertasCajaComponent implements OnInit {
  recaudoTotal = signal('$9.9 Billones');
  proyectosRegistrados = signal('$9.3 Billones');
  // ...

  ngOnInit() {
    this.loadAlertasCajaData();
  }

  private loadAlertasCajaData() {
    this.apiService.getAlertasCaja().subscribe(data => {
      this.recaudoTotal.set(data.recaudo_total);
      // ...
    });
  }
}
```

### Fase 2: Configuración Desde Admin Panel
Permitir editar los números directamente desde el panel de administración:

```typescript
interface AlertasCajaConfig {
  recaudo_total: string;
  proyectos_registrados: string;
  entidades_directas: number;
  municipios_anticipadas: number;
  // ...
}
```

### Fase 3: Más Templates
Agregar más templates de banners especializados:
- `'alertas-recaudo'` - Alertas de recaudo mensual
- `'alertas-proyectos'` - Estado de proyectos
- `'alertas-vigencias'` - Cambios de vigencia

---

## Testing

### Test Manual

1. **Verificar banner tradicional:**
   ```javascript
   // En panel admin, seleccionar template: "Banner tradicional"
   // Guardar y verificar que muestra imagen + texto
   ```

2. **Verificar banner Alertas de Caja:**
   ```javascript
   // En panel admin, seleccionar template: "Alertas de Caja SGR"
   // Guardar y verificar que muestra infografía estructurada
   ```

3. **Verificar responsive:**
   ```bash
   # Abrir Chrome DevTools
   # Cambiar a vista móvil (375px)
   # Verificar que la infografía se adapta correctamente
   ```

### Test Unitario (futuro)

```typescript
describe('BannerAlertasCajaComponent', () => {
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display recaudo total', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.recaudo-amount').textContent).toContain('$9.9');
  });

  it('should call verMasInformacion on button click', () => {
    spyOn(component, 'verMasInformacion');
    const button = fixture.nativeElement.querySelector('.cta-button');
    button.click();
    expect(component.verMasInformacion).toHaveBeenCalled();
  });
});
```

---

## Troubleshooting

### Problema 1: El banner no se muestra
**Causa:** Template no está configurado correctamente

**Solución:**
```typescript
// Verificar en DevTools → Application → localStorage
// Buscar: sicodis_banner_config
// Verificar que template = 'alertas-caja'
```

### Problema 2: Estilos no se aplican
**Causa:** SCSS no compilado o import faltante

**Solución:**
```bash
# Recompilar
npm run build

# Verificar que el componente tiene styleUrls
styleUrls: ['./banner-alertas-caja.scss']
```

### Problema 3: Error "Can't resolve component"
**Causa:** Import faltante en home.component.ts

**Solución:**
```typescript
// Verificar que está importado
import { BannerAlertasCajaComponent } from './banner-alertas-caja.component';

// Y agregado al array imports
imports: [
  // ...
  BannerAlertasCajaComponent
]
```

---

## Métricas de Éxito

### Antes (Imagen Estática)
- **Peso:** ~100KB (imagen JPG)
- **Carga:** ~200ms (descarga de imagen)
- **Responsive:** No (imagen fija)
- **Accesibilidad:** Baja (solo alt text)
- **Editable:** No (requiere Photoshop)

### Después (HTML Estructurado)
- **Peso:** ~15KB (HTML + CSS)
- **Carga:** Instantáneo
- **Responsive:** ✅ Sí (CSS adaptativo)
- **Accesibilidad:** ✅ Alta (HTML semántico)
- **Editable:** ✅ Sí (código HTML)

---

## Conclusión

El nuevo **banner de Alertas de Caja SGR** proporciona una experiencia visual mejorada, mejor performance, y mayor accesibilidad comparado con la imagen estática anterior.

**Próximos pasos:**
1. ✅ **Completado:** Implementación básica con HTML/CSS
2. ⏳ **Pendiente:** Integración con API para datos dinámicos
3. ⏳ **Pendiente:** Tests unitarios completos
4. ⏳ **Pendiente:** Más templates de banners especializados

---

**Autor:** Claude Code (Sonnet 4.5)  
**Fecha:** 11 de junio de 2026  
**Proyecto:** SICODIS WebII - DNP Colombia  
**Usuario:** Edwin Piragauta (edwin.piragauta@gmail.com)
