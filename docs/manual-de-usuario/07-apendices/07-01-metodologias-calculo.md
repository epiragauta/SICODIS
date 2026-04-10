# 7.1 Metodologías de Cálculo

## Contenido
- [7.1.1 Metodologías SGP](#711-metodologías-sgp)
- [7.1.2 Metodologías SGR](#712-metodologías-sgr)
- [7.1.3 Metodologías PGN](#713-metodologías-pgn)

---

## 7.1.1 Metodologías SGP

### 7.1.1.1 Cálculo de la Base del SGP

El Sistema General de Participaciones tiene como base el Impuesto sobre la Renta Certificado por la Contraloria General de la Nación (ICN).

**Fórmula Base:**

```
SGP_Vigencia_t = ICN_t-2 * Factor_Crecimiento
```

Donde:
- **ICN_t-2**: Ingreso Corriente de la Nación certificado por la CGN dos años antes
- **Factor_Crecimiento**: Tasa de crecimiento según normativa vigente

**Ejemplo Vigencia 2024:**
```
ICN_2022 (certificado CGN): $200.000.000 millones
Factor de crecimiento 2024: 4.19%
SGP_2024 = $200.000.000 * 1.0419 = $208.380.000 millones
```

**Distribución porcentual establecida por Ley 715 de 2001:**
- Educación: 58.5%
- Salud: 24.5%
- Agua Potable y Saneamiento Básico: 5.4%
- Propósito General: 11.6%

### 7.1.1.2 Distribución por Componente

#### A. Educación (58.5% del SGP)

**Tipologías y Costos por Estudiante:**

El cálculo se basa en tipologías que clasifican a las entidades territoriales según características socioeconómicas y geográficas.

```
Asignación_Educación_ET = Σ (Estudiantes_Tipología_i * Costo_Estudiante_i)
```

**Clasificación de Tipologías (1 a 6):**

| Tipología | Características | Costo/Estudiante 2024 |
|-----------|----------------|----------------------|
| 1 | Ciudades grandes (>500k hab) | $4.200.000 |
| 2 | Ciudades medianas (100k-500k) | $4.500.000 |
| 3 | Municipios pequeños urbanos | $5.000.000 |
| 4 | Municipios rurales desarrollados | $5.800.000 |
| 5 | Municipios rurales pobres | $6.500.000 |
| 6 | Zonas dispersas/rurales extremas | $7.200.000 |

**Población Atendida vs. Por Atender:**

```
Recursos_Total = Recursos_Población_Atendida + Recursos_Población_Por_Atender

Recursos_Población_Atendida = Matrícula_Oficial * Costo_Estudiante * 0.95
Recursos_Población_Por_Atender = (Población_5_16_años - Matrícula_Oficial) * Costo_Estudiante * 0.05
```

**Ejemplo Municipio Tipología 4:**
```
Matrícula oficial: 5.000 estudiantes
Población 5-16 años: 6.000
Costo por estudiante: $5.800.000

Recursos atendida = 5.000 * $5.800.000 * 0.95 = $27.550.000.000
Recursos por atender = (6.000 - 5.000) * $5.800.000 * 0.05 = $290.000.000
Total = $27.840.000.000
```

**Ajuste por Calidad:**

```
Ajuste_Calidad = Recursos_Base * Factor_Calidad

Factor_Calidad = f(Resultados_Saber, Tasa_Deserción, Tasa_Aprobación)
```

#### B. Salud (24.5% del SGP)

**Régimen Subsidiado (Aseguramiento):**

```
Recursos_Subsidiado = Población_Sisben_Afiliable * UPC_S * Días_Vigencia / 365
```

Donde:
- **UPC-S**: Unidad de Pago por Capitación del Régimen Subsidiado
- **Población_Sisben_Afiliable**: Población clasificada en Sisbén que puede afiliarse

**Valores UPC-S 2024:**
```
UPC-S Promedio Nacional: $1.048.000/año
UPC-S Zonas Rurales Dispersas: $1.153.000/año (10% adicional)
```

**Ejemplo Departamento:**
```
Población afiliable: 1.200.000 personas
UPC-S promedio: $1.048.000

Recursos subsidiado = 1.200.000 * $1.048.000 = $1.257.600.000.000
```

**Salud Pública Colectiva:**

```
Recursos_Salud_Pública = Población_Total_Departamento * Per_Cápita_Salud_Pública

Per_Cápita_2024 = $32.500 por habitante/año
```

**Distribución 60-40:**
- 60% municipios y distritos (per cápita)
- 40% departamentos (per cápita departamental)

#### C. Agua Potable y Saneamiento Básico (5.4% del SGP)

**Criterios de Distribución:**

```
Asignación_APSB_Municipio = (0.50 * Índice_Pobreza) + (0.30 * Índice_Déficit_Cobertura) + (0.20 * Índice_Eficiencia)
```

**Índice de Pobreza:**
```
Índice_Pobreza = (Población_NBI_Municipio / Población_Total_Municipio) / Σ(Población_NBI_Nacional / Población_Total_Nacional)
```

**Índice de Déficit de Cobertura:**
```
Índice_Déficit = [(Población_Sin_Acueducto + Población_Sin_Alcantarillado) / Población_Total] / Σ Nacional
```

**Índice de Eficiencia (Ley 715):**
```
Índice_Eficiencia = f(Proyectos_Viabilizados, Ejecución_Recursos, Cumplimiento_Metas)
```

**Ejemplo Municipio:**
```
Población total: 50.000
Población NBI: 15.000 (30%)
Sin acueducto: 10.000 (20%)
Sin alcantarillado: 12.000 (24%)

Total recursos APSB nacional: $10.000.000.000

Índice_Pobreza_Municipio = 0.30 (representa participación)
Índice_Déficit_Municipio = 0.22
Índice_Eficiencia_Municipio = 0.85

Asignación = $10.000.000.000 * [(0.50*0.30) + (0.30*0.22) + (0.20*0.85)]
            = $10.000.000.000 * [0.15 + 0.066 + 0.17]
            = $386.000.000
```

#### D. Propósito General (11.6% del SGP)

**Fórmula de Distribución:**

```
Asignación_PG = (0.40 * Ponderación_Población) + (0.40 * Ponderación_Pobreza) + (0.10 * Ponderación_Eficiencia_Fiscal) + (0.10 * Ponderación_Eficiencia_Administrativa)
```

**Ponderación por Población:**
```
Ponderación_Población = (Población_ET / Población_Total_Nacional) * Total_Recursos_PG
```

**Ponderación por Pobreza (NBI):**
```
Ponderación_Pobreza = (Población_NBI_ET / Población_NBI_Nacional) * Total_Recursos_PG
```

**Eficiencia Fiscal (Ley 617 de 2000):**

Mide el cumplimiento de los límites de gasto de funcionamiento según categoría municipal.

```
Índice_Eficiencia_Fiscal = f(Cumplimiento_Límites_617, ICLD, Proporción_Gastos_Funcionamiento)
```

**Límites Ley 617/00:**

| Categoría | Límite Gastos Funcionamiento |
|-----------|----------------------------|
| Especial | 50% ICLD |
| 1 | 65% ICLD |
| 2 | 70% ICLD |
| 3 | 70% ICLD |
| 4 | 80% ICLD |
| 5 | 80% ICLD |
| 6 | 80% ICLD |

Donde ICLD = Ingresos Corrientes de Libre Destinación

**Eficiencia Administrativa:**

```
Índice_Eficiencia_Administrativa = f(Gobierno_Digital, Desempeño_Fiscal_DNP, Rendición_Cuentas)
```

**Ejemplo Municipio Categoría 4:**
```
Población: 30.000 (0.06% nacional)
Población NBI: 9.000 (0.08% nacional)
ICLD: $5.000.000.000
Gastos funcionamiento: $3.800.000.000
Límite Ley 617: 80% = $4.000.000.000
Cumplimiento: SÍ (3.800 < 4.000)

Total Recursos PG Nacional: $20.000.000.000.000

Ponderación_Población = 0.0006 * $20.000.000.000.000 = $12.000.000.000
Ponderación_Pobreza = 0.0008 * $20.000.000.000.000 = $16.000.000.000
Ponderación_Eficiencia_Fiscal = 1.0 (cumple) * $20.000.000.000.000 * 0.10 = $2.000.000.000
Ponderación_Eficiencia_Administrativa = 0.85 * $20.000.000.000.000 * 0.10 = $1.700.000.000

Asignación_Total = (0.40 * $12.000.000.000) + (0.40 * $16.000.000.000) + $2.000.000.000 + $1.700.000.000
                  = $4.800.000.000 + $6.400.000.000 + $2.000.000.000 + $1.700.000.000
                  = $14.900.000.000
```

### 7.1.1.3 Cálculo de Doceavas

El SGP se gira mensualmente en doceavas (1/12 del total anual).

**Fórmula Doceava Regular:**

```
Doceava_Mes = Asignación_Anual_Total / 12
```

**Última Doceava (Diciembre):**

La última doceava incluye ajustes por:
- Diferencias en cálculos poblacionales
- Actualizaciones de matrícula educativa
- Ajustes por ejecución presupuestal

```
Última_Doceava = Doceava_Regular + Σ Ajustes_Vigencia
```

**Ejemplo:**
```
Asignación anual municipio: $24.000.000.000

Doceavas enero-noviembre = $24.000.000.000 / 12 = $2.000.000.000/mes

Ajustes diciembre:
+ Ajuste matrícula educación: $150.000.000
+ Ajuste población salud: $80.000.000
- Descuento por incumplimiento: -$50.000.000

Última_Doceava = $2.000.000.000 + $150.000.000 + $80.000.000 - $50.000.000
                = $2.180.000.000
```

### 7.1.1.4 Variables Certificadas

Las variables que determinan las asignaciones deben ser certificadas anualmente por entidades oficiales:

| Variable | Entidad Certificadora | Periodicidad |
|----------|---------------------|--------------|
| Población total | DANE | Anual |
| Población NBI | DANE | Quinquenal (Censo) |
| Matrícula oficial | MEN | Anual (corte octubre) |
| Afiliados régimen subsidiado | MSPS | Mensual |
| Población Sisbén | DNP | Trimestral |
| ICLD | CGN | Anual |

---

## 7.1.2 Metodologías SGR

### 7.1.2.1 Proyección de Ingresos

El Sistema General de Regalías se basa en la producción de recursos naturales no renovables.

**Fórmula General:**

```
Ingresos_SGR = Ingresos_Hidrocarburos + Ingresos_Minería
```

**Ingresos por Hidrocarburos:**

```
Ingresos_HC = Σ (Producción_Campo_i * Precio_Referencia * Tasa_Regalía_i)
```

Donde:
- **Producción_Campo_i**: Barriles producidos por campo
- **Precio_Referencia**: Precio del petróleo (WTI, Brent)
- **Tasa_Regalía_i**: Porcentaje según contrato (varía 8% a 25%)

**Ingresos por Minería:**

```
Ingresos_Minería = Σ (Producción_Mineral_j * Precio_Internacional_j * Tasa_Regalía_j)
```

Principales minerales: Carbón, níquel, oro, esmeraldas, calizas, materiales de construcción.

**Ejemplo Proyección Anual:**
```
Producción petróleo: 750.000 barriles/día
Precio WTI promedio: US$75/barril
Tasa de cambio: $4.000/USD
Tasa regalía promedio: 12%

Ingresos anuales petróleo = 750.000 * 365 * $75 * $4.000 * 0.12
                           = $9.855.000.000.000

Producción carbón: 60.000.000 toneladas/año
Precio internacional: US$85/tonelada
Tasa regalía: 10%

Ingresos anuales carbón = 60.000.000 * $85 * $4.000 * 0.10
                        = $2.040.000.000.000

Total Ingresos SGR proyectados = $11.895.000.000.000
```

### 7.1.2.2 Distribución por Asignación

**Reforma Decreto Ley 1949 de 2023:**

```
Total_SGR = Asignación_Paz + Asignación_Directa_20% + Asignación_Directa_5% + Asignación_Inversión_Local + Asignación_CTI + Asignación_Ambiental + FONPET + Administración_SSEC
```

**Porcentajes de Distribución 2024:**

| Asignación | Porcentaje | Base Cálculo |
|------------|-----------|--------------|
| Paz y Territorios PDET | 25% | Total recaudo |
| Asignaciones Directas 20% | 20% | Total recaudo |
| Asignaciones Directas 5% | 5% | Total recaudo |
| Inversión Local y Regional | 34% | Total recaudo |
| Ciencia, Tecnología e Innovación | 10% | Total recaudo |
| Medio Ambiente | 3% | Total recaudo |
| FONPET (Pensiones Territoriales) | 2% | Total recaudo |
| Administración y SSEC | 1% | Total recaudo |

### 7.1.2.3 Asignaciones Directas (20% + 5%)

**Asignaciones Directas 20%:**

Distribuidas a entidades territoriales productoras según participación en la producción.

```
Asignación_Directa_20%_ET = Total_SGR * 0.20 * (Producción_ET / Producción_Nacional)
```

**Ejemplo Departamento Productor:**
```
Total SGR: $12.000.000.000.000
Producción departamento: 150.000 barriles/día
Producción nacional: 750.000 barriles/día
Participación: 20%

Asignación_20% = $12.000.000.000.000 * 0.20 * 0.20
                = $480.000.000.000
```

**Asignaciones Directas 5%:**

Distribuidas con criterios especiales a productores con énfasis en municipios y áreas de influencia.

```
Asignación_Directa_5%_Municipio = Total_SGR * 0.05 * Ponderación_Producción_Influencia
```

### 7.1.2.4 Asignaciones Étnicas

**Resguardos Indígenas:**

```
Asignación_Resguardo = Asignación_Directa_ET * (Población_Resguardo / Población_Total_ET)
```

Las asignaciones se entregan a las autoridades indígenas para proyectos en sus territorios.

**Comunidades Negras:**

```
Asignación_Comunidad_Negra = Asignación_Directa_ET * (Población_Comunidad / Población_Total_ET)
```

Distribuidas a consejos comunitarios titulados colectivamente.

**Ejemplo:**
```
Asignación directa municipio: $50.000.000.000
Población total municipio: 100.000
Población resguardo indígena: 15.000

Asignación_Resguardo = $50.000.000.000 * (15.000 / 100.000)
                     = $50.000.000.000 * 0.15
                     = $7.500.000.000
```

### 7.1.2.5 Plan Bienal de Caja (PBC)

El PBC es la proyección de ingresos y distribución del SGR para cada bienio.

**Fórmula PBC:**

```
PBC_Bienio = Proyección_Ingresos_Año1 + Proyección_Ingresos_Año2 + Saldo_Bienio_Anterior
```

**Componentes:**
- Proyección de producción (ANH, ANM)
- Proyección de precios internacionales
- Tasa de cambio proyectada
- Saldos no ejecutados del bienio anterior

**Ejemplo PBC 2025-2026:**
```
Proyección 2025: $11.500.000.000.000
Proyección 2026: $12.200.000.000.000
Saldos bienio 2023-2024: $800.000.000.000

PBC_2025-2026 = $11.500.000.000.000 + $12.200.000.000.000 + $800.000.000.000
               = $24.500.000.000.000
```

**Distribución Bienal:**

Cada asignación recibe su porcentaje del PBC total:
```
Recursos_Asignación_Bienio = PBC_Total * Porcentaje_Asignación
```

### 7.1.2.6 Plan de Recursos (10 años)

El Plan de Recursos es la proyección a 10 años de los ingresos del SGR.

**Metodología:**

1. **Proyección de Producción:** Curvas de declinación de campos, nuevos descubrimientos, inversión exploratoria
2. **Proyección de Precios:** Análisis de mercados internacionales, tendencias energéticas
3. **Proyección Cambiaria:** Modelos macroeconómicos
4. **Escenarios:** Optimista, medio, pesimista

```
Plan_Recursos_Año_i = Producción_Proyectada_i * Precio_Proyectado_i * TC_Proyectada_i * Tasa_Regalía_Promedio
```

**Ejemplo Proyección Año 5:**
```
Producción proyectada: 680.000 barriles/día
Precio WTI proyectado: US$80/barril
TC proyectada: $4.200/USD
Tasa regalía promedio: 12%

Ingresos_Año_5 = 680.000 * 365 * $80 * $4.200 * 0.12
                = $9.968.832.000.000 (aproximadamente $10 billones)
```

### 7.1.2.7 Clasificación Aforado vs No Aforado

**Entidades Aforadas:**

Municipios y departamentos con asignaciones directas garantizadas por producción en su territorio.

```
Condición_Aforado: Producción_Territorial > 0
```

Reciben recursos predecibles basados en producción histórica y proyectada.

**Entidades No Aforadas:**

Territorios sin producción que acceden a recursos SGR mediante proyectos aprobados por OCAD.

```
Recursos_No_Aforado = Proyectos_Aprobados_OCAD
```

**Distribución Inversión Regional (34%):**

```
Inversión_Regional = Total_SGR * 0.34

Distribución:
- 60% según población y NBI
- 40% según proyectos aprobados en OCAD
```

### 7.1.2.8 Distribución Minería vs Hidrocarburos

**Trazabilidad por Fuente:**

```
Total_Hidrocarburos = Σ Regalías_Petróleo + Regalías_Gas
Total_Minería = Σ Regalías_Carbón + Regalías_Oro + Regalías_Níquel + Otras_Regalías_Minerales
```

**Ejemplo Distribución:**
```
Total recaudo anual: $12.000.000.000.000

Hidrocarburos:
- Petróleo: $9.000.000.000.000 (75%)
- Gas: $1.500.000.000.000 (12.5%)
Subtotal HC: $10.500.000.000.000 (87.5%)

Minería:
- Carbón: $1.200.000.000.000 (10%)
- Oro: $200.000.000.000 (1.67%)
- Níquel: $100.000.000.000 (0.83%)
Subtotal Minería: $1.500.000.000.000 (12.5%)
```

---

## 7.1.3 Metodologías PGN

### 7.1.3.1 Metodología de Regionalización

La regionalización del Presupuesto General de la Nación identifica qué recursos se ejecutan en cada departamento.

**Clasificación de Recursos:**

```
PGN_Total = Gasto_Regionalizado + Gasto_Nacional + Por_Regionalizar
```

**Gasto Regionalizado:**

Recursos identificables por departamento de ejecución (inversión territorial).

```
Gasto_Regionalizado_Depto = Σ Proyectos_Inversión_Identificados_Geográficamente
```

**Gasto Nacional:**

Recursos que benefician al país sin asignación territorial específica (defensa, relaciones exteriores, deuda pública).

**Por Regionalizar:**

Recursos no identificados geográficamente al momento del reporte (programas en formulación).

**Ejemplo Presupuesto 2024:**
```
PGN Total: $502.000.000.000.000

Regionalizado: $180.000.000.000.000 (35.9%)
Nacional: $280.000.000.000.000 (55.8%)
Por Regionalizar: $42.000.000.000.000 (8.3%)
```

### 7.1.3.2 Cálculo Per Cápita por Departamento

```
Per_Cápita_Departamento = Gasto_Regionalizado_Departamento / Población_Departamento
```

Este indicador permite comparar la inversión nacional por habitante entre departamentos.

**Ejemplo Departamento:**
```
Gasto regionalizado Antioquia: $12.500.000.000.000
Población Antioquia: 6.600.000 habitantes

Per_Cápita_Antioquia = $12.500.000.000.000 / 6.600.000
                      = $1.893.939 por habitante

Gasto regionalizado Guainía: $180.000.000.000
Población Guainía: 49.000 habitantes

Per_Cápita_Guainía = $180.000.000.000 / 49.000
                    = $3.673.469 por habitante
```

### 7.1.3.3 Cálculo del Ciclo de Ejecución Presupuestal

**Fases del Presupuesto:**

```
Apropiación → Compromiso → Obligación → Pago
```

**Apropiación:**

Autorización máxima de gasto aprobada por el Congreso en la Ley Anual de Presupuesto.

```
Apropiación_Total = Σ Apropiación_por_Rubro
```

**Compromiso:**

Afectación del presupuesto mediante acto administrativo (contrato, convenio, resolución).

```
%_Compromiso = (Compromisos_Acumulados / Apropiación_Total) * 100
```

**Obligación:**

Monto adeudado por bienes o servicios efectivamente recibidos.

```
%_Obligación = (Obligaciones_Acumuladas / Apropiación_Total) * 100
```

**Pago:**

Desembolso efectivo de recursos.

```
%_Pago = (Pagos_Realizados / Apropiación_Total) * 100
```

**Ejemplo Proyecto:**
```
Apropiación: $1.000.000.000

Al 30 de septiembre:
- Compromisos: $850.000.000 (85%)
- Obligaciones: $620.000.000 (62%)
- Pagos: $480.000.000 (48%)

Indicadores de ejecución:
- Comprometido: 85%
- Obligado: 62%
- Pagado: 48%
```

### 7.1.3.4 Indicadores de Cumplimiento

**Eficacia en la Ejecución:**

```
Eficacia_Compromiso = (Compromisos / Apropiación) * 100
```

Meta institucional: ≥ 90% al cierre de vigencia

**Eficiencia en la Ejecución:**

```
Eficiencia = (Pagos / Obligaciones) * 100
```

Meta institucional: ≥ 95% al cierre de vigencia

**Ejemplo Sectorial:**
```
Sector Transporte - Vigencia 2024:

Apropiación: $15.000.000.000.000
Compromisos: $14.100.000.000.000
Obligaciones: $12.800.000.000.000
Pagos: $11.500.000.000.000

Eficacia_Compromiso = (14.100 / 15.000) * 100 = 94%
Eficacia_Obligación = (12.800 / 15.000) * 100 = 85.3%
Eficiencia_Pago = (11.500 / 12.800) * 100 = 89.8%

Análisis: Buen nivel de compromiso (94%), pero puede mejorar la conversión a obligaciones y pagos.
```

### 7.1.3.5 Asignación Sectorial

**Distribución por Sectores:**

```
PGN_Total = Σ Asignación_Sector_i
```

**Principales Sectores (2024):**

| Sector | Apropiación | % PGN |
|--------|-------------|-------|
| Deuda Pública | $78.000.000.000.000 | 15.5% |
| Educación | $52.000.000.000.000 | 10.4% |
| Defensa y Policía | $48.000.000.000.000 | 9.6% |
| Salud | $38.000.000.000.000 | 7.6% |
| Trabajo | $35.000.000.000.000 | 7.0% |
| Transporte | $32.000.000.000.000 | 6.4% |
| Inclusión Social | $28.000.000.000.000 | 5.6% |
| Otros | $191.000.000.000.000 | 38.0% |

**Cálculo Participación Sectorial:**

```
Participación_Sector = (Apropiación_Sector / PGN_Total) * 100
```

### 7.1.3.6 Regionalización por Sectores

**Metodología:**

Cada sector reporta la distribución territorial de sus proyectos de inversión.

```
Regionalización_Sector_Depto = Σ Proyectos_Sector_en_Departamento
```

**Ejemplo Sector Transporte:**
```
Total Sector Transporte: $32.000.000.000.000

Distribución territorial:
- Antioquia: $3.800.000.000.000 (11.9%)
- Valle del Cauca: $2.900.000.000.000 (9.1%)
- Cundinamarca: $2.600.000.000.000 (8.1%)
- Atlántico: $2.100.000.000.000 (6.6%)
- Nacional: $15.200.000.000.000 (47.5%)
- Por regionalizar: $5.400.000.000.000 (16.9%)
```

### 7.1.3.7 Rezagos Presupuestales

**Reservas Presupuestales:**

Compromisos del año vigente no pagados al cierre que se trasladan al año siguiente.

```
Reservas_Vigencia_t = Compromisos_Vigencia_t - Pagos_Vigencia_t
```

**Cuentas por Pagar:**

Obligaciones de vigencias anteriores pendientes de pago.

```
Cuentas_por_Pagar = Obligaciones_Anteriores - Pagos_Realizados
```

**Ejemplo:**
```
Vigencia 2024 - Sector Vivienda:

Compromisos 2024: $5.000.000.000.000
Pagos realizados en 2024: $4.200.000.000.000
Reservas a constituir = $5.000.000.000.000 - $4.200.000.000.000
                      = $800.000.000.000

Estas reservas se pagarán en 2025 con recursos de ese año.
```

---

## Resumen de Fórmulas Clave

### SGP
```
SGP_Total = ICN_t-2 * Factor_Crecimiento

Educación = SGP * 0.585 = f(Tipología, Matrícula, Costo_Estudiante)
Salud = SGP * 0.245 = f(Población_Afiliable, UPC-S)
Agua = SGP * 0.054 = f(Pobreza, Déficit_Cobertura, Eficiencia)
Propósito_General = SGP * 0.116 = f(Población, Pobreza, Eficiencia_Fiscal, Eficiencia_Administrativa)

Doceava = Asignación_Anual / 12
```

### SGR
```
Ingresos_SGR = (Producción * Precio * TC * Tasa_Regalía)

Distribución:
- Paz: 25%
- Directas 20%: 20%
- Directas 5%: 5%
- Inversión Local: 34%
- CTI: 10%
- Ambiental: 3%
- FONPET: 2%
- Administración: 1%

PBC_Bienio = Proyección_Año1 + Proyección_Año2 + Saldos
```

### PGN
```
PGN = Regionalizado + Nacional + Por_Regionalizar

Per_Cápita = Gasto_Regionalizado_Depto / Población_Depto

Ciclo: Apropiación → Compromiso → Obligación → Pago

Eficacia = (Ejecutado / Apropiación) * 100
Eficiencia = (Pagos / Obligaciones) * 100
```

---

**Nota:** Todas las fórmulas y valores presentados corresponden a la normativa vigente a 2024. Los porcentajes, costos por estudiante, UPC-S y demás parámetros son actualizados anualmente mediante decretos del Gobierno Nacional. Consulte la normativa vigente para cada año específico en la sección de Normatividad (Capítulo 7.3).
