# Requerimiento de backend — Estado "Ley 550" en la ficha de Eficiencias (SGP Propósito General)

**Componente afectado:** `src/app/components/sgp-eficiencias`
**Endpoint:** `GET /api/eficiencias/resumen/{codigoDane}` (backend local `http://localhost:3000`; en producción `sicodis.dnp.gov.co`)
**Fecha:** 2026-09-29
**Origen:** Observación de revisión — *"En el caso de que el municipio esté en Ley 550 no se menciona en la ficha; hay municipios con indicadores negativos que igual reciben recursos por estos conceptos."*

## 1. Qué se necesita

Agregar al objeto `ResumenMunicipioEficiencia` dos banderas booleanas (por indicador):

```jsonc
{
  // ... campos actuales ...
  "ley_550_eficiencia_fiscal": true,
  "ley_550_eficiencia_administrativa": false
}
```

Semántica: la entidad territorial cuenta con **concepto favorable del Ministerio de Hacienda y Crédito
Público (MHCP)** sobre el cumplimiento de un **Acuerdo de Reestructuración de Pasivos (Ley 550 de 1999)**
y/o **Programa de Saneamiento Fiscal y Financiero**. En ese caso, para la distribución de los recursos de
eficiencia se le asigna el **promedio nacional** del respectivo indicador (art. 23 de la Ley 1176 de 2007,
Condición 2), lo que explica que reciba recursos aun con indicadores propios negativos.

> El frontend ya está preparado para consumir estos campos (interfaz `ResumenMunicipioEficiencia` +
> aviso condicional en la ficha). **Mientras el backend no los envíe**, el componente usa como
> respaldo la tabla estática `src/app/data/ley550-eficiencias.ts` (extraída del Excel con la misma
> lógica descrita abajo). Cuando el backend provea los campos, estos tienen prioridad y la tabla
> estática puede eliminarse.

## 2. De dónde sale el dato (fuente de verdad)

Archivo: `src/assets/db/Eficiencias Propósito General_2026_v_0.2.xlsx`, hoja **`Comparativa`**.
La ficha del Excel lo calcula por fórmula (celdas K9/K17 para EF y K29 para EA):

```
= IF( <indicador de la ET para el año> = <promedio nacional del año>, "SI", "NO" )
```

Es decir: cuando el indicador almacenado del municipio **coincide exactamente** con el promedio nacional
de ese año, significa que fue reemplazado por el promedio nacional → la ET está en Ley 550 ("SI").

La tabla de **promedios nacionales por año** está en la hoja `Indicadores_Ley 550`, filas 1110–1117
(actualmente **no** se migra a SQLite):

| Año  | Promedio nacional EF | Promedio nacional EA |
|------|----------------------|----------------------|
| 2019 | 2.0325324073080084   | 0.24920682195411956  |
| 2020 | 0.2770066710502865   | 0.23686965711131625  |
| 2021 | 0.28982126162247984  | 0.2521213428229073   |
| 2022 | 0.23881485830982407  | 0.2714974904506233   |
| 2023 | 0.22385260214431468  | 0.28353498751128725  |
| 2024 | 0.19847783638004182  | 0.27792822798885414  |
| 2025 | 0.26356364657266407  | 0.27703527168732067  |
| 2026 | 0.20984451414273253  | 0.28682889908256864  |

## 3. Implementación sugerida en el pipeline (`scripts/db`)

1. **Esquema** (`create_schema.sql`): nueva tabla de referencia
   ```sql
   CREATE TABLE IF NOT EXISTS promedio_nacional_eficiencia (
     anio INTEGER PRIMARY KEY,
     eficiencia_fiscal REAL,
     eficiencia_administrativa REAL
   );
   ```
2. **Migración** (`migrate_data.py`): poblar esa tabla desde `Indicadores_Ley 550` (filas 1110–1117).
3. **Backend `/api/eficiencias/resumen/{dane}`**: por el año de referencia de la vigencia consultada,
   comparar `indicadores_eficiencia_fiscal.valor` (y `..._administrativa`) del municipio contra el
   promedio nacional del año. Si son iguales (con tolerancia de punto flotante, p. ej. `abs(a-b) < 1e-6`),
   marcar la bandera correspondiente en `true`.

   > Nota: comparar por igualdad es el método que usa el Excel hoy. Si el MHCP entrega una **lista oficial**
   > de ET en Ley 550, es preferible usar esa lista (tabla `municipios_ley_550(codigo_dane, anio)`) en lugar
   > de la heurística por coincidencia con el promedio nacional.

## 4. Observaciones relacionadas ya resueltas en el frontend (sin backend)

- **Bolsa del 17%** (menores de 25 mil habitantes): se resolvió en el componente usando los campos
  `recursos_proposito_general[].poblacion_m` y `.pobreza_m`, que **ya vienen en la respuesta actual** del
  endpoint. No requiere cambios de backend.
- **Unidades y siglas de las notas**: tomadas de las hojas `Instrucciones` y `Comparativa` del Excel.
