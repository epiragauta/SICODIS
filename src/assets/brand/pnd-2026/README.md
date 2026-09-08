# Marca — Imagen institucional PND 2026–2030

Recursos extraídos de **`DOCS/2026-09-Instruccion-Interna.pptx`** (DNP) para aplicar la
nueva imagen institucional del Plan Nacional de Desarrollo 2026–2030 en SICODIS.

- **Guía de identidad visual (paleta, tipografía, iconografía):**
  `docs/marca-pnd-2026/guia-identidad-visual-pnd-2026.html`
- **Design tokens (SCSS/CSS variables):** `src/assets/styles/pnd-2026-tokens.scss`

## Resumen de la identidad

| Dimensión | Valores |
|-----------|---------|
| **Color ancla** | Azul petróleo `#015787` |
| **Acento** | Turquesa `#02ACBC` · Cian `#44CDD0` |
| **Bandera / semántico** | Ámbar `#FDBB02` · Rojo `#CB0023` |
| **Neutros** | Tinta `#182430` · Texto `#3A3A3A` · Superficie `#F7F5F5` |
| **Tipografía titulares/cuerpo** | **Poppins** (300 / 400 / 600 / 900) |
| **Tipografía datos/etiquetas** | **Space Grotesk** (500) |
| **Iconografía** | Vectorial plana, monocroma, ~54×54, de una sola tinta (tintable) |

> El archivo original trae el tema base de Office (**Aptos**); **no** es institucional.

## Estructura de carpetas

```
src/assets/brand/pnd-2026/
├── logos/      Logotipos institucionales (DNP, PiiP, Sinergia) + wordmarks vectoriales
├── icons/      35 íconos (SVG monocromos + PNG pequeños), tintables con la paleta
├── graphics/   Elementos infográficos decorativos (tarjetas, pasos, ilustraciones)
└── photos/     Fotografías/fondos 16:9 (equipos de trabajo, con tratamiento de bandera)
```

### logos/
| Archivo | Contenido |
|---------|-----------|
| `logo-dnp.png` | Escudo DNP + barra tricolor |
| `logo-piip.png` | Plataforma Integrada de Inversión Pública |
| `logo-sinergia.png` | Sinergia — Incidiendo con evidencia |
| `bandera-colombia.png` | Bandera ondeante (recurso de fondo/hero) |
| `wordmark-10/11.svg`, `logo-institucional-25/26/27.svg` | Wordmarks vectoriales |

## Notas de uso

- Usa los **tokens semánticos** (`--pnd-color-primary`, `--pnd-color-accent`, …) en los
  componentes, no los colores crudos.
- Los íconos SVG son monocromos: recolorea con `fill: currentColor` / `color:` para
  adaptarlos al fondo (azul sobre blanco, blanco sobre azul).
- Las fotos son pesadas (1–2.7 MB). Se sirven como estáticos (no entran al bundle JS),
  pero conviene optimizarlas (WebP/compresión) antes de un uso masivo.
- La clasificación de `icons/` vs `graphics/` es *best-effort* según dimensiones y color.

_Extracción: 2026-09-04._
