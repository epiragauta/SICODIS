# Sistema de Diseño SICODIS

Guía de referencia rápida para el uso del nuevo sistema de diseño implementado en SICODIS.

## 📚 Índice

- [Paleta de Colores](#paleta-de-colores)
- [Variables por Sistema](#variables-por-sistema)
- [Tipografía](#tipografía)
- [Espaciado](#espaciado)
- [Sombras](#sombras)
- [Clases de Utilidad](#clases-de-utilidad)
- [Componentes Comunes](#componentes-comunes)
- [Ejemplos de Uso](#ejemplos-de-uso)

---

## 🎨 Paleta de Colores

### Colores Principales - Por Sistema

```css
--t: #00c3c1;    /* Turquesa – SGP (innovación y apertura) */
--m: #fe1b7b;    /* Magenta – SGR (inclusión y transformación) */
--a: #ffca00;    /* Amarillo – PGN (desarrollo y esperanza) */
```

**Uso:**
- **SGP** → Turquesa (#00c3c1)
- **SGR** → Magenta (#fe1b7b)
- **PGN** → Amarillo (#ffca00)

### Colores de Apoyo

```css
--gc: #ebebeb;   /* Gris claro */
--fw: #f5f2e9;   /* Fondo warm */
--bl: #ffffff;   /* Blanco */
--gt: #3d3d3d;   /* Gris texto principal */
--gm: #5e5e5e;   /* Gris texto medio */
--gs: #9b9b9b;   /* Gris texto suave */
--nr: #fbb03b;   /* Naranja secundario */
--mo: #7f47dd;   /* Morado secundario */
```

### Colores Institucionales (Legado)

```css
--azul-dnp: #004583;       /* Azul institucional DNP */
--azul-sicodis: #0943b5;   /* Azul SICODIS */
--azul-hover: #2797ce;     /* Azul hover */
```

### Sistema de Diseño Cívico (Civic Design) - SGR Información General

**Implementado en:** `sgr-informacion-general` (desde 2026-06-20)

**Contexto:** Para módulos con datos fiscales gubernamentales que requieren un lenguaje visual autoritativo y confiable. Sustituye los colores vibrantes (magenta/púrpura) con una paleta cívica profesional.

```scss
$civic-navy: #1e3a5f;      // Principal - autoridad institucional
$civic-navy-dark: #14293f; // Navy oscuro para hover/active
$civic-gold: #d4a655;      // Acento - riqueza mineral colombiana
$civic-slate: #64748b;     // Texto/bordes secundarios
$civic-steel: #4a5f7a;     // Texto secundario
$civic-cloud: #f1f5f9;     // Fondo alternativo
$alert-amber: #f59e0b;     // Acciones de remoción
```

**Características visuales:**
- Chips estilo ledger/libro contable (fondo blanco + borde izquierdo de acento)
- Border-radius mínimo (2px) para estética de contabilidad
- Sombras sutiles (0 2px 8px rgba(0, 0, 0, 0.08))
- Tipografía estructurada con labels en uppercase

**Cuándo usar:**
- ✅ Módulos de datos fiscales/presupuestales
- ✅ Reportes financieros gubernamentales
- ✅ Dashboards de transparencia fiscal
- ❌ Módulos de marketing o comunicación pública
- ❌ Páginas de inicio o landing pages

**Archivo de referencia:** `src/app/components/sgr-informacion-general/sgr-informacion-general.component.scss`

---

## 🏷️ Variables por Sistema

### Sistema General de Participaciones (SGP)

```css
--sgp-primary: var(--t);                    /* #00c3c1 */
--sgp-primary-light: rgba(0, 195, 193, 0.1);
--sgp-primary-hover: #00ada9;
--sgp-gradient: linear-gradient(135deg, #00c3c1 0%, #00a8a6 100%);
```

### Sistema General de Regalías (SGR)

```css
--sgr-primary: var(--m);                    /* #fe1b7b */
--sgr-primary-light: rgba(254, 27, 123, 0.1);
--sgr-primary-hover: #e01567;
--sgr-gradient: linear-gradient(135deg, #fe1b7b 0%, #e0176f 100%);
```

### Presupuesto General de la Nación (PGN)

```css
--pgn-primary: var(--a);                    /* #ffca00 */
--pgn-primary-light: rgba(255, 202, 0, 0.15);
--pgn-primary-hover: #e6b800;
--pgn-gradient: linear-gradient(135deg, #ffca00 0%, #f5c300 100%);
```

---

## 📝 Tipografía

### Tamaños de Fuente

```css
--fs-xs: 0.75rem;      /* 12px */
--fs-sm: 0.875rem;     /* 14px */
--fs-base: 1rem;       /* 16px */
--fs-lg: 1.125rem;     /* 18px */
--fs-xl: 1.25rem;      /* 20px */
--fs-2xl: 1.5rem;      /* 24px */
--fs-3xl: 2rem;        /* 32px */
--fs-4xl: 2.5rem;      /* 40px */
```

### Pesos de Fuente

```css
--fw-normal: 400;
--fw-medium: 500;
--fw-semibold: 600;
--fw-bold: 700;
--fw-extrabold: 800;
```

### Line Heights

```css
--lh-tight: 1.2;
--lh-normal: 1.5;
--lh-relaxed: 1.6;
```

---

## 📏 Espaciado

Sistema de espaciado basado en múltiplos de 8px:

```css
--sp-xs: 4px;     /* 0.25rem */
--sp-sm: 8px;     /* 0.5rem */
--sp-md: 16px;    /* 1rem */
--sp-lg: 24px;    /* 1.5rem */
--sp-xl: 32px;    /* 2rem */
--sp-2xl: 48px;   /* 3rem */
--sp-3xl: 64px;   /* 4rem */
```

---

## 🌑 Sombras

```css
--sh-sm: 0 1px 4px rgba(0, 0, 0, 0.05);      /* Sombra pequeña */
--sh: 0 2px 14px rgba(0, 0, 0, 0.07);        /* Sombra principal */
--sh-md: 0 4px 16px rgba(0, 0, 0, 0.1);      /* Sombra media */
--sh-lg: 0 8px 24px rgba(0, 0, 0, 0.12);     /* Sombra grande */
--sh-hover: 0 6px 20px rgba(0, 0, 0, 0.15);  /* Sombra en hover */
```

---

## 🔧 Clases de Utilidad

### Colores de Fondo

```html
<div class="bg-sgp">Fondo turquesa SGP</div>
<div class="bg-sgp-light">Fondo turquesa claro SGP</div>
<div class="bg-sgr">Fondo magenta SGR</div>
<div class="bg-sgr-light">Fondo magenta claro SGR</div>
<div class="bg-pgn">Fondo amarillo PGN</div>
<div class="bg-pgn-light">Fondo amarillo claro PGN</div>
```

### Colores de Texto

```html
<p class="text-sgp">Texto turquesa SGP</p>
<p class="text-sgr">Texto magenta SGR</p>
<p class="text-pgn">Texto amarillo PGN</p>
<p class="text-primary">Texto principal (gris oscuro)</p>
<p class="text-secondary">Texto secundario (gris medio)</p>
<p class="text-muted">Texto tenue (gris claro)</p>
```

### Badges/Etiquetas

```html
<!-- Badges sólidos -->
<span class="badge badge-sgp">SGP</span>
<span class="badge badge-sgr">SGR</span>
<span class="badge badge-pgn">PGN</span>

<!-- Badges con borde -->
<span class="badge badge-outline-sgp">SGP</span>
<span class="badge badge-outline-sgr">SGR</span>
<span class="badge badge-outline-pgn">PGN</span>
```

### Bordes de Acento

```html
<!-- Borde superior -->
<div class="border-top-sgp">Card con borde turquesa</div>
<div class="border-top-sgr">Card con borde magenta</div>
<div class="border-top-pgn">Card con borde amarillo</div>

<!-- Borde izquierdo -->
<div class="border-left-sgp">Card con borde izquierdo turquesa</div>
```

### Sombras

```html
<div class="shadow-sm">Sombra pequeña</div>
<div class="shadow">Sombra normal</div>
<div class="shadow-md">Sombra media</div>
<div class="shadow-lg">Sombra grande</div>
```

### Animaciones

```html
<!-- Fade in up -->
<div class="animate-fade-in-up">Se anima al cargar</div>

<!-- Fade in up con delay -->
<div class="animate-fade-in-up delay-100">Primera card</div>
<div class="animate-fade-in-up delay-200">Segunda card</div>
<div class="animate-fade-in-up delay-300">Tercera card</div>

<!-- Fade in simple -->
<div class="animate-fade-in">Aparece suavemente</div>

<!-- Slide in desde la derecha -->
<div class="animate-slide-in-right">Entra desde la derecha</div>
```

### Transiciones

```html
<button class="transition-all">Transición suave</button>
<div class="hover-lift">Se eleva al hacer hover</div>
```

### Iconos Circulares

```html
<div class="icon-circle icon-circle-sgp">
  <i class="pi pi-chart-line"></i>
</div>

<div class="icon-circle icon-circle-sgr">
  <i class="pi pi-money-bill"></i>
</div>

<div class="icon-circle icon-circle-pgn">
  <i class="pi pi-book"></i>
</div>
```

---

## 🧩 Componentes Comunes

### KPI Card

```html
<div class="kpi-card">
  <span class="kpi-label">Presupuesto Total</span>
  <span class="kpi-value">$88.3B</span>
  <span class="kpi-badge badge-sgp">
    <i class="pi pi-arrow-up"></i> 74%
  </span>
</div>
```

**Resultado:** Card con KPI grande, label descriptivo y badge de progreso.

### Card con Gradiente

```html
<div class="gradient-sgp" style="padding: 2rem; border-radius: var(--r);">
  <h3 style="margin: 0; color: white;">Título en gradiente SGP</h3>
  <p style="margin: 0.5rem 0 0; opacity: 0.9;">Texto descriptivo</p>
</div>
```

---

## 💡 Ejemplos de Uso

### Card de Sistema con Identidad de Color

```html
<p-card class="card-container border-top-sgp hover-lift animate-fade-in-up">
  <div class="card-header">
    <div class="icon-circle icon-circle-sgp">
      <img src="/assets/img/icon-sgp.png" alt="SGP">
    </div>
    <h2>Sistema General de Participaciones</h2>
  </div>

  <div class="card-description">
    <p>Descripción del sistema...</p>
  </div>

  <ng-template pTemplate="footer">
    <button pButton type="button"
            class="bg-sgp"
            style="background-color: var(--sgp-primary);">
      Ver Reportes
    </button>
  </ng-template>
</p-card>
```

### Tabla con Badge de Sistema

```html
<p-table [value]="data">
  <ng-template pTemplate="header">
    <tr>
      <th>Sistema</th>
      <th>Presupuesto</th>
      <th>Estado</th>
    </tr>
  </ng-template>
  <ng-template pTemplate="body" let-item>
    <tr>
      <td>
        <span class="badge badge-sgp">{{ item.sistema }}</span>
      </td>
      <td>{{ item.presupuesto | numberFormat }}</td>
      <td>
        <span class="kpi-badge badge-sgp">
          <i class="pi pi-check"></i> Activo
        </span>
      </td>
    </tr>
  </ng-template>
</p-table>
```

### Botón con Color de Sistema

```scss
// En el SCSS del componente
.p-button-sgp {
  background-color: var(--sgp-primary) !important;
  border-color: var(--sgp-primary) !important;

  &:hover {
    background-color: var(--sgp-primary-hover) !important;
    border-color: var(--sgp-primary-hover) !important;
  }
}
```

```html
<button pButton type="button"
        class="p-button-sgp"
        label="Acción SGP">
</button>
```

---

## 🎯 Mejores Prácticas

### 1. Usar Variables Semánticas

❌ **Evitar:**
```css
background-color: #00c3c1;
```

✅ **Preferir:**
```css
background-color: var(--sgp-primary);
```

### 2. Consistencia en Espaciado

❌ **Evitar:**
```css
margin: 15px;
padding: 18px;
```

✅ **Preferir:**
```css
margin: var(--sp-md);   /* 16px */
padding: var(--sp-lg);  /* 24px */
```

### 3. Usar Clases de Utilidad cuando sea Posible

❌ **Evitar:**
```html
<div style="background-color: rgba(0, 195, 193, 0.1); padding: 24px;">
  ...
</div>
```

✅ **Preferir:**
```html
<div class="bg-sgp-light" style="padding: var(--sp-lg);">
  ...
</div>
```

### 4. Animaciones para Mejor UX

```html
<!-- Cards que aparecen al cargar -->
<div class="animate-fade-in-up delay-100">Primera card</div>
<div class="animate-fade-in-up delay-200">Segunda card</div>
<div class="animate-fade-in-up delay-300">Tercera card</div>

<!-- Elementos interactivos con hover -->
<button class="hover-lift">Click aquí</button>
```

---

## 🔄 Migración Gradual

Para componentes existentes, puedes migrar gradualmente:

1. **Paso 1:** Reemplazar colores hardcodeados con variables CSS
2. **Paso 2:** Agregar clases de utilidad donde aplique
3. **Paso 3:** Implementar animaciones y transiciones
4. **Paso 4:** Ajustar espaciado al sistema de 8px

**Ejemplo:**

```scss
// Antes
.my-component {
  background-color: #00c3c1;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

// Después
.my-component {
  background-color: var(--sgp-primary);
  padding: var(--sp-md);
  border-radius: var(--r);
  box-shadow: var(--sh);
  transition: all var(--transition-base);

  &:hover {
    box-shadow: var(--sh-hover);
    transform: translateY(-2px);
  }
}
```

---

## 📱 Responsive

El sistema incluye utilidades responsive para dispositivos móviles:

```scss
@media (max-width: 768px) {
  .kpi-value {
    font-size: var(--fs-2xl);  // Reduce de 3xl a 2xl en móvil
  }

  .icon-circle {
    width: 3rem;     // Reduce de 3.5rem a 3rem
    height: 3rem;
  }
}
```

---

## 🎨 Referencia Rápida de Variables CSS

**Ubicación:** `src/styles.scss` (líneas 47-90)

**Para ver todas las variables disponibles:**
```bash
# Buscar en el archivo styles.scss
grep "^  --" src/styles.scss
```

---

## 📞 Soporte

Para preguntas o sugerencias sobre el sistema de diseño, consulta:
- Documentación del proyecto: `CLAUDE.md`
- Guía de contribución: `CONTRIBUTING.md` (si existe)
- Canal de desarrollo del equipo

---

**Última actualización:** 2026-06-22  
**Versión:** 1.1.0  
**Historial de cambios:**
- **v1.1.0** (2026-06-22): Documentación del sistema de diseño cívico para módulos fiscales
- **v1.0.0** (2026-04-14): Versión inicial del sistema de diseño SICODIS
