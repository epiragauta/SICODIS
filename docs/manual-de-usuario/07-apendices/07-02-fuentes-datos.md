# 7.2 Fuentes de Datos

## Contenido
- [7.2.1 Fuentes de Datos SGP](#721-fuentes-de-datos-sgp)
- [7.2.2 Fuentes de Datos SGR](#722-fuentes-de-datos-sgr)
- [7.2.3 Fuentes de Datos PGN](#723-fuentes-de-datos-pgn)
- [7.2.4 Frecuencias de Actualización](#724-frecuencias-de-actualización)
- [7.2.5 Procesos de Validación](#725-procesos-de-validación)

---

## 7.2.1 Fuentes de Datos SGP

### 7.2.1.1 Contraloría General de la República (CGN)

**Entidad:** Contraloría General de la República
**Sitio web:** https://www.contraloria.gov.co

**Datos Suministrados:**

1. **Ingreso Corriente de la Nación (ICN)**
   - Certificación anual del ICN que constituye la base del SGP
   - Recaudo de impuestos nacionales (renta, IVA, timbre, patrimonio)
   - Ingresos no tributarios
   - Recursos de capital

2. **Transferencias SGP Ejecutadas**
   - Giros mensuales por componente (Educación, Salud, Agua, Propósito General)
   - Distribución territorial de recursos
   - Ejecución presupuestal de entidades territoriales

3. **Sistema Consolidador de Hacienda e Información Financiera Pública (CHIP)**
   - Ejecución presupuestal de ingresos y gastos territoriales
   - Balance general de entidades territoriales
   - Indicadores fiscales

**Periodicidad:** Anual (ICN), Mensual (transferencias), Trimestral (CHIP)

**Formato de Entrega:** Bases de datos relacionales, archivos Excel, consultas web

**Contacto:** chip@contraloria.gov.co

---

### 7.2.1.2 Departamento Administrativo Nacional de Estadística (DANE)

**Entidad:** Departamento Administrativo Nacional de Estadística
**Sitio web:** https://www.dane.gov.co

**Datos Suministrados:**

1. **Proyecciones de Población**
   - Proyecciones de población total por departamento y municipio
   - Desagregación por área (cabecera, resto)
   - Grupos etarios (0-4, 5-16, 17-64, 65+)
   - Proyecciones intercensales y poscensales

2. **Censo Nacional de Población y Vivienda**
   - Población censada por territorio
   - Necesidades Básicas Insatisfechas (NBI)
   - Indicadores de pobreza multidimensional
   - Vivienda y servicios públicos

3. **Índice de Necesidades Básicas Insatisfechas (NBI)**
   - Viviendas inadecuadas
   - Viviendas con hacinamiento crítico
   - Viviendas con servicios inadecuados
   - Viviendas con alta dependencia económica
   - Viviendas con niños en edad escolar que no asisten a la escuela

4. **Estadísticas Vitales**
   - Nacimientos por municipio
   - Defunciones por edad y territorio
   - Tasas de natalidad y mortalidad

**Periodicidad:**
- Proyecciones: Anual
- Censo: Decenal (último 2018)
- NBI: Quinquenal
- Estadísticas vitales: Anual

**Formato de Entrega:** Bases de datos descargables, servicios web, API REST

**Contacto:** contacto@dane.gov.co

**Microdatos Censo 2018:** https://microdatos.dane.gov.co

---

### 7.2.1.3 Ministerio de Educación Nacional (MEN)

**Entidad:** Ministerio de Educación Nacional
**Sitio web:** https://www.mineducacion.gov.co

**Datos Suministrados:**

1. **Sistema Integrado de Matrícula (SIMAT)**
   - Matrícula oficial por entidad territorial certificada
   - Desagregación por nivel educativo (preescolar, básica primaria, secundaria, media)
   - Sector (oficial, contratado)
   - Zona (urbana, rural)
   - Modalidad (presencial, virtual)

2. **Certificación Anual de Matrícula**
   - Matrícula validada para distribución SGP Educación
   - Corte oficial: 31 de octubre de cada año
   - Certificación por secretarías de educación

3. **Tipologías de Entidades Territoriales**
   - Clasificación de municipios y departamentos (Tipología 1 a 6)
   - Asignación de costos por estudiante según tipología
   - Actualización anual mediante resolución MEN

4. **Sistema Nacional de Información de Educación Básica (SINEB)**
   - Estadísticas educativas
   - Deserción escolar
   - Aprobación y reprobación
   - Resultados pruebas Saber

**Periodicidad:** Anual (corte octubre), Mensual (SIMAT actualizaciones)

**Formato de Entrega:** SIMAT (consulta web), archivos certificados Excel/PDF

**Contacto:** atencionalciudadano@mineducacion.gov.co

**Acceso SIMAT:** https://www.sistemamatriculas.gov.co

---

### 7.2.1.4 Ministerio de Salud y Protección Social (MSPS)

**Entidad:** Ministerio de Salud y Protección Social
**Sitio web:** https://www.minsalud.gov.co

**Datos Suministrados:**

1. **Registro de Afiliados al Sistema General de Seguridad Social en Salud (BDUA)**
   - Base de Datos Única de Afiliados
   - Afiliados régimen subsidiado por departamento y municipio
   - Afiliados régimen contributivo
   - Movilidad entre regímenes

2. **Unidad de Pago por Capitación (UPC)**
   - UPC-S (Régimen Subsidiado) por grupos etarios
   - UPC-C (Régimen Contributivo)
   - Ajustes diferenciales (zona, riesgo)
   - Actualización anual mediante resolución

3. **Sistema de Identificación de Potenciales Beneficiarios (SISBEN)**
   - Población clasificada por niveles SISBEN
   - Población potencial régimen subsidiado
   - Focalización de subsidios

4. **Per Cápita Salud Pública**
   - Valor per cápita anual para salud pública colectiva
   - Distribución 60% municipios - 40% departamentos

**Periodicidad:** Mensual (BDUA), Anual (UPC, per cápita), Trimestral (SISBEN)

**Formato de Entrega:** Bases de datos descargables, servicios BDUA, resoluciones oficiales

**Contacto:** atencionalciudadano@minsalud.gov.co

**Consulta BDUA:** https://www.adres.gov.co/BDUA

---

### 7.2.1.5 Departamento Nacional de Planeación (DNP)

**Entidad:** Departamento Nacional de Planeación
**Sitio web:** https://www.dnp.gov.co

**Datos Suministrados:**

1. **Sistema de Distribución de Participaciones (SICODIS)**
   - Distribuciones certificadas SGP por componente
   - Histórico de asignaciones territoriales
   - Cálculos de distribución anual

2. **Sistema de Presupuesto y Giro de Participaciones (SPGF)**
   - Giros mensuales (doceavas)
   - Saldos de asignaciones
   - Ajustes y descuentos

3. **Índice de Desempeño Fiscal (IDF)**
   - Indicadores de gestión fiscal municipal y departamental
   - Autofinanciación de gastos de funcionamiento
   - Generación de recursos propios
   - Capacidad de ahorro

4. **Sistema de Identificación de Potenciales Beneficiarios (SISBEN IV)**
   - Administración del SISBEN
   - Clasificación socioeconómica de hogares
   - Población beneficiaria de programas sociales

5. **Certificación de Variables SGP**
   - Decreto anual de distribución SGP
   - Variables certificadas por entidad competente
   - Metodología de cálculo actualizada

**Periodicidad:** Anual (decreto distribución), Mensual (giros), Trimestral (IDF)

**Formato de Entrega:** Portal SICODIS, archivos Excel, consultas web, API

**Contacto:** contactociudadano@dnp.gov.co

**Portal SICODIS:** https://sicodis.dnp.gov.co

---

### 7.2.1.6 Tabla de Variables Certificadas SGP

| Variable | Entidad Certificadora | Periodicidad | Resolución/Documento | Uso en SGP |
|----------|----------------------|--------------|---------------------|------------|
| Ingreso Corriente de la Nación (ICN) | CGR | Anual | Certificación CGR | Base total SGP |
| Población total | DANE | Anual | Proyecciones DANE | Propósito General, Agua |
| Población NBI | DANE | Quinquenal | Censo DANE | Propósito General, Agua |
| Matrícula oficial | MEN | Anual (octubre) | Resolución MEN | Educación |
| Tipología territorial | MEN | Anual | Resolución MEN | Educación |
| Afiliados régimen subsidiado | MSPS | Mensual | BDUA ADRES | Salud |
| UPC-S | MSPS | Anual | Resolución MSPS | Salud |
| Per cápita salud pública | MSPS | Anual | Resolución MSPS | Salud |
| Población SISBEN | DNP | Trimestral | Reportes SISBEN | Salud, Propósito General |
| ICLD (Ingresos Corrientes Libre Destinación) | CGN | Anual | CHIP CGN | Propósito General - Eficiencia Fiscal |
| Cobertura acueducto | DNP/MVCT | Anual | Censo/SUI | Agua |
| Cobertura alcantarillado | DNP/MVCT | Anual | Censo/SUI | Agua |
| Índice Desempeño Fiscal | DNP | Anual | Evaluación DNP | Propósito General - Eficiencia |

---

## 7.2.2 Fuentes de Datos SGR

### 7.2.2.1 Agencia Nacional de Hidrocarburos (ANH)

**Entidad:** Agencia Nacional de Hidrocarburos
**Sitio web:** https://www.anh.gov.co

**Datos Suministrados:**

1. **Producción de Hidrocarburos**
   - Producción de petróleo por campo (barriles/día)
   - Producción de gas natural (pies cúbicos/día)
   - Desagregación territorial (departamento, municipio)
   - Área de explotación (continental, costa afuera)

2. **Certificación de Regalías por Hidrocarburos**
   - Liquidación mensual de regalías por campo
   - Aplicación de tasas según contratos
   - Precios de referencia (WTI, Brent, TLC)
   - Tasas de cambio aplicadas

3. **Contratos de Exploración y Producción**
   - Contratos vigentes por área
   - Operadores y porcentajes de participación
   - Rondas Colombia y asignaciones

4. **Proyecciones de Producción**
   - Curvas de declinación de campos
   - Nuevos descubrimientos
   - Desarrollo de campos

**Periodicidad:** Mensual (producción y regalías), Trimestral (proyecciones)

**Formato de Entrega:** Reportes Excel, bases de datos, SIR (Sistema de Información de Regalías)

**Contacto:** servicioalciudadano@anh.gov.co

**Sistema SIR:** Integrado con MHCP para liquidación de regalías

---

### 7.2.2.2 Agencia Nacional de Minería (ANM)

**Entidad:** Agencia Nacional de Minería
**Sitio web:** https://www.anm.gov.co

**Datos Suministrados:**

1. **Producción Minera**
   - Carbón (toneladas)
   - Oro (onzas troy)
   - Níquel (toneladas)
   - Esmeraldas (quilates)
   - Materiales de construcción
   - Otros minerales (calizas, yeso, arcillas)

2. **Certificación de Regalías Mineras**
   - Liquidación mensual por mineral
   - Precios internacionales de referencia
   - Tasas de regalía por mineral y contrato
   - Distribución territorial de la producción

3. **Títulos Mineros Vigentes**
   - Títulos otorgados por región
   - Titulares y operadores
   - Áreas de explotación
   - Estado de títulos

4. **Censo Minero**
   - Unidades de producción minera
   - Clasificación formal/informal
   - Producción fiscalizada

**Periodicidad:** Mensual (producción y regalías), Anual (censo)

**Formato de Entrega:** Sistema Unificado de Regalías, bases de datos, reportes

**Contacto:** correspondencia@anm.gov.co

**Sistema RUCOM:** Registro Único de Comercializadores de Minerales

---

### 7.2.2.3 Ministerio de Hacienda y Crédito Público (MHCP)

**Entidad:** Ministerio de Hacienda y Crédito Público
**Sitio web:** https://www.minhacienda.gov.co

**Datos Suministrados:**

1. **Recaudo Total SGR**
   - Consolidado mensual de ingresos por regalías
   - Recaudo por fuente (hidrocarburos, minería)
   - Recaudo acumulado anual
   - Recaudo por territorio productor

2. **Plan Bienal de Caja (PBC)**
   - Proyección bienal de ingresos
   - Distribución por asignaciones
   - Escenarios de precios (optimista, medio, pesimista)
   - Aprobación CONFIS

3. **Plan de Recursos 10 años**
   - Proyección decenal de ingresos SGR
   - Modelos de producción y precios
   - Tasa de cambio proyectada
   - Metodología de cálculo

4. **Liquidación y Giro de Regalías**
   - Giros mensuales a entidades territoriales
   - Asignaciones directas (20% y 5%)
   - Recursos OCAD
   - Saldos y rezagos

5. **Sistema de Información de Regalías (SIR)**
   - Integración con ANH y ANM
   - Liquidación automática
   - Reportes en línea

**Periodicidad:** Mensual (recaudo y giros), Bienal (PBC), Decenal (Plan de Recursos)

**Formato de Entrega:** Portal SIR, reportes Excel, documentos CONFIS

**Contacto:** servicioalciudadano@minhacienda.gov.co

**Portal SIR:** https://www.minhacienda.gov.co/sgr

---

### 7.2.2.4 Departamento Nacional de Planeación (DNP)

**Entidad:** Departamento Nacional de Planeación
**Sitio web:** https://www.dnp.gov.co

**Datos Suministrados:**

1. **Sistema de Presupuesto y Giro de Regalías (SPGR)**
   - Presupuesto SGR por asignación
   - Ejecución presupuestal de proyectos
   - Compromisos, obligaciones y pagos
   - Saldos disponibles

2. **Sistema de Seguimiento y Evaluación de Proyectos (SSEC)**
   - Proyectos aprobados por OCAD
   - Avance físico y financiero
   - Indicadores de gestión
   - Evaluaciones ex post

3. **Mapas de Regalías**
   - Distribución territorial de recursos
   - Proyectos por sector y región
   - Visualización geográfica

4. **OCAD (Órganos Colegiados de Administración y Decisión)**
   - Actas de aprobación de proyectos
   - Secretarías técnicas
   - Cronogramas de sesiones
   - Proyectos presentados vs aprobados

5. **Banco de Proyectos SGR**
   - Proyectos registrados
   - Fichas técnicas
   - Fuentes de financiación
   - Entidades ejecutoras

**Periodicidad:** Mensual (SPGR, SSEC), Continua (Mapas), Por sesión (OCAD)

**Formato de Entrega:** Plataformas web, API, consultas públicas

**Contacto:** contactociudadano@dnp.gov.co

**Mapas Regalías:** https://www.sgr.gov.co/MapasRegalias

**SSEC:** https://www.sgr.gov.co/SSEC

---

### 7.2.2.5 Sistema de Información de Regalías Integrado

**Integración de Fuentes:**

```
ANH (Producción HC) ──┐
                      ├──> SIR MHCP ──> Liquidación Regalías ──> SPGR DNP ──> Distribución
ANM (Producción Min) ─┘                                                            │
                                                                                   │
DANE (Población) ────────────────────────────────────────────────────────────────┘
```

**Flujo de Información:**

1. **Reporte de Producción:** ANH/ANM reportan producción mensual
2. **Liquidación:** MHCP liquida regalías según precios y tasas
3. **Distribución:** Aplicación de porcentajes por ley (Paz 25%, Directas 20%, etc.)
4. **Asignación Territorial:** Cruce con población y variables certificadas
5. **Presupuesto:** SPGR consolida recursos por entidad y proyecto
6. **Giro:** Transferencia a cuentas territoriales y OCAD
7. **Seguimiento:** SSEC monitorea ejecución

---

### 7.2.2.6 Tabla de Variables Certificadas SGR

| Variable | Entidad Certificadora | Periodicidad | Sistema | Uso en SGR |
|----------|----------------------|--------------|---------|------------|
| Producción petróleo | ANH | Mensual | SIR | Regalías hidrocarburos, asignaciones directas |
| Producción gas | ANH | Mensual | SIR | Regalías hidrocarburos |
| Precio petróleo WTI/Brent | ANH | Diaria | SIR | Liquidación regalías |
| Producción carbón | ANM | Mensual | RUCOM | Regalías minería |
| Producción oro | ANM | Mensual | RUCOM | Regalías minería |
| Precio internacional minerales | ANM | Mensual | RUCOM | Liquidación regalías |
| Recaudo total SGR | MHCP | Mensual | SIR | Base distribución |
| Plan Bienal de Caja | MHCP | Bienal | CONFIS | Presupuesto bienal |
| Plan de Recursos 10 años | MHCP | Cada 2 años | CONFIS | Proyección largo plazo |
| Población total | DANE | Anual | Proyecciones | Inversión Regional, Paz |
| Población NBI | DANE | Quinquenal | Censo | Inversión Regional |
| Proyectos aprobados OCAD | DNP | Continua | SSEC | Ejecución presupuestal |
| Presupuesto proyectos | DNP | Continua | SPGR | Asignación recursos |
| Población resguardos indígenas | MinInterior | Anual | Certificación | Asignaciones étnicas |
| Población comunidades negras | MinInterior | Anual | Certificación | Asignaciones étnicas |

---

## 7.2.3 Fuentes de Datos PGN

### 7.2.3.1 Ministerio de Hacienda y Crédito Público (MHCP)

**Entidad:** Ministerio de Hacienda y Crédito Público
**Sitio web:** https://www.minhacienda.gov.co

**Datos Suministrados:**

1. **Presupuesto General de la Nación**
   - Ley Anual de Presupuesto aprobada por Congreso
   - Apropiaciones por sector, programa y proyecto
   - Fuentes de financiación (recursos propios, crédito, donaciones)
   - Modificaciones presupuestales

2. **Sistema Integrado de Información Financiera (SIIF Nación)**
   - Ejecución presupuestal en línea
   - Ciclo presupuestal: Apropiación → Compromiso → Obligación → Pago
   - Reportes por entidad ejecutora
   - Clasificadores presupuestales

3. **Marco Fiscal de Mediano Plazo (MFMP)**
   - Proyecciones macroeconómicas
   - Sostenibilidad fiscal
   - Regla fiscal

4. **Deuda Pública**
   - Servicio de la deuda (interna y externa)
   - Amortizaciones e intereses
   - Nuevos desembolsos

**Periodicidad:** Anual (ley presupuesto), Diaria (SIIF), Mensual (reportes ejecución)

**Formato de Entrega:** SIIF Nación (consulta web), archivos planos, API

**Contacto:** servicioalciudadano@minhacienda.gov.co

**SIIF Nación:** https://www.siif.gov.co

---

### 7.2.3.2 Departamento Nacional de Planeación (DNP)

**Entidad:** Departamento Nacional de Planeación
**Sitio web:** https://www.dnp.gov.co

**Datos Suministrados:**

1. **Banco de Programas y Proyectos de Inversión (BPIN)**
   - Proyectos de inversión nacional
   - Fichas técnicas MGA (Metodología General Ajustada)
   - Viabilidad técnica, económica y financiera
   - Registro presupuestal

2. **Regionalización del Presupuesto**
   - Identificación geográfica de la inversión
   - Clasificación: Regionalizado, Nacional, Por Regionalizar
   - Distribución departamental
   - Inversión per cápita

3. **Sistema de Seguimiento a Metas de Gobierno (SISMEG)**
   - Avance de proyectos prioritarios
   - Indicadores de cumplimiento
   - Alertas de gestión

4. **Informes de Seguimiento Presupuestal**
   - Ejecución sectorial
   - Indicadores de eficacia y eficiencia
   - Análisis de rezagos (reservas, cuentas por pagar)

5. **Planes Nacionales de Desarrollo**
   - Plan de Inversiones PND
   - Asignación sectorial y territorial
   - Pactos y líneas estratégicas

**Periodicidad:** Anual (regionalización), Trimestral (SISMEG), Mensual (seguimiento)

**Formato de Entrega:** Portal BPIN, reportes Excel, informes ejecutivos

**Contacto:** contactociudadano@dnp.gov.co

**BPIN:** https://www.dnp.gov.co/BPIN

---

### 7.2.3.3 Entidades Ejecutoras del Presupuesto

**Ministerios y Departamentos Administrativos:**

Cada entidad ejecutora reporta su ejecución presupuestal al SIIF:

1. **Ministerio de Transporte**
   - Inversión en infraestructura vial
   - Programas viales (4G, 5G)
   - Proyectos ferroviarios y fluviales
   - Regionalización por departamento

2. **Ministerio de Educación Nacional**
   - Infraestructura educativa
   - Calidad educativa
   - Programas de cobertura
   - Distribución territorial

3. **Ministerio de Salud y Protección Social**
   - Infraestructura hospitalaria
   - Programas de salud pública
   - Fortalecimiento institucional
   - Asignaciones departamentales

4. **Ministerio de Vivienda, Ciudad y Territorio**
   - Programas de vivienda social
   - Agua potable y saneamiento
   - Desarrollo urbano
   - Distribución municipal

5. **Ministerio de Agricultura y Desarrollo Rural**
   - Desarrollo rural integral
   - Adecuación de tierras
   - Programas agropecuarios
   - Regionalización

6. **Otros Sectores:**
   - Trabajo (programas sociales)
   - Minas y Energía
   - Ambiente y Desarrollo Sostenible
   - Cultura, Deporte
   - Comercio, Industria y Turismo

**Datos Reportados:**
- Proyectos por sector
- Ubicación geográfica (regionalización)
- Ejecución física y financiera
- Beneficiarios

**Periodicidad:** Mensual (ejecución SIIF), Trimestral (avance físico)

---

### 7.2.3.4 Departamento Administrativo Nacional de Estadística (DANE)

**Datos Suministrados para PGN:**

1. **Población Departamental**
   - Proyecciones de población para cálculo per cápita
   - Población urbana y rural
   - Grupos de edad

2. **Cuentas Nacionales**
   - PIB nacional y departamental
   - Crecimiento económico
   - Sectores productivos

3. **Índice de Precios**
   - Inflación (IPC)
   - Deflactores de inversión

**Uso en PGN:**
- Per cápita = Inversión Regionalizada / Población
- Ajustes nominales vs reales

**Periodicidad:** Anual (proyecciones), Mensual (IPC)

---

### 7.2.3.5 Tabla de Variables Certificadas PGN

| Variable | Entidad Certificadora | Periodicidad | Sistema | Uso en PGN |
|----------|----------------------|--------------|---------|------------|
| Apropiación presupuestal | MHCP | Anual | Ley de Presupuesto | Base presupuestal |
| Compromiso presupuestal | Entidades Ejecutoras | Diaria | SIIF | Ejecución presupuestal |
| Obligación presupuestal | Entidades Ejecutoras | Diaria | SIIF | Ejecución presupuestal |
| Pago presupuestal | MHCP | Diaria | SIIF | Ejecución presupuestal |
| Regionalización de proyectos | DNP | Anual | BPIN | Distribución territorial |
| Población departamental | DANE | Anual | Proyecciones | Per cápita |
| Proyectos de inversión | DNP | Continua | BPIN/MGA | Viabilidad y registro |
| Avance físico proyectos | Entidades Ejecutoras | Trimestral | SISMEG | Cumplimiento metas |
| Clasificación sectorial | DNP/MHCP | Anual | Clasificadores PGN | Análisis sectorial |
| Reservas presupuestales | MHCP | Anual (cierre) | SIIF | Rezagos presupuestales |
| Cuentas por pagar | MHCP | Trimestral | SIIF | Rezagos presupuestales |

---

## 7.2.4 Frecuencias de Actualización

### 7.2.4.1 Actualizaciones Diarias

**Datos actualizados diariamente:**

| Dato | Sistema | Fuente |
|------|---------|--------|
| Ejecución presupuestal PGN | SIIF Nación | MHCP |
| Compromisos PGN | SIIF Nación | Entidades Ejecutoras |
| Obligaciones PGN | SIIF Nación | Entidades Ejecutoras |
| Pagos PGN | SIIF Nación | MHCP |
| Precio petróleo WTI/Brent | SIR | ANH |
| Precios internacionales minerales | RUCOM | ANM |

**Horarios de corte:**
- SIIF Nación: Cierre diario 11:59 PM
- Precios internacionales: Actualización mercados internacionales

---

### 7.2.4.2 Actualizaciones Semanales

**Datos actualizados semanalmente:**

| Dato | Sistema | Fuente | Día Actualización |
|------|---------|--------|------------------|
| Proyectos aprobados OCAD | SSEC | DNP | Viernes |
| Avance proyectos SGR | SSEC | DNP | Viernes |

---

### 7.2.4.3 Actualizaciones Mensuales

**Datos actualizados mensualmente:**

| Dato | Sistema | Fuente | Fecha Corte |
|------|---------|--------|-------------|
| Producción petróleo | SIR | ANH | Último día del mes |
| Producción gas | SIR | ANH | Último día del mes |
| Producción carbón | RUCOM | ANM | Último día del mes |
| Producción oro y otros minerales | RUCOM | ANM | Último día del mes |
| Recaudo SGR | SIR | MHCP | 5to día hábil mes siguiente |
| Giros SGP | SPGF | DNP | Último día del mes |
| Giros SGR | SPGR | DNP | Último día del mes |
| Afiliados régimen subsidiado | BDUA | MSPS/ADRES | 15 del mes siguiente |
| Matrícula SIMAT | SIMAT | MEN | Continua (corte oficial octubre) |
| Ejecución presupuestal CGN | CHIP | CGN | 15 del mes siguiente |

---

### 7.2.4.4 Actualizaciones Trimestrales

**Datos actualizados trimestralmente:**

| Dato | Sistema | Fuente | Meses Corte |
|------|---------|--------|-------------|
| Población SISBEN | SISBEN IV | DNP | Marzo, Junio, Septiembre, Diciembre |
| Avance físico proyectos PGN | SISMEG | DNP | Marzo, Junio, Septiembre, Diciembre |
| Índice Desempeño Fiscal | Evaluación DNP | DNP | Anual (publicación trimestral) |
| Cuentas por pagar | SIIF | MHCP | Marzo, Junio, Septiembre, Diciembre |
| PIB departamental | Cuentas Nacionales | DANE | Trimestres móviles |

---

### 7.2.4.5 Actualizaciones Anuales

**Datos actualizados anualmente:**

| Dato | Fuente | Mes Actualización | Documento Oficial |
|------|--------|------------------|------------------|
| Ingreso Corriente de la Nación (ICN) | CGR | Febrero | Certificación CGR |
| Distribución SGP | DNP | Enero | Decreto DNP |
| Población total (proyecciones) | DANE | Junio | Proyecciones DANE |
| Matrícula oficial (certificada) | MEN | Noviembre | Resolución MEN |
| Tipología territorial | MEN | Diciembre | Resolución MEN |
| UPC-S | MSPS | Diciembre año anterior | Resolución MSPS |
| Per cápita salud pública | MSPS | Enero | Resolución MSPS |
| Plan Bienal de Caja SGR | MHCP | Primer año bienio | Acuerdo CONFIS |
| Regionalización PGN | DNP | Enero-Marzo | Informe DNP |
| Ley de Presupuesto PGN | Congreso/MHCP | Octubre año anterior | Ley de la República |
| Índice Desempeño Fiscal | DNP | Septiembre | Evaluación DNP |
| ICLD certificado | CGN | Primer trimestre | CHIP |

---

### 7.2.4.6 Actualizaciones Plurianuales

**Datos actualizados cada varios años:**

| Dato | Fuente | Frecuencia | Última Actualización |
|------|--------|-----------|---------------------|
| Censo de Población | DANE | Decenal | 2018 |
| NBI (Necesidades Básicas Insatisfechas) | DANE | Decenal (Censo) | 2018 |
| Plan de Recursos SGR (10 años) | MHCP | Bienal | 2024-2033 |
| Plan Nacional de Desarrollo | DNP | Cuatrienal | 2022-2026 |
| Cobertura servicios públicos (Censo) | DANE | Decenal | 2018 |

---

## 7.2.5 Procesos de Validación

### 7.2.5.1 Validación de Datos SGP

**Proceso de Certificación Anual:**

1. **Recolección de Variables (Julio-Septiembre):**
   - DANE: Proyecciones población, NBI
   - MEN: Matrícula oficial corte octubre
   - MSPS: Afiliados régimen subsidiado
   - CGN: ICLD certificado

2. **Validación DNP (Octubre-Noviembre):**
   - Cruce de información entre fuentes
   - Validación de consistencia territorial
   - Detección de inconsistencias
   - Solicitud de correcciones

3. **Cálculo Distribución (Noviembre):**
   - Aplicación de fórmulas de ley
   - Cálculo por componente
   - Generación de matriz de distribución

4. **Socialización (Noviembre-Diciembre):**
   - Presentación a entidades territoriales
   - Periodo de observaciones
   - Ajustes finales

5. **Expedición Decreto (Diciembre-Enero):**
   - Firma Ministerio de Hacienda y DNP
   - Publicación oficial
   - Comunicación a territorios

**Controles de Calidad:**
- Suma total = 100% del SGP
- Validación población vs DANE
- Cruce matrícula vs población escolar
- Verificación ICLD vs categoría municipal

---

### 7.2.5.2 Validación de Datos SGR

**Proceso de Liquidación Mensual:**

1. **Reporte de Producción (1-5 del mes):**
   - ANH: Producción hidrocarburos por campo
   - ANM: Producción minerales por título

2. **Liquidación MHCP (5-10 del mes):**
   - Aplicación de precios internacionales
   - Tasa de cambio representativa
   - Aplicación de tasas de regalía por contrato
   - Cálculo regalías en pesos

3. **Validación Cruzada (10-15 del mes):**
   - Verificación producción vs contratos
   - Validación precios vs fuentes oficiales
   - Cruce tasas de regalía vs ANH/ANM

4. **Distribución (15-20 del mes):**
   - Aplicación porcentajes por ley
   - Asignación territorial productores
   - Cálculo asignaciones directas

5. **Giro (25-último día):**
   - Transferencia a cuentas
   - Actualización saldos SPGR

**Controles de Calidad:**
- Producción reportada vs histórico (variación < 20%)
- Precios dentro rangos internacionales
- Suma distribución = 100% recaudo
- Asignaciones directas = producción territorial

---

### 7.2.5.3 Validación de Datos PGN

**Proceso de Regionalización:**

1. **Reporte Entidades (Enero-Marzo):**
   - Ministerios reportan proyectos de inversión
   - Identificación geográfica por proyecto
   - Clasificación: Regionalizado, Nacional, Por Regionalizar

2. **Validación DNP (Marzo-Abril):**
   - Cruce con BPIN
   - Verificación ubicación geográfica
   - Consistencia apropiación vs SIIF

3. **Consolidación (Abril-Mayo):**
   - Suma departamental
   - Cálculo per cápita (población DANE)
   - Generación de reportes

4. **Publicación (Mayo-Junio):**
   - Informe de regionalización
   - Portal público
   - Datos abiertos

**Controles de Calidad:**
- Regionalizado + Nacional + Por Regionalizar = 100% PGN
- Suma departamental = Total Regionalizado
- Proyectos BPIN = Proyectos reportados
- Apropiación = Ley de Presupuesto

---

### 7.2.5.4 Auditorías y Fiscalización

**Contraloría General de la República:**

- Auditorías a distribución SGP
- Seguimiento giros mensuales
- Verificación ejecución territorial
- Informes de control fiscal

**Auditoría General de la República:**

- Auditorías a entidades territoriales
- Verificación uso de recursos
- Evaluación de gestión fiscal

**Procuraduría General de la Nación:**

- Vigilancia administrativa
- Control disciplinario
- Alertas tempranas

**DNP:**

- Seguimiento ejecución SGR (SSEC)
- Evaluación proyectos (ex ante, ex post)
- Índice Desempeño Fiscal

---

## Resumen de Contactos Principales

| Entidad | Sitio Web | Correo Contacto | Teléfono |
|---------|-----------|----------------|----------|
| DNP | www.dnp.gov.co | contactociudadano@dnp.gov.co | (601) 381 5000 |
| MHCP | www.minhacienda.gov.co | servicioalciudadano@minhacienda.gov.co | (601) 381 1700 |
| DANE | www.dane.gov.co | contacto@dane.gov.co | (601) 597 8300 |
| MEN | www.mineducacion.gov.co | atencionalciudadano@mineducacion.gov.co | (601) 222 2800 |
| MSPS | www.minsalud.gov.co | atencionalciudadano@minsalud.gov.co | (601) 330 5000 |
| CGR | www.contraloria.gov.co | chip@contraloria.gov.co | (601) 518 7000 |
| ANH | www.anh.gov.co | servicioalciudadano@anh.gov.co | (601) 593 1717 |
| ANM | www.anm.gov.co | correspondencia@anm.gov.co | (601) 220 0200 |

---

**Nota:** Los enlaces, correos y teléfonos están sujetos a cambios. Verifique la información actualizada en los portales oficiales de cada entidad. Todos los datos utilizados en SICODIS provienen de fuentes oficiales certificadas por las autoridades competentes según la normativa vigente.
