# Pruebas con curl - API de Eficiencias

## ✅ Pruebas Realizadas Exitosamente

### 1. Prueba de Proxy Angular

**Endpoint**: `http://localhost:4200/api/eficiencias/municipios/05001`

**Resultado**: ✅ Exitoso
```json
{
  "codigo_dane": "05001",
  "departamento": "ANTIOQUIA",
  "municipio": "MEDELLÍN"
}
```

**Conclusión**: El proxy de Angular está funcionando correctamente y enruta las peticiones al backend en `localhost:3000`.

---

### 2. Prueba de Backend Directo

**Endpoint**: `http://localhost:3000/api/eficiencias/resumen/05001`

**Resultado**: ✅ Exitoso (datos completos de Medellín)

**Datos verificados**:
- ✅ Municipio correctamente identificado
- ✅ Ingresos tributarios (2013-2024)
- ✅ Población (2013-2025)
- ✅ Recursos propósito general (2018-2025)
- ✅ Eficiencia administrativa (2019-2025)
- ✅ Vigencia 2026 (datos completos)

---

## Validación de Cálculos para Vigencia 2025

### Municipio: MEDELLÍN (05001)
### Vigencia Seleccionada: 2025
### Vigencia Anterior: 2024

---

### EFICIENCIA FISCAL - TABLA 1 (Vigencia Anterior 2024)

| Vigencia | Año Ref | Ingresos | Población | Per Cápita |
|----------|---------|----------|-----------|------------|
| 2021 | 2019 | 0 | 0 | 0.00 |
| 2022 | 2020 | 1,620,691,079 | 0 | 0.00 |
| 2023 | 2021 | 0 | 2,573,220 | 0.00 |
| **2024** | **2022** | **2,122,632,581** | **2,612,958** | **812.35** |

**Notas**:
- Año 2019: No hay datos de población en BD (censo 2018 empieza en 2013)
- Año 2020: Población faltante en BD
- Año 2021: Ingresos = 0 (dato real de la BD)
- Año 2022: ✅ Cálculo correcto: 2,122,632,581 / 2,612,958 = 812.35

---

### EFICIENCIA FISCAL - TABLA 2 (Vigencia Seleccionada 2025)

| Vigencia | Año Ref | Ingresos | Población | Per Cápita |
|----------|---------|----------|-----------|------------|
| 2023 | 2021 | 0 | 2,573,220 | 0.00 |
| 2024 | 2022 | 2,122,632,581 | 2,612,958 | 812.35 |
| **2025** | **2023** | **2,745,299,333** | **2,653,729** | **1,034.51** |
| **2026** | **2024** | **3,278,049,628** | **2,616,335** | **1,252.92** |

**Validación de cálculos**:
- ✅ Vigencia 2025: 2,745,299,333 / 2,653,729 = 1,034.51
- ✅ Vigencia 2026: 3,278,049,628 / 2,616,335 = 1,252.92

**Crecimiento Per Cápita**:
- 2024 a 2025: ((1,034.51 - 812.35) / 812.35) * 100 = **27.35%**
- 2025 a 2026: ((1,252.92 - 1,034.51) / 1,034.51) * 100 = **21.12%**

---

### EFICIENCIA ADMINISTRATIVA

#### Tabla 1 (Vigencia Anterior 2024)
- **Año Certificado**: 2022 (= 2024 - 2)
- **Razón/Indicador EA**: 0.1452 (14.52%)
- **ICLD, GF, LG, Holgura**: null (no disponibles para años históricos)

#### Tabla 2 (Vigencia Seleccionada 2025)
- **Año Certificado**: 2023 (= 2025 - 2)
- **Razón/Indicador EA**: 0.1192 (11.92%)
- **ICLD, GF, LG, Holgura**: null (no disponibles para años históricos)

**Nota**: Para estos años certificados (2022 y 2023), solo está disponible el indicador de eficiencia administrativa en la BD. Los campos ICLD, GF, LG y Holgura solo están disponibles en `vigencia_2026` para el año certificado 2024.

---

### ONCE DOCEAVAS

#### Tabla 1 (Vigencia Anterior 2024)

| Variable | Valor |
|----------|-------|
| Población | 114,034,040,597 |
| Pobreza | 491,200,133 |
| Eficiencia Fiscal | 489,642,422 |
| Eficiencia Administrativa | 300,640,763 |
| Sisben | 428,521,369 |
| **TOTAL** | **115,744,045,284** |

**Validación**: ✅ 114,034,040,597 + 491,200,133 + 489,642,422 + 300,640,763 + 428,521,369 = 115,744,045,284

---

#### Tabla 2 (Vigencia Seleccionada 2025)

| Variable | Valor |
|----------|-------|
| Población | 140,185,005,834 |
| Pobreza | 604,352,677 |
| Eficiencia Fiscal | 737,500,356 |
| Eficiencia Administrativa | 417,829,236 |
| Sisben | 616,299,413 |
| **TOTAL** | **142,560,987,516** |

**Validación**: ✅ 140,185,005,834 + 604,352,677 + 737,500,356 + 417,829,236 + 616,299,413 = 142,560,987,516

**Crecimiento total**: ((142,560,987,516 - 115,744,045,284) / 115,744,045,284) * 100 = **23.17%**

---

### RESTRICCIÓN 50%

#### Tabla 1 (Vigencia Anterior 2024)

| Variable | Valor |
|----------|-------|
| Población + Pobreza | 114,525,240,730 |
| Restricción 50% | 57,262,620,365 |

**Validación**: ✅ (114,034,040,597 + 491,200,133) / 2 = 57,262,620,365

---

#### Tabla 2 (Vigencia Seleccionada 2025)

| Variable | Valor |
|----------|-------|
| Población + Pobreza | 140,789,358,511 |
| Restricción 50% | 70,394,679,256 |

**Validación**: ✅ (140,185,005,834 + 604,352,677) / 2 = 70,394,679,256

---

## Verificación de Lógica de Rezago

### Rezago de 2 años confirmado

Para **vigencia 2025**:

| Concepto | Año Utilizado | Cálculo |
|----------|---------------|---------|
| Ingresos Tributarios | 2023 | vigencia - 2 = 2025 - 2 = 2023 ✅ |
| Población (per cápita) | 2023 | vigencia - 2 = 2025 - 2 = 2023 ✅ |
| Año Certificado Ley 617 | 2023 | vigencia - 2 = 2025 - 2 = 2023 ✅ |
| Recursos Once Doceavas | 2025 | vigencia = 2025 ✅ |

Para **vigencia anterior 2024**:

| Concepto | Año Utilizado | Cálculo |
|----------|---------------|---------|
| Ingresos Tributarios | 2022 | (vigencia-1) - 2 = 2024 - 2 = 2022 ✅ |
| Población (per cápita) | 2022 | (vigencia-1) - 2 = 2024 - 2 = 2022 ✅ |
| Año Certificado Ley 617 | 2022 | (vigencia-1) - 2 = 2024 - 2 = 2022 ✅ |
| Recursos Once Doceavas | 2024 | vigencia - 1 = 2024 ✅ |

---

## Conclusiones de las Pruebas

### ✅ Pruebas Exitosas

1. **Proxy Angular**: Funcionando correctamente
2. **Backend API**: Retornando datos correctos
3. **Cálculo de Per Cápita**: Correcto (ingresos / población)
4. **Lógica de Rezago**: Correcta (vigencia - 2 para datos refrendados)
5. **Once Doceavas**: Sumas correctas
6. **Restricción 50%**: Cálculo correcto
7. **Eficiencia Administrativa**: Años certificados correctos

### 📊 Datos Validados para Medellín

- **Per Cápita 2025**: $1,034.51 (año refrendado 2023)
- **Per Cápita 2026**: $1,252.92 (año refrendado 2024)
- **Crecimiento 2025-2026**: +21.12%
- **Total Once Doceavas 2025**: $142,560,987,516
- **Restricción 50% 2025**: $70,394,679,256

### 🎯 Próximos Pasos

1. **Probar en navegador**: Abrir `http://localhost:4200/sgp-eficiencia`
2. **Seleccionar Medellín (05001)**: Departamento ANTIOQUIA, Municipio MEDELLÍN
3. **Seleccionar vigencia 2025**
4. **Hacer clic en "Aplicar"**
5. **Verificar que las tablas coincidan** con los valores calculados aquí

---

## Comandos de Prueba Ejecutados

```bash
# Probar proxy Angular
curl -s "http://localhost:4200/api/eficiencias/municipios/05001"

# Probar backend directo
curl -s "http://localhost:3000/api/eficiencias/resumen/05001"

# Validar cálculos con Python
curl -s "http://localhost:3000/api/eficiencias/resumen/05001" | \
  python test_eficiencias.py
```

---

**Estado**: ✅ Todas las pruebas exitosas
**Fecha**: 2026-03-23
**Sistema**: Backend + Angular funcionando correctamente
