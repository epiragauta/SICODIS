# 6. Preguntas Frecuentes

## Información del Documento
- **Módulo**: Preguntas Frecuentes
- **Ruta de acceso**: `/faq`
- **Componente Angular**: `faq`
- **Última actualización**: Ver [CHANGELOG.md](../CHANGELOG.md)
- **Versión**: 1.0.0

## Tabla de Contenidos
- [Propósito del Módulo](#propósito-del-módulo)
- [SGP - Sistema General de Participaciones](#sgp---sistema-general-de-participaciones)
- [SGR - Sistema General de Regalías](#sgr---sistema-general-de-regalías)
- [PGN - Presupuesto General de la Nación](#pgn---presupuesto-general-de-la-nación)
- [Herramientas y Consultas](#herramientas-y-consultas)
- [Soporte Técnico](#soporte-técnico)
- [Ver También](#ver-también)

---

## Propósito del Módulo

El módulo de **Preguntas Frecuentes** proporciona respuestas detalladas a las consultas más comunes de los usuarios de SICODIS, organizadas por sistema (SGP, SGR, PGN). Este documento replica el contenido del componente FAQ de la aplicación y amplía las respuestas con información técnica adicional.

![Interfaz Preguntas Frecuentes](../assets/faq-interfaz.png)
*Placeholder: Captura de pantalla mostrando la interfaz de preguntas frecuentes con acordeones expandidos*

### Usuarios Objetivo
- Funcionarios de entidades territoriales
- Analistas presupuestales
- Investigadores y académicos
- Ciudadanos interesados en transparencia fiscal

---

## SGP - Sistema General de Participaciones

### P1: ¿Qué es el Sistema General de Participaciones?

**Respuesta**:

El Sistema General de Participaciones (SGP) es el mecanismo establecido por la Constitución Política (artículo 357) y la ley (Ley 715 de 2001 y normas posteriores) para distribuir recursos del presupuesto nacional hacia las entidades territoriales (departamentos, distritos y municipios) para financiar los servicios a su cargo.

**Sectores financiados**:
- **Educación**: Nómina docente, calidad educativa, gratuidad
- **Salud**: Régimen subsidiado, salud pública, prestación de servicios
- **Agua Potable y Saneamiento Básico**: Infraestructura de acueductos y alcantarillados
- **Propósito General**: Libre inversión, deporte, cultura, alimentación escolar, entre otros

**Base de cálculo**:
El monto total del SGP se calcula tomando como base los Ingresos Corrientes de la Nación (ICN) certificados por el CONFIS, con crecimiento anual según la inflación causada más un porcentaje de incremento real definido por ley.

**Módulos relacionados**:
- [03-00. Introducción al SGP](../03-sgp/03-00-sgp-introduccion.md)
- [03-01. SGP Resumen](../03-sgp/03-01-sgp-resumen.md)

---

### P2: ¿Cómo consultar la distribución de recursos del SGP por entidad territorial?

**Respuesta**:

SICODIS ofrece múltiples módulos para consultar la distribución de recursos SGP:

**1. SGP Resumen** (`/sgp-inicio`):
- Vista consolidada por entidad territorial
- Desglose por sectores (Educación, Salud, Agua, Propósito General)
- Filtros por año, departamento y municipio
- [Ver documentación](../03-sgp/03-01-sgp-resumen.md)

**2. SGP Comparativo** (`/sgp-comparativa`):
- Comparación entre múltiples municipios
- Análisis de variaciones año a año
- Criterios de distribución aplicados
- [Ver documentación](../03-sgp/03-04-sgp-comparativo.md)

**3. SGP Detalle Presupuestal** (`/sgp-detalle-presupuestal`):
- Distribución mensual de doceavas
- Seguimiento de giros realizados
- Histórico de transferencias
- [Ver documentación](../03-sgp/03-03-sgp-detalle-presupuestal.md)

**Pasos básicos**:
1. Acceder al módulo deseado desde el menú "Informes SGP"
2. Seleccionar vigencia fiscal
3. Elegir departamento y municipio
4. Visualizar tabla jerárquica con distribución
5. Exportar a Excel si requiere análisis adicional

---

### P3: ¿Dónde puedo ver el presupuesto SGP por vigencia?

**Respuesta**:

El presupuesto SGP por vigencia se puede consultar en:

**Módulo: SGP Detalle Presupuestal**
- **Ruta**: `/sgp-detalle-presupuestal`
- **Información disponible**:
  - Recursos asignados por entidad territorial
  - Doceavas distribuidas mensualmente
  - Acumulado de transferencias por vigencia
  - Estado de giros (programados vs ejecutados)

**Doceavas mensuales**:
- **Educación**: 12 doceavas (enero a diciembre)
- **Salud, Agua, Propósito General**: 11 doceavas del año actual + 1 doceava de diciembre del año anterior

**Formato de visualización**:
```
┌─────────────┬──────────────┬──────────────┬──────────────┐
│ Mes         │ Programado   │ Girado       │ % Ejecución  │
├─────────────┼──────────────┼──────────────┼──────────────┤
│ Enero       │ $100.000.000 │ $100.000.000 │ 100.0%       │
│ Febrero     │ $100.000.000 │ $100.000.000 │ 100.0%       │
│ Marzo       │ $100.000.000 │  $95.000.000 │  95.0%       │
│ ...         │ ...          │ ...          │ ...          │
└─────────────┴──────────────┴──────────────┴──────────────┘
```

**Descarga de datos**:
- Botón "Exportar Excel" disponible en todos los módulos
- Archivos incluyen metadatos (vigencia, entidad, fecha de generación)

**Documentación**: [03-03. SGP Detalle Presupuestal](../03-sgp/03-03-sgp-detalle-presupuestal.md)

---

### P4: ¿Cómo ver la evolución histórica del SGP?

**Respuesta**:

El módulo **SGP Histórico** permite consultar series de tiempo del SGP desde 2005:

**Ubicación**: `/sgp-historico`

**Características**:
- **Rango temporal**: 2005 - actualidad (más de 20 años de datos)
- **Valores consultables**:
  - Precios corrientes (pesos nominales)
  - Precios constantes (ajustados por inflación)
- **Desagregación**:
  - Total SGP nacional
  - Por participación (Educación, Salud, Agua, Propósito General)
  - Por entidad territorial

**Gráficos disponibles**:
1. **Línea de tiempo**: Evolución del total SGP por vigencia
2. **Barras apiladas**: Composición por sectores
3. **Gráfico de crecimiento**: Variación porcentual año a año

**Análisis posibles**:
- Identificar tendencias de crecimiento del SGP
- Comparar participación de cada sector a lo largo del tiempo
- Analizar impacto de reformas normativas (ej: Acto Legislativo 04 de 2007)
- Estudiar efecto de la inflación en valores reales

**Ejemplo de uso**:
```
Consulta: Evolución SGP Educación 2010-2025
Resultado visualizado:
  2010: $15.2 billones (precios constantes 2025)
  2015: $18.7 billones
  2020: $24.1 billones
  2025: $32.5 billones

Crecimiento acumulado: 114% en 15 años
```

**Documentación**: [03-05. SGP Histórico](../03-sgp/03-05-sgp-historico.md)

---

### P5: ¿Qué son las doceavas del SGP y cómo se distribuyen?

**Respuesta**:

Las **doceavas** son las doce partes iguales en que se divide el monto anual del SGP para su distribución mensual a las entidades territoriales.

**Diferenciación por sector**:

**Educación (12 doceavas)**:
- Se distribuyen de enero a diciembre del año en curso
- Cada doceava representa 1/12 del total anual
- Transferencia mensual fija
- Objetivo: Garantizar pago mensual de nómina docente

**Salud, Agua, Propósito General (11 + 1 doceavas)**:
- **11 doceavas**: Se distribuyen en el año en curso
- **1 doceava adicional**: Corresponde a diciembre del año anterior
- Total: 12 pagos en el año
- Primera transferencia del año incluye el saldo de diciembre anterior

**Cálculo de doceava**:
```
Doceava = Total Asignación Anual / 12

Ejemplo:
Total SGP Educación Medellín 2025: $600.000.000
Doceava mensual = $600.000.000 / 12 = $50.000.000
```

**Fechas de giro**:
- Generalmente primera quincena de cada mes
- Publicación en SICODIS al momento del giro
- Notificación a entidades territoriales

**Consulta en SICODIS**:
- Módulo: [SGP Detalle Presupuestal](../03-sgp/03-03-sgp-detalle-presupuestal.md)
- Vista de calendario mensual con montos girados
- Histórico de doceavas de años anteriores

---

### P6: ¿Qué es la certificación de educación y salud?

**Respuesta**:

La **certificación** es la condición que habilita a una entidad territorial para administrar directamente los recursos del SGP en educación o salud.

**Certificación en Educación**:

**Requisitos**:
- Municipios con más de 100,000 habitantes (según último censo)
- Cumplir condiciones técnicas, administrativas y financieras
- Evaluación positiva del Ministerio de Educación Nacional

**Responsabilidades de municipios certificados**:
- Administración de nómina docente
- Gestión de planta de personal educativo
- Contratación de servicios educativos
- Inversión en calidad educativa

**Municipios NO certificados**:
- Reciben educación del departamento
- Los recursos SGP educación van al departamento
- En consultas SICODIS: Educación = $0 para el municipio

**Certificación en Salud**:

**Requisitos**:
- Departamentos: Automática
- Municipios: Capacidad técnica, administrativa y financiera demostrada
- Evaluación del Ministerio de Salud

**Responsabilidades**:
- Afiliación al régimen subsidiado
- Contratación de EPS
- Salud pública
- Inspección, vigilancia y control

**Verificación en SICODIS**:
- Si un municipio tiene asignación SGP Educación > $0, está certificado
- Si Educación = $0, no está certificado (recursos van al departamento)

**Lista de municipios certificados**: Consultar en el Ministerio de Educación Nacional o en el módulo SGP Resumen.

---

## SGR - Sistema General de Regalías

### P7: ¿Qué son las regalías?

**Respuesta**:

Las **regalías** son la contraprestación económica que recibe el Estado por la explotación de un recurso natural no renovable cuya producción se extingue por el transcurso del tiempo.

**Fundamento constitucional**:
- Artículo 360 de la Constitución Política de Colombia
- Reforma: Acto Legislativo 05 de 2011

**Recursos naturales que generan regalías**:

**Hidrocarburos**:
- Petróleo crudo
- Gas natural
- Tarifas: Varían según volumen de producción diaria

**Minería**:
- Carbón
- Níquel
- Oro
- Esmeraldas
- Materiales de construcción
- Otros minerales
- Tarifas: Diferenciadas por tipo de mineral

**Tarifas de regalías** (ejemplos):
```
Petróleo:
  - 0 a 5,000 barriles/día: 8%
  - 5,000 a 125,000 barriles/día: 8% + factor variable
  - Más de 125,000 barriles/día: 20%

Carbón: 5% a 10% según producción
Oro: 4% del valor comercial
Níquel: 12% del valor comercial
```

**Destinación de regalías**:
Las regalías se distribuyen a través del Sistema General de Regalías (SGR) para:
- Inversión en desarrollo regional
- Ciencia, Tecnología e Innovación
- Ahorro pensional (FONPET)
- Fiscalización de la explotación
- Funcionamiento del sistema

**Módulos relacionados**:
- [04-00. Introducción al SGR](../04-sgr/04-00-sgr-introduccion.md)
- [04-01. SGR Recaudo Mensual](../04-sgr/04-01-sgr-recaudo-mensual.md)

---

### P8: ¿Qué es SICODIS?

**Respuesta**:

**SICODIS** (Sistema de Información y Consulta de Distribuciones) es la plataforma web desarrollada por el Departamento Nacional de Planeación (DNP) para consultar información sobre los recursos distribuidos por el DNP en tres sistemas principales:

**1. Sistema General de Participaciones (SGP)**:
- Transferencias del presupuesto nacional a entidades territoriales
- Sectores: Educación, Salud, Agua, Propósito General
- Información desde 2005

**2. Sistema General de Regalías (SGR)**:
- Distribución de recursos por explotación de recursos naturales
- Asignaciones: Directas, Desarrollo Regional, Inversión Local, CTI
- Información desde 2012 (bienios)

**3. Presupuesto General de la Nación (PGN)**:
- Regionalización del presupuesto de inversión nacional
- Seguimiento de ejecución presupuestal
- Distribución por sectores y entidades territoriales

**Características de SICODIS**:
- **Acceso público**: Disponible para todos los ciudadanos
- **Actualización periódica**: Datos actualizados mensualmente
- **Múltiples visualizaciones**: Tablas, gráficos, mapas
- **Exportación**: Descarga de datos en Excel
- **Transparencia**: Cumplimiento de la Ley de Transparencia y Acceso a la Información Pública

**Tecnología**:
- Plataforma web responsiva (Angular 18)
- Compatible con navegadores modernos
- Accesible desde dispositivos móviles y tablets

**URL de acceso**: https://sicodis.dnp.gov.co

**Documentación**: [01. Introducción General](../01-introduccion.md)

---

### P9: ¿Cuál información de regalías se puede consultar en SICODIS?

**Respuesta**:

SICODIS permite consultar la siguiente información del Sistema General de Regalías:

**Información presupuestal disponible**:

**1. Presupuesto Bienal**:
- Apropiaciones por asignación (Directas, Desarrollo Regional, Inversión Local, CTI)
- Distribución por entidad territorial
- Desagregación por fuente (minería vs hidrocarburos)
- [Módulo: Plan de Recursos](../04-sgr/04-05-sgr-plan-recursos.md)

**2. Recaudo Corriente**:
- Recaudo mensual de regalías
- Distribución mensual por Instrucciones de Abono a Cuenta (IAC)
- Comparación presupuesto vs recaudo
- [Módulo: Recaudo Mensual](../04-sgr/04-01-sgr-recaudo-mensual.md)

**3. Otros Ingresos No Corrientes**:
- Rendimientos financieros
- Mayor recaudo de bienios anteriores
- Desahorro FONPET
- Recuperación de cartera
- Multas y sanciones

**4. Plan Bienal de Caja (PBC)**:
- Flujo de caja mensual estimado para 24 meses
- Programación de recursos disponibles para comprometer
- [Módulo: Plan Bienal de Caja](../04-sgr/04-06-sgr-plan-bienal-caja.md)

**5. Asignaciones Directas**:
- Recaudo por municipio y departamento productor
- Diferenciación 20% + 5%
- Recaudo aforado vs no aforado
- [Módulo: Recaudo Directas](../04-sgr/04-02-sgr-recaudo-directas.md)

**Período disponible**:
- Desde **2012** (único año no bienal)
- Bienios: 2013-2014, 2015-2016, 2017-2018, 2019-2020, 2021-2022, 2023-2024, 2025-2026

**Información NO disponible en SICODIS** (competencia de otras entidades):
- **Giros y pagos**: Ministerio de Hacienda (SPGR - Sistema de Presupuesto y Giro de Regalías)
- **Ejecución presupuestal de proyectos**: Ministerio de Hacienda
- **Aprobación de proyectos**: OCAD (consultar en SUIFP-SGR)
- **Producción certificada**: Agencia Nacional de Hidrocarburos, Agencia Nacional de Minería

**Canales complementarios**:
- **SUIFP-SGR**: Sistema de inversión y ejecución de proyectos
- **MinHacienda**: Información de giros
- **MapaRegalías**: Georreferenciación de proyectos

---

### P10: ¿Qué es el SGR?

**Respuesta**:

El **Sistema General de Regalías (SGR)** es el conjunto de ingresos, asignaciones, órganos, procedimientos y regulaciones establecido por la Constitución Política (artículos 360 y 361) para la distribución, asignación y uso eficiente de los ingresos provenientes de la explotación de los recursos naturales no renovables.

**Marco normativo**:
- **Acto Legislativo 05 de 2011**: Creación del SGR actual
- **Ley 1530 de 2012**: Regulación del SGR
- **Decreto Ley 1949 de 2023**: Modernización del SGR

**Objetivos del SGR**:
1. Promover el desarrollo regional equilibrado
2. Reducir desigualdades entre regiones
3. Financiar ciencia, tecnología e innovación
4. Garantizar ahorro para generaciones futuras (FONPET)
5. Asegurar fiscalización de la explotación de recursos

**Componentes del sistema**:

**Ingresos**:
- Regalías por explotación de hidrocarburos
- Regalías por explotación minera
- Rendimientos financieros
- Otros ingresos no corrientes

**Asignaciones** (distribución):
- Asignaciones Directas (25%): Productores
- Inversión Local y Regional (55%)
- Ciencia, Tecnología e Innovación (10%)
- Desarrollo Regional (17%)
- Paz y Medio Ambiente (3%)
- Asignaciones especiales (FONPET, SSEC, Fiscalización)

**Órganos**:
- **OCAD** (Órganos Colegiados de Administración y Decisión): Aprueban proyectos
- **Comisión Rectora del SGR**: Orientación y política del sistema
- **DNP**: Distribución de recursos
- **MinHacienda**: Giros y pagos

**Procedimientos**:
- Planeación: Plan de Recursos (10 años) y Plan Bienal de Caja (24 meses)
- Aprobación de proyectos en OCAD
- Ejecución a través del SPGR
- Seguimiento por SSEC (Sistema de Seguimiento, Evaluación y Control)

**Diferencia con SGP**:
- SGP: Transferencias fijas del presupuesto nacional
- SGR: Recursos variables según explotación de recursos naturales

**Documentación completa**: [04-00. Introducción al SGR](../04-sgr/04-00-sgr-introduccion.md)

---

### P11: ¿Qué son los ingresos corrientes del SGR?

**Respuesta**:

Los **ingresos corrientes** corresponden a los recursos proyectados que se esperan recaudar durante el bienio por la explotación de los recursos naturales no renovables (RNNR), como minerales, hidrocarburos y gas.

**Características**:
- Son **proyecciones** basadas en estimaciones de producción y precios
- Se incluyen en el **Plan de Recursos (PR)** de 10 años
- Conforman la base del **presupuesto bienal del SGR**
- Se distribuyen mediante el **Plan Bienal de Caja (PBC)**
- Generan **Instrucciones de Abono a Cuenta (IAC)** mensuales

**Fuentes de ingresos corrientes**:

**Hidrocarburos**:
- Producción de petróleo (barriles por día)
- Producción de gas (pies cúbicos)
- Regalías según tarifas progresivas

**Minería**:
- Producción de carbón (toneladas)
- Producción de oro (onzas)
- Producción de níquel, esmeraldas, otros minerales
- Regalías según tarifas por mineral

**Metodología de cálculo**:
```
Ingresos Corrientes = Producción Estimada × Precio Internacional × Tarifa de Regalía

Ejemplo (Petróleo):
  Producción: 800,000 barriles/día
  Precio: US$ 70/barril
  Tarifa regalía: 8% (promedio)
  Tasa de cambio: $4,000/USD

  Regalía diaria = 800,000 × 70 × 0.08 × 4,000 = $17,920 millones/día
  Regalía anual ≈ $6.5 billones
```

**Uso del término "corriente"**:
No se refiere a "año en curso", sino a flujos regulares y permanentes de recaudo (vs. ingresos extraordinarios o no corrientes).

**Base para cálculos**:
- **CTI (10%)**: Se calcula sobre ingresos corrientes
- **Distribución de asignaciones**: Proporcional a ingresos corrientes proyectados

**Consulta en SICODIS**:
- [Módulo: Plan de Recursos](../04-sgr/04-05-sgr-plan-recursos.md)
- [Módulo: Recaudo Mensual](../04-sgr/04-01-sgr-recaudo-mensual.md)

**Ver también**:
- [P12: Ingresos no corrientes](#p12-qué-son-los-ingresos-no-corrientes)
- [Glosario: Plan de Recursos](./06-01-glosario-terminos.md#plan-de-recursos-pr)

---

### P12: ¿Qué son los ingresos no corrientes?

**Respuesta**:

Los **ingresos no corrientes** corresponden a recursos apropiados en la ley bienal de presupuesto o mediante decreto, que **no dependen del recaudo por la explotación directa** de los recursos naturales no renovables (RNNR) durante el bienio.

**Tipos de ingresos no corrientes**:

**1. Rendimientos Financieros**:
- Intereses generados por recursos del SGR depositados en cuentas bancarias
- Inversiones temporales de liquidez
- Rendimientos de FONPET

**2. Desahorro**:
- Recursos previamente ahorrados en FONPET
- Liberados para inversión territorial
- Requiere decreto de apropiación

**3. Mayor Recaudo de Bienios Anteriores**:
- Excedentes de recaudo de bienios pasados
- Distribuidos según normativa vigente
- Requiere liquidación del bienio anterior

**4. Recuperación de Cartera**:
- Devolución de recursos por proyectos no ejecutados
- Recuperación de anticipos
- Reintegros voluntarios

**5. Multas y Sanciones**:
- Penalidades por incumplimiento normativo
- Sanciones administrativas
- Intereses moratorios

**6. Excedentes Financieros**:
- Saldos no comprometidos de bienios anteriores
- Disponibilidad presupuestal residual

**Diferencias con ingresos corrientes**:

| Característica | Corrientes | No Corrientes |
|---|---|---|
| **Origen** | Explotación RNNR del bienio | Fuentes extraordinarias |
| **Predictibilidad** | Proyectables | Variables e inciertas |
| **Inclusión en PBC inicial** | Sí | No (se adicionan) |
| **Base para CTI** | Sí (10% de corrientes) | No |
| **Distribución** | Según asignaciones regulares | Puede tener reglas especiales |

**Apropiación presupuestal**:
- Ingresos corrientes: En ley bienal inicial
- Ingresos no corrientes: Mediante decretos de adición presupuestal durante el bienio

**Instrucciones de Abono a Cuenta (IAC)**:
- IAC corrientes: Mensuales, según PBC
- IAC no corrientes: Puntuales, al momento de apropiar

**Consulta en SICODIS**:
- Los informes diferencian claramente entre corrientes y no corrientes
- [Módulo: Presupuesto y Recaudo](../04-sgr/04-03-sgr-presupuesto-recaudo.md)

---

### P13: ¿Qué es una Instrucción de Abono a Cuenta (IAC)?

**Respuesta**:

Una **Instrucción de Abono a Cuenta (IAC)** es una comunicación oficial que remite el DNP al Ministerio de Hacienda y Crédito Público con los montos resultantes de la distribución de los recursos del SGR, para ser abonados a las cuentas de cada beneficiario.

**Propósito**:
- Comunicar oficialmente la distribución de recursos SGR
- Habilitar recursos para que las entidades territoriales puedan efectuar pagos
- Garantizar trazabilidad en la distribución

**Proceso de IAC**:

```
1. DNP distribuye recursos según criterios legales
   ↓
2. DNP emite IAC con desagregación por beneficiario
   ↓
3. DNP remite IAC al Ministerio de Hacienda
   ↓
4. MinHacienda registra abonos en SPGR
   ↓
5. Beneficiarios acceden a recursos para pagar obligaciones
   ↓
6. Pagos se efectúan directamente a destinatarios finales
```

**Tipos de IAC**:

**1. IAC Mensuales (Ingresos Corrientes)**:
- Periodicidad: Cada mes
- Contenido: Distribución del recaudo corriente del mes
- Base: Plan Bienal de Caja (PBC)
- Monto: Variable según recaudo mensual

**2. IAC de Ingresos No Corrientes**:
- Periodicidad: Puntual (cuando se apropian recursos)
- Contenido: Rendimientos financieros, desahorro, mayor recaudo
- Base: Decreto de apropiación presupuestal
- Monto: Según monto apropiado

**Contenido de una IAC**:
- Número de IAC (consecutivo)
- Fecha de emisión
- Bienio al que corresponde
- Tipo de ingreso (corriente o no corriente)
- Asignación (Directas, Inversión, CTI, etc.)
- Beneficiario (departamento, municipio, entidad)
- Monto a abonar
- Concepto de distribución

**Diferencia IAC vs Giro**:
- **IAC**: Comunicación de distribución (DNP → MinHacienda)
- **Giro**: Transferencia efectiva de dinero (MinHacienda → Cuenta beneficiario)

**Importante**:
Las IAC **NO transfieren recursos a cuentas maestras** de entidades territoriales. Los recursos permanecen en la Cuenta Única del SGR administrada por MinHacienda, y se efectúan pagos directos a destinatarios finales (contratistas, proveedores) a través del SPGR.

**Consulta en SICODIS**:
SICODIS muestra el historial de IAC emitidas por el DNP:
- Fecha de IAC
- Beneficiario
- Monto distribuido
- Acumulado del bienio

**Módulo relacionado**: [04-03. SGR Presupuesto y Recaudo](../04-sgr/04-03-sgr-presupuesto-recaudo.md)

---

### P14: ¿Qué es el recaudo no aforado?

**Respuesta**:

El **recaudo no aforado** son los recursos recaudados por la explotación de los recursos naturales no renovables (RNNR) que **superan la apropiación presupuestal corriente del bienio**, es decir, el monto aforado (proyectado) en la ley bienal de presupuesto.

**Concepto de "aforado"**:
- **Aforar**: Proyectar, estimar, presupuestar
- **Recaudo aforado**: Monto proyectado en el Plan Bienal de Caja (PBC)
- **Recaudo no aforado**: Monto que excede la proyección

**Causas del recaudo no aforado**:

**1. Mayor producción de RNNR**:
- Incremento en barriles de petróleo extraídos
- Mayor extracción de carbón, oro u otros minerales
- Nuevos pozos o minas en operación

**2. Aumento de precios internacionales**:
- Precio del petróleo superior al proyectado
- Cotización de minerales por encima de estimaciones
- Efecto de tasa de cambio (devaluación aumenta recaudo en pesos)

**3. Subestimación en proyecciones**:
- Prudencia fiscal en estimaciones
- Incertidumbre en variables internacionales

**Ejemplo numérico**:
```
Bienio 2025-2026:
  Recaudo aforado (proyectado): $30 billones
  Recaudo real a noviembre 2026: $35 billones
  Recaudo no aforado: $5 billones

  Causas:
    - Precio petróleo: US$ 70/barril (proyectado) vs US$ 85/barril (real)
    - Tasa de cambio: $4,000/USD (proyectada) vs $4,300/USD (real)
```

**Tratamiento del recaudo no aforado**:

**Durante el bienio**:
- Se distribuye según las mismas asignaciones del SGR
- Requiere adición presupuestal mediante decreto
- Genera IAC adicionales

**Al cierre del bienio**:
- Si el recaudo total supera el presupuesto total del SGR, se constituye en **mayor recaudo**
- El mayor recaudo se distribuye en el siguiente bienio según normativa vigente

**Subcategorías**:

**Recaudo no aforado de Asignaciones Directas**:
- Recursos de AD que superan lo proyectado para cada beneficiario
- Durante el bienio: Se distribuye al beneficiario productor
- Al cierre: Si supera presupuesto total, pasa a mayor recaudo general

**Recaudo no aforado de otras asignaciones**:
- Se distribuye proporcionalmente según las reglas de cada asignación

**Consulta en SICODIS**:
- [Módulo: Presupuesto y Recaudo](../04-sgr/04-03-sgr-presupuesto-recaudo.md)
- Sección "Comparativo Presupuesto vs Recaudo"
- Diferencia positiva indica recaudo no aforado

**Ver también**:
- [P15: Recaudo no aforado de Asignaciones Directas](#p15-qué-es-el-recaudo-no-aforado-de-asignaciones-directas)
- [Glosario: Aforado](./06-01-glosario-terminos.md#aforado--no-aforado)

---

### P15: ¿Qué es el recaudo no aforado de Asignaciones Directas?

**Respuesta**:

El **recaudo no aforado de Asignaciones Directas (AD)** son recursos que superan la apropiación presupuestal corriente **por beneficiario** en esta asignación, durante la ejecución del presupuesto bienal.

**Particularidad de Asignaciones Directas**:
- Las AD se distribuyen directamente a productores según su producción certificada
- Cada productor tiene una proyección individual en el PBC
- El recaudo real puede diferir de lo proyectado por productor

**Ejemplo**:
```
Municipio Productor: Puerto Gaitán (Meta)
  AD 20% proyectada bienio 2025-2026: $500,000 millones
  AD 20% recaudada real (nov 2026): $620,000 millones
  Recaudo no aforado AD: $120,000 millones

Causa: Mayor producción de petróleo en campos del municipio
```

**Tratamiento diferenciado**:

**Durante el bienio**:
1. El recaudo no aforado por beneficiario se distribuye **al mismo beneficiario**
2. Se emiten IAC adicionales para ese beneficiario
3. Requiere decreto de adición presupuestal individual

**Al cierre del bienio**:
1. Se verifica si el recaudo total de AD supera el presupuesto total de AD del bienio
2. **Si supera el presupuesto total del SGR** (no solo de AD), se constituye en **mayor recaudo**
3. El mayor recaudo se distribuye en el siguiente bienio según normativa vigente (no necesariamente al mismo productor)

**Diferencia con otras asignaciones**:
- **AD**: Recaudo no aforado va al productor que generó el exceso
- **Otras asignaciones**: Recaudo no aforado se distribuye proporcionalmente según criterios generales

**Escenario de mayor recaudo**:
```
Bienio 2025-2026:
  Total presupuesto SGR: $30 billones
  Total recaudo real: $35 billones
  Mayor recaudo: $5 billones

  Distribución del mayor recaudo (bienio 2027-2028):
    - Inversión Local y Regional
    - Desarrollo Regional
    - CTI
    - Asignaciones especiales
    (Según reglas vigentes al momento de distribución)
```

**Verificación en SICODIS**:
- [Módulo: Recaudo Directas](../04-sgr/04-02-sgr-recaudo-directas.md)
- Columna "Presupuesto" vs "Recaudo Acumulado"
- Diferencia positiva = Recaudo no aforado por beneficiario

**Normativa aplicable**:
- Decreto Ley 1949 de 2023
- Decretos de adición presupuestal del bienio

---

### P16: ¿Qué es el Plan de Recursos (PR)?

**Respuesta**:

El **Plan de Recursos (PR)** es una proyección de las fuentes de financiamiento a **diez años** del Sistema General de Regalías, diferenciando entre minería e hidrocarburos.

**Responsabilidades**:
- **Ministerio de Hacienda y Crédito Público (MHCP)**: Elabora el documento técnico del PR con proyecciones de ingresos
- **Departamento Nacional de Planeación (DNP)**: Efectúa la distribución de los recursos proyectados entre asignaciones, beneficiarios y conceptos de gasto

**Características del Plan de Recursos**:

**Horizonte temporal**: 10 años
- Proyecciones anuales de ingresos del SGR
- Los primeros 2 años: Base del presupuesto bienal
- Años 3-10: Planeación estratégica de mediano/largo plazo

**Componentes**:

**1. Proyección de Producción**:
- Hidrocarburos: Barriles de petróleo/día, pies cúbicos de gas
- Minería: Toneladas de carbón, onzas de oro, toneladas de níquel, etc.

**2. Proyección de Precios Internacionales**:
- Precio del petróleo (US$/barril)
- Precio del carbón térmico y metalúrgico
- Cotización de oro, níquel, otros minerales
- Tasa de cambio peso/dólar

**3. Proyección de Ingresos por Regalías**:
```
Ingresos Proyectados = Producción × Precio × Tarifa Regalía × Tasa de Cambio

Ejemplo año 5 del PR:
  Petróleo: 750,000 barriles/día × US$ 75 × 10% × $4,200 = Proyección anual
  Carbón: 90 millones ton/año × US$ 100 × 8% × $4,200 = Proyección anual
  Total año 5: $32 billones
```

**4. Distribución por Asignaciones**:
Para cada uno de los 10 años:
- Asignaciones Directas (25%)
- Inversión Local y Regional (55%)
- Desarrollo Regional (17%)
- CTI (10% de corrientes)
- Paz y Ambiente (3%)
- Asignaciones especiales (FONPET, SSEC, Fiscalización)

**Relación con el Presupuesto Bienal**:
- Los **años 1 y 2 del PR** constituyen el proyecto de **presupuesto bienal**
- El presupuesto se radica en el Congreso de la República para aprobación
- Una vez aprobado, se convierte en Ley Bienal de Presupuesto del SGR

**Actualización**:
- El PR se actualiza bianualmente
- Cada nuevo bienio requiere un nuevo PR de 10 años
- Permite ajustar proyecciones según realidad del mercado

**Consulta en SICODIS**:
- [Módulo: Plan de Recursos](../04-sgr/04-05-sgr-plan-recursos.md)
- Vista de 10 años con proyecciones
- Desagregación por fuente (minería vs hidrocarburos)
- Distribución por asignación

**Documentos relacionados**:
- Documento técnico del PR (MHCP)
- Resolución de distribución del PR (DNP)
- Ley Bienal de Presupuesto del SGR

---

### P17: ¿Qué es el Plan Bienal de Caja (PBC)?

**Respuesta**:

El **Plan Bienal de Caja (PBC)** es una herramienta de programación financiera a través de la cual se determinan los **flujos estimados de ingresos mensuales** de recursos del presupuesto corriente bienal del SGR, durante los **24 meses** de la ejecución presupuestal.

**Diferencia con Plan de Recursos**:
- **Plan de Recursos**: Proyección de 10 años, marco estratégico
- **Plan Bienal de Caja**: Flujo mensual de 24 meses, operativo

**Características del PBC**:

**Horizonte**: 24 meses (2 años del bienio)
- Mes a mes: Enero año 1 → Diciembre año 2
- Proyección de recaudo mensual
- Base para distribución mensual (IAC)

**Desagregación**:

**Por fuente**:
- Hidrocarburos (petróleo, gas)
- Minería (carbón, oro, níquel, otros)

**Por asignación**:
- Asignaciones Directas (AD 20%, AD 5%)
- Inversión Local (municipios)
- Inversión Departamental
- Desarrollo Regional
- CTI
- Paz y Ambiente
- Asignaciones especiales

**Por beneficiario**:
- Cada departamento
- Cada municipio productor (para AD)
- Entidades especiales (Universidades para CTI, etc.)

**Por mes**:
- Distribución mes a mes de los 24 meses del bienio

**Ejemplo de estructura PBC**:
```
Bienio 2025-2026
Asignación: Inversión Municipal
Departamento: Meta
Municipio: Villavicencio

Mes          | Hidrocarburos | Minería    | Total Mes
-------------|---------------|------------|------------
Ene 2025     | $850 millones | $120 mill  | $970 millones
Feb 2025     | $880 millones | $125 mill  | $1,005 millones
Mar 2025     | $920 millones | $130 mill  | $1,050 millones
...
Dic 2026     | $1,100 mill   | $150 mill  | $1,250 millones

Total Bienio: $25,000 millones
```

**Uso del PBC**:

**1. Base para IAC mensuales**:
- Cada mes, el DNP emite IAC según el PBC
- El monto de la IAC se ajusta al recaudo real del mes
- Si recaudo > PBC: Recaudo no aforado

**2. Planeación de proyectos**:
- Entidades territoriales conocen flujo esperado de recursos
- Permite programar cronogramas de proyectos
- OCAD priorizan proyectos según disponibilidad PBC

**3. Control presupuestal**:
- Comparación PBC vs Recaudo real
- Identificación de desviaciones
- Ajustes durante el bienio si es necesario

**Elaboración del PBC**:
- Responsable: DNP en coordinación con MHCP
- Base: Plan de Recursos (años 1 y 2)
- Metodología: Distribución mensual según estacionalidad de producción y precios
- Aprobación: Se publica oficialmente al inicio del bienio

**Ajustes al PBC**:
- El PBC puede ajustarse durante el bienio
- Causas: Variaciones significativas en producción o precios
- Requiere resolución del DNP

**Consulta en SICODIS**:
- [Módulo: Plan Bienal de Caja](../04-sgr/04-06-sgr-plan-bienal-caja.md)
- Vista mensual de 24 meses
- Comparación PBC vs Recaudo acumulado
- Gráficos de ejecución presupuestal

**Documentación relacionada**: [04-06. SGR Plan Bienal de Caja](../04-sgr/04-06-sgr-plan-bienal-caja.md)

---

### P18: ¿Qué son los recursos naturales no renovables (RNNR)?

**Respuesta**:

Los **recursos naturales no renovables (RNNR)** son recursos que existen en una cantidad concreta y limitada, que se han formado durante miles o millones de años, y que **se agotan con su extracción** y no pueden regenerarse a escala humana de tiempo.

**Característica fundamental**: La producción se extingue por el transcurso del tiempo y la explotación.

**Tipos de RNNR que generan regalías en Colombia**:

**1. Hidrocarburos**:

**Petróleo crudo**:
- Formación: Restos orgánicos fosilizados durante millones de años
- Yacimientos: Cuencas sedimentarias (Llanos Orientales, Valle del Magdalena, Caribe)
- Medición: Barriles por día (BPDC - Barriles por Día Calendario)
- Tarifa regalía: 8% a 25% según producción

**Gas natural**:
- Asociado al petróleo o en yacimientos independientes
- Medición: Pies cúbicos o metros cúbicos
- Uso: Generación eléctrica, industria, doméstico
- Tarifa regalía: Variable según tipo y producción

**2. Minería**:

**Carbón**:
- Tipos: Térmico (energía), metalúrgico (siderurgia)
- Principales productores: Cesar, La Guajira, Cundinamarca
- Tarifa regalía: 5% a 10%

**Oro**:
- Yacimientos: Aluviales (ríos) y de veta (subterráneo)
- Principales productores: Antioquia, Chocó, Bolívar
- Tarifa regalía: 4% del valor comercial

**Níquel**:
- Yacimientos: Córdoba (Cerro Matoso)
- Tarifa regalía: 12%

**Esmeraldas**:
- Zonas: Boyacá (Muzo, Chivor)
- Tarifa regalía: Variable

**Materiales de construcción**:
- Arena, grava, arcilla, caliza
- Tarifa regalía: Menor que minerales preciosos

**Otros**:
- Cobre, hierro, calizas, sal, fosfatos

**Contraprestación por explotación**:

Producto de la explotación de RNNR, el Estado recibe una **contraprestación económica a título de regalía**, justificada porque:
1. Los RNNR son patrimonio de la Nación (Constitución, art. 332)
2. Son recursos agotables (principio de equidad intergeneracional)
3. Generan impactos ambientales y sociales en territorios productores
4. Deben beneficiar a toda la sociedad, no solo a privados explotadores

**Distribución de regalías**:
- A través del Sistema General de Regalías (SGR)
- Para inversión en desarrollo regional, CTI, ahorro pensional

**Diferencia con recursos renovables**:
- **Renovables**: Agua, viento, solar, biomasa (se regeneran)
- **No renovables**: Petróleo, minerales (se agotan)

**Impacto en finanzas territoriales**:
- Municipios y departamentos productores reciben Asignaciones Directas
- Toda Colombia se beneficia mediante asignaciones de inversión

**Entidades certificadoras de producción**:
- **Agencia Nacional de Hidrocarburos (ANH)**: Certifica producción de petróleo y gas
- **Agencia Nacional de Minería (ANM)**: Certifica producción minera

**Consulta en SICODIS**:
- Los módulos SGR diferencian recaudo por tipo de RNNR (hidrocarburos vs minería)
- [Módulo: Recaudo Mensual](../04-sgr/04-01-sgr-recaudo-mensual.md)

---

### P19: ¿Quién realiza la destinación de recursos para grupos étnicos?

**Respuesta**:

Los **municipios y departamentos** son los responsables de realizar el cálculo de destinaciones étnicas para la financiación de proyectos de inversión con enfoque diferencial, si cumplen con condiciones específicas.

**Asignación étnica del SGR: 2,32% del total**:

**Distribución**:
- **1,0%**: Pueblos y Comunidades Indígenas
- **1,1%**: Comunidades Negras, Afrocolombianas, Raizales y Palenqueras
- **0,22%**: Pueblo Rrom o Gitano

**Condiciones para realizar la destinación**:

**1. Tener presupuesto corriente de Asignaciones Directas (AD)**:
- Solo entidades productoras que reciben AD pueden hacer destinación étnica
- No aplica para entidades que no son productoras

**2. Contar con grupos étnicos acreditados**:
- Pueblos y Comunidades Indígenas acreditados por el Ministerio del Interior
- Comunidades Negras, Afrocolombianas, Raizales y Palenqueras certificadas
- Que **residan en el territorio** de la entidad

**Proceso de destinación**:

**1. Publicación de variables (DNP)**:
El DNP publica anualmente las variables necesarias para el cálculo:
- Población étnica por municipio/departamento (según Ministerio del Interior)
- Índices de pobreza o NBI de población étnica
- Metodología de cálculo

**2. Cálculo indicativo (DNP)**:
- El DNP realiza un cálculo indicativo o referencial
- Publica los montos sugeridos por entidad y grupo étnico
- Este cálculo es orientativo, no vinculante

**3. Validación y destinación (Entidad territorial)**:
- El municipio o gobernación **valida** el cálculo del DNP
- Puede ajustar según particularidades territoriales
- Realiza la **destinación formal** de recursos
- Publica el acto administrativo de destinación

**4. Inversión de recursos**:
- Los recursos destinados se invierten en proyectos con enfoque diferencial
- Participación de autoridades étnicas en priorización
- Seguimiento especial a ejecución

**Importante**:
- Estos recursos **NO se incluyen como apropiaciones presupuestales** en la ley bienal de presupuesto del SGR
- Son una destinación específica dentro de las Asignaciones Directas de cada entidad
- No se transfieren directamente a comunidades étnicas, sino que las entidades territoriales ejecutan proyectos para su beneficio

**Ejemplo de cálculo**:
```
Municipio: Puerto Carreño (Vichada)
  Asignación Directa 20%: $5,000 millones

  Población indígena certificada: 45% de la población
  Destinación étnica indígena (cálculo indicativo DNP): $2,250 millones

  Validación municipio: Confirma $2,250 millones

  Proyectos a financiar:
    - Educación propia intercultural
    - Salud con enfoque diferencial
    - Infraestructura en resguardos
```

**Marco normativo**:
- Decreto Ley 1949 de 2023
- Sentencias de la Corte Constitucional sobre derechos étnicos
- Decretos reglamentarios específicos

**Consulta en SICODIS**:
- SICODIS muestra las Asignaciones Directas totales por entidad
- El desglose de destinación étnica es responsabilidad de la entidad territorial
- No se visualiza separadamente en SICODIS

---

### P20: ¿Cuál entidad se encarga de realizar el giro de recursos de regalías?

**Respuesta**:

El **Ministerio de Hacienda y Crédito Público** es la entidad encargada de realizar el giro (pago) de recursos del Sistema General de Regalías.

**Aclaración fundamental**:

Los recursos del SGR **NO se giran a cuentas maestras** de los beneficiarios de estos recursos. El esquema funciona de manera diferente al SGP.

**Sistema de Presupuesto y Giro de Regalías (SPGR)**:

**Administrador**: Ministerio de Hacienda y Crédito Público

**Mecanismo**:
1. Los recursos del SGR permanecen en la **Cuenta Única del SGR**
2. Las entidades territoriales y beneficiarios **NO reciben transferencias** a sus cuentas bancarias
3. Los pagos se realizan **directamente desde la Cuenta Única** a las cuentas bancarias de los **destinatarios finales** (contratistas, proveedores, empleados)

**Flujo de recursos**:

```
1. Recaudo de regalías
   → Se deposita en Cuenta Única del SGR (MinHacienda)

2. DNP emite Instrucción de Abono a Cuenta (IAC)
   → Comunica a MinHacienda los montos por beneficiario

3. MinHacienda registra abonos en SPGR
   → Cada beneficiario tiene disponibilidad presupuestal

4. Beneficiario (entidad territorial) adquiere obligación legal
   → Aprueba proyecto en OCAD
   → Contrata obra, servicio o suministro

5. Beneficiario solicita pago en SPGR
   → Carga documentos de la obligación
   → Solicita giro directo al contratista

6. MinHacienda verifica y ordena pago
   → Desde Cuenta Única del SGR
   → Directamente a cuenta del contratista/proveedor
```

**Ventajas del sistema**:

**Control y transparencia**:
- Trazabilidad total de recursos
- Prevención de desvío de fondos
- Control en tiempo real

**Eficiencia**:
- Pagos más rápidos a destinatarios finales
- Menos intermediación bancaria
- Reducción de costos financieros

**Legalidad**:
- Pago solo de obligaciones legalmente adquiridas
- Verificación de requisitos antes de cada pago

**Responsabilidades diferenciadas**:

| Entidad | Responsabilidad |
|---|---|
| **DNP** | Distribución de recursos (IAC) |
| **MinHacienda** | Giro y pago a través de SPGR |
| **Entidad territorial** | Contratación y ejecución de proyectos |
| **OCAD** | Aprobación de proyectos |
| **Contraloría** | Control fiscal |

**Acceso al SPGR**:
- Plataforma web administrada por MinHacienda
- Usuarios autorizados de entidades beneficiarias
- Registro de proyectos, contratos y solicitudes de pago
- URL: Consultar en el Ministerio de Hacienda

**Diferencia con SGP**:
- **SGP**: Se transfiere a cuentas maestras de departamentos y municipios (recursos de libre manejo dentro de los sectores)
- **SGR**: Pagos directos desde Cuenta Única (no hay transferencia a entidades territoriales)

**Información en SICODIS**:
- SICODIS muestra las **IAC emitidas** (distribución por DNP)
- La información de **giros efectivos** debe consultarse en SPGR (MinHacienda)

**Documentación**: [04-03. SGR Presupuesto y Recaudo](../04-sgr/04-03-sgr-presupuesto-recaudo.md)

---

### P21: ¿Dónde puede encontrar una entidad territorial información sobre su presupuesto del SGR?

**Respuesta**:

Las entidades territoriales pueden encontrar información sobre su presupuesto del SGR en los **módulos de SICODIS del SGR**, específicamente en la consulta que compara el presupuesto con el recaudo a la fecha.

**Módulos principales en SICODIS**:

**1. Presupuesto y Recaudo SGR** (`/sgr-presupuesto-recaudo`):
- **Contenido**:
  - Presupuesto bienal asignado por entidad
  - Recaudo acumulado a la fecha
  - Comparación presupuesto vs recaudo
  - Porcentaje de ejecución
- **Filtros**:
  - Bienio
  - Departamento
  - Municipio (si aplica)
  - Asignación (Directas, Inversión, CTI, etc.)
- [Ver documentación](../04-sgr/04-03-sgr-presupuesto-recaudo.md)

**2. Recaudo Mensual SGR** (`/sgr-recaudo-mensual`):
- **Contenido**:
  - IAC emitidas mes a mes
  - Recaudo corriente mensual
  - Acumulado del bienio
  - Desagregación por fuente (hidrocarburos, minería)
- **Utilidad**: Seguimiento mensual de nuevos recursos
- [Ver documentación](../04-sgr/04-01-sgr-recaudo-mensual.md)

**3. Recaudo Asignaciones Directas** (`/sgr-recaudo-directas`) - **Solo para productores**:
- **Contenido**:
  - AD 20% y AD 5% por municipio/departamento productor
  - Recaudo mensual de AD
  - Presupuesto vs recaudo de AD
  - Producción certificada (barriles, toneladas)
- **Aplica solo a**: Entidades productoras de RNNR
- [Ver documentación](../04-sgr/04-02-sgr-recaudo-directas.md)

**4. Plan Bienal de Caja** (`/sgr-plan-bienal-caja`):
- **Contenido**:
  - Flujo proyectado mensual para 24 meses
  - Programación de recursos disponibles
  - Base para planeación de proyectos
- **Utilidad**: Planeación financiera del bienio
- [Ver documentación](../04-sgr/04-06-sgr-plan-bienal-caja.md)

**Características del recaudo SGR**:

**Recursos mensuales**:
Todos los meses se comunican nuevos recursos del SGR para los beneficiarios del presupuesto corriente mediante Instrucciones de Abono a Cuenta (IAC).

**Dependencia del recaudo**:
El recaudo depende de:
- **Producción de RNNR**: Barriles de petróleo, toneladas de carbón, etc.
- **Precios internacionales**: Cotización de petróleo, minerales
- **Tasa de cambio**: Impacto en valor en pesos del recaudo

**Variabilidad**:
A diferencia del SGP (montos fijos), el SGR es variable mes a mes según el recaudo real.

**Entidades productoras**:

Para municipios y departamentos donde se explotan minerales e hidrocarburos:
- El flujo de ingresos mensuales de **Asignaciones Directas** depende de la producción y comercialización de materias primas en su territorio
- Mayor producción → Mayor recaudo de AD
- Consulta específica en módulo de Recaudo Directas

**Ejemplo de consulta**:
```
Entidad: Departamento del Meta (productor de petróleo)
Bienio: 2025-2026
Módulo: Presupuesto y Recaudo SGR

Resultados visualizados:
  Presupuesto bienal total Meta: $850,000 millones
    - AD 20%: $600,000 millones
    - Inversión Departamental: $200,000 millones
    - CTI: $50,000 millones

  Recaudo acumulado (a septiembre 2026): $720,000 millones
    - AD 20%: $520,000 millones (86.7% del presupuesto AD)
    - Inversión Departamental: $170,000 millones (85%)
    - CTI: $30,000 millones (60%)

  Ejecución promedio: 84.7%
  Meses restantes del bienio: 3
```

**Periodicidad de actualización**:
- SICODIS se actualiza mensualmente
- Tras cada emisión de IAC por parte del DNP
- Generalmente en la primera quincena de cada mes

**Descarga de información**:
- Todos los módulos permiten exportar a Excel
- Archivos incluyen series históricas y metadatos

**Canales adicionales**:
- **SPGR** (MinHacienda): Información de giros y pagos efectivos
- **SUIFP-SGR**: Sistema de proyectos e inversión
- **Comunicaciones oficiales DNP**: IAC y distribuciones

---

### P22: ¿Cómo distribuye los recursos del SGR el DNP?

**Respuesta**:

El DNP distribuye los recursos del SGR atendiendo los **criterios de distribución** establecidos en la Constitución y la ley, utilizando **variables certificadas** por las entidades competentes.

**Marco normativo**:
- Constitución Política (artículos 360 y 361)
- Acto Legislativo 05 de 2011
- Ley 1530 de 2012
- Decreto Ley 1949 de 2023

**Criterios de distribución por asignación**:

**1. Asignaciones Directas (AD 20% + AD 5%)**:

**Distribución realizada por**:
- **Agencia Nacional de Hidrocarburos (ANH)**: AD de hidrocarburos
- **Agencia Nacional de Minería (ANM)**: AD de minería

**Criterio**:
- Proporcional a la **producción certificada** en cada municipio/departamento productor
- AD 20%: Departamentos y municipios productores, municipios portuarios
- AD 5%: Solo municipios productores

**Variables**:
- Producción de petróleo (barriles) por pozo/campo
- Producción de gas (pies cúbicos)
- Producción minera (toneladas, onzas) por mina
- Volumen transportado por puertos

**2. Inversión Local y Regional (55%)**:

**Distribución realizada por**: DNP

**Criterios**:

**Para municipios (45% del SGR)**:
- **Población**: Censo DANE (peso: 40%)
- **Necesidades Básicas Insatisfechas (NBI)**: DANE (peso: 40%)
- **Desempleo**: DANE (peso: 10%)
- **Población víctima del conflicto**: Registro Único de Víctimas (peso: 10%)

**Para departamentos (10% del SGR)**:
- Mismos criterios que municipios (población, NBI, desempleo, víctimas)
- Aplicación proporcional por departamento

**Fórmula general**:
```
Asignación_i = Presupuesto_Total × (Ponderación_Población × Pob_i / Pob_Total
                                   + Ponderación_NBI × NBI_i / NBI_Total
                                   + Ponderación_Desempleo × Desemp_i / Desemp_Total
                                   + Ponderación_Víctimas × Vict_i / Vict_Total)
```

**3. Desarrollo Regional (17%)**:

**Distribución**: Por regiones del país

**Criterios**:
- Necesidades regionales de inversión
- Proyectos de impacto regional
- Articulación entre departamentos

**4. Ciencia, Tecnología e Innovación - CTI (10% de ingresos corrientes)**:

**Distribución**:
- Fondo de CTI del SGR
- Proyectos aprobados por OCAD CTI
- Universidades (asignación directa)

**Variables**:
- Capacidades científicas regionales
- Grupos de investigación certificados (Minciencias)

**5. Paz y Ambiente (3%)**:

**Criterios**:
- Municipios PDET (Programas de Desarrollo con Enfoque Territorial)
- Municipios con afectación por conflicto armado
- Proyectos ambientales prioritarios

**Variables utilizadas en la distribución**:

**Certificadas por entidades competentes**:

| Variable | Entidad Certificadora | Uso |
|---|---|---|
| **Población** | DANE (Censo, proyecciones) | Inversión, Desarrollo |
| **NBI** | DANE | Inversión, Desarrollo |
| **Desempleo** | DANE | Inversión |
| **Víctimas del conflicto** | Unidad para las Víctimas | Inversión, Paz |
| **Producción RNNR** | ANH, ANM | Asignaciones Directas |
| **Pasivo pensional no cubierto** | Ministerio de Hacienda | FONPET |
| **Población étnica** | Ministerio del Interior | Destinación étnica |
| **Grupos investigación** | Minciencias | CTI |

**Proceso de distribución**:

```
1. Certificación de variables (entidades competentes)
   ↓
2. DNP valida y consolida variables certificadas
   ↓
3. DNP aplica fórmulas de distribución según normativa
   ↓
4. DNP elabora proyecto de distribución (Plan de Recursos)
   ↓
5. Socialización y ajustes
   ↓
6. DNP emite Resolución de distribución oficial
   ↓
7. Publicación en SICODIS
```

**Transparencia**:
- Todas las variables y metodologías son públicas
- Publicación en página DNP y SICODIS
- Trazabilidad total del cálculo de asignaciones

**Consulta de distribución**:
- [Módulo: Plan de Recursos](../04-sgr/04-05-sgr-plan-recursos.md)
- [Módulo: Comparativo SGR](../04-sgr/04-07-sgr-comparativo.md)

**Documentación metodológica**:
- Resoluciones del DNP con metodologías de distribución
- Disponibles en sección "Documentos Financiamiento Territorial" del DNP

---

### P23: ¿Quién distribuye el 2,32% para Grupos Étnicos?

**Respuesta**:

El **DNP distribuye el 2,32% para grupos étnicos** del total de las proyecciones de ingresos del SGR para el bienio, con la siguiente desagregación:

**Distribución del 2,32% étnico**:

**1,0% - Pueblos y Comunidades Indígenas**:
- Aplicado sobre el total de ingresos proyectados del SGR
- Distribuido entre municipios y departamentos con presencia indígena certificada
- Criterio: Población indígena acreditada por el Ministerio del Interior

**1,1% - Comunidades Negras, Afrocolombianas, Raizales y Palenqueras (NARP)**:
- Aplicado sobre el total de ingresos del SGR
- Distribuido entre municipios y departamentos con presencia NARP certificada
- Criterio: Población NARP acreditada por el Ministerio del Interior

**0,22% - Pueblo Rrom o Gitano**:
- Aplicado sobre el total del SGR
- Distribuido entre municipios y departamentos con presencia Rrom certificada
- Criterio: Población Rrom acreditada por el Ministerio del Interior

**Metodología de distribución (DNP)**:

**1. Certificación de población étnica**:
- El **Ministerio del Interior** certifica anualmente:
  - Pueblos y comunidades indígenas por municipio/departamento
  - Comunidades NARP por territorio
  - Presencia del Pueblo Rrom
- Se verifica que las comunidades residan efectivamente en el territorio

**2. Cálculo de asignación por grupo étnico**:
```
Total SGR bienio: $60 billones (ejemplo)

Asignación Pueblos Indígenas = $60 billones × 1,0% = $600,000 millones
Asignación NARP = $60 billones × 1,1% = $660,000 millones
Asignación Rrom = $60 billones × 0,22% = $132,000 millones

Total asignación étnica = $1,392,000 millones (2,32%)
```

**3. Distribución territorial**:

El DNP distribuye cada porcentaje entre los municipios y departamentos proporcionalmente a:
- **Población étnica certificada** en cada territorio
- **Índices de pobreza o NBI** de la población étnica
- **Criterios diferenciales** según normativa de derechos étnicos

**4. Publicación de distribución**:
- El DNP publica la distribución étnica por territorio
- Se especifica el monto por municipio/departamento
- Se identifica el grupo étnico beneficiario

**Responsabilidad de las entidades territoriales**:

Aunque el DNP distribuye los recursos, las **entidades territoriales son responsables de**:
- Validar el cálculo del DNP
- Realizar la **destinación específica** dentro de sus Asignaciones Directas (si son productoras)
- Garantizar que los recursos se inviertan en proyectos con **enfoque diferencial**
- Asegurar la **participación de autoridades étnicas** en la priorización de proyectos

**Inversión de recursos étnicos**:

**Proyectos financiables**:
- Educación propia e intercultural
- Salud con enfoque diferencial
- Infraestructura en territorios étnicos (resguardos, consejos comunitarios)
- Proyectos productivos y de seguridad alimentaria
- Fortalecimiento organizativo
- Cultura y pervivencia étnica

**Participación comunitaria**:
- Las autoridades étnicas participan en la identificación de necesidades
- Concertación de proyectos
- Seguimiento a la ejecución

**Ejemplo de distribución**:
```
Bienio 2025-2026: Total SGR $60 billones

1% Pueblos Indígenas ($600,000 millones):
  Departamento Vaupés: $120,000 millones (20% población indígena nacional)
  Departamento Guainía: $90,000 millones (15%)
  ...

1.1% NARP ($660,000 millones):
  Departamento Chocó: $198,000 millones (30% población NARP)
  Bolívar: $132,000 millones (20%)
  ...

0.22% Rrom ($132,000 millones):
  Distribuido entre territorios con presencia certificada Rrom
```

**Marco normativo**:
- Decreto Ley 1949 de 2023
- Sentencias de la Corte Constitucional (T-428/92, C-317/12, otras)
- Protocolos de consulta previa con comunidades étnicas

**Consulta en SICODIS**:
- La distribución étnica se incluye dentro de las asignaciones territoriales
- Los módulos SGR muestran el total por entidad
- El desglose étnico específico puede consultarse en documentos técnicos del DNP

**Documentación DNP**:
- Resoluciones de distribución étnica
- Metodologías y variables certificadas
- Disponibles en la sección de Financiamiento Territorial

---

### P24: ¿Cuáles entidades son competentes para realizar la distribución de recursos del SGR?

**Respuesta**:

Varias entidades tienen competencia para distribuir recursos del SGR según la asignación específica:

**1. Agencia Nacional de Minería (ANM)**:

**Responsabilidad**: Distribución de **Asignaciones Directas de Minería**

**Recursos que distribuye**:
- AD 20% de minería (carbón, oro, níquel, otros minerales)
- AD 5% adicional de minería para municipios productores

**Criterio**: Producción certificada de minerales por municipio/departamento

**Base normativa**: Decreto Ley 1949 de 2023

---

**2. Agencia Nacional de Hidrocarburos (ANH)**:

**Responsabilidad**: Distribución de **Asignaciones Directas de Hidrocarburos**

**Recursos que distribuye**:
- AD 20% de hidrocarburos (petróleo, gas)
- AD 5% adicional de hidrocarburos para municipios productores
- Asignación para municipios portuarios

**Criterio**: Producción certificada de petróleo y gas por campo/pozo

**Base normativa**: Decreto Ley 1949 de 2023

---

**3. Departamento Nacional de Planeación (DNP)**:

**Responsabilidad**: Distribución de las **demás asignaciones** del SGR que se destinan a inversión, ahorro y seguimiento

**Recursos que distribuye**:

**Inversión Local y Regional (55%)**:
- Inversión municipal (45%)
- Inversión departamental (10%)

**Desarrollo Regional (17%)**:
- Por regiones del país

**Paz y Ambiente (3%)**:
- Proyectos de paz y ambientales

**Asignación étnica (2,32%)**:
- 1% Pueblos Indígenas
- 1,1% Comunidades NARP
- 0,22% Pueblo Rrom

**Ahorro - FONPET**:
- Fondo de pensiones territoriales

**SSEC**:
- Sistema de Seguimiento, Evaluación y Control
- Funcionamiento del sistema

**Criterios**: Población, NBI, desempleo, víctimas, población étnica, pasivo pensional (según certificación de entidades competentes)

**Base normativa**: Constitución, Acto Legislativo 05/2011, Ley 1530/2012, Decreto Ley 1949/2023

---

**4. Comisión Rectora del SGR**:

**Responsabilidad**: Determinación de apropiaciones presupuestales para **Funcionamiento del SGR**

**Recursos sobre los que decide**:
- Gastos administrativos del SGR
- Funcionamiento de OCAD
- Sistemas de información
- Capacitación y asistencia técnica

**Composición**:
- Ministros de Estado
- Directores de agencias
- Representantes territoriales
- Otros miembros según ley

**No distribuye directamente**: Establece las apropiaciones, el DNP realiza la distribución técnica

**Base normativa**: Ley 1530 de 2012, Decreto Ley 1949 de 2023

---

**5. Ministerio de Minas y Energía**:

**Responsabilidad**: Distribución de recursos de **Fiscalización**

**Recursos que distribuye**:
- Asignación para fiscalización de la explotación de RNNR
- Recursos para entidades de control ambiental y minero

**Beneficiarios**:
- Autoridades ambientales
- Entidades de fiscalización minera
- Control y vigilancia de la explotación

**Base normativa**: Decreto Ley 1949 de 2023

---

**Resumen de competencias**:

| Asignación | Entidad Distribuidora | % del SGR |
|---|---|---|
| **AD 20% Minería** | ANM | ~5% |
| **AD 5% Minería** | ANM | ~1.25% |
| **AD 20% Hidrocarburos** | ANH | ~15% |
| **AD 5% Hidrocarburos** | ANH | ~3.75% |
| **Inversión Local** | DNP | 45% |
| **Inversión Departamental** | DNP | 10% |
| **Desarrollo Regional** | DNP | 17% |
| **Paz y Ambiente** | DNP | 3% |
| **CTI** | DNP | 10% corrientes |
| **FONPET** | DNP | Variable |
| **Funcionamiento** | Comisión Rectora / DNP | <1% |
| **Fiscalización** | MinMinas | <1% |
| **SSEC** | DNP | <1% |

---

**Coordinación interinstitucional**:

Aunque cada entidad tiene su competencia específica, existe coordinación entre:
- **DNP**: Consolida el Plan de Recursos global y el presupuesto bienal
- **ANM y ANH**: Certifican producción y distribuyen AD
- **MinHacienda**: Ejecuta giros de todas las asignaciones
- **Comisión Rectora**: Define políticas generales del SGR

**Verificación de distribución**:
- Todas las distribuciones se publican en SICODIS
- Transparencia en metodologías y variables
- Auditoría por Contraloría General de la República

**Documentación**:
- Resoluciones de distribución de cada entidad
- Disponibles en sitios web institucionales y DNP
- Consulta pública en SICODIS

---

## PGN - Presupuesto General de la Nación

### P25: ¿Qué es la regionalización del PGN?

**Respuesta**:

La **regionalización del Presupuesto General de la Nación (PGN)** es el proceso mediante el cual se identifica y asigna geográficamente el presupuesto de inversión del gobierno nacional a departamentos y municipios de Colombia.

**Propósito**:
- Conocer la distribución territorial del presupuesto nacional de inversión
- Transparencia en la asignación de recursos públicos
- Planeación y coordinación entre niveles de gobierno
- Seguimiento a la ejecución regional

**Alcance**:
- **Solo presupuesto de inversión**: No incluye funcionamiento ni deuda pública
- **Ejecución del nivel nacional**: Recursos ejecutados directamente por entidades del gobierno nacional
- **Proyectos con ubicación geográfica**: Se excluyen proyectos de alcance nacional sin localización específica

**Tipos de regionalización en SICODIS**:

**1. Regionalización Programación**:
- Presupuesto inicial asignado por departamento/municipio
- Proyectos priorizados al inicio de la vigencia
- Por sector (educación, transporte, agricultura, etc.)
- [Módulo: PGN Regionalización Programación](../05-pgn/05-01-pgn-regionalizacion-programacion.md)

**2. Regionalización Seguimiento**:
- Ejecución presupuestal acumulada
- Compromisos, obligaciones y pagos por territorio
- Avance de proyectos
- Comparación programado vs ejecutado
- [Módulo: PGN Regionalización Seguimiento](../05-pgn/05-02-pgn-regionalizacion-seguimiento.md)

**Sectores incluidos**:
- Agricultura y desarrollo rural
- Transporte e infraestructura
- Educación
- Salud
- Vivienda y agua potable
- Ambiente
- Ciencia y tecnología
- Otros sectores de inversión

**Ejemplo**:
```
Departamento: Antioquia
Vigencia: 2025
Presupuesto regionalizado (inversión nacional): $850,000 millones

Distribución por sector:
  - Transporte (vías): $400,000 millones
  - Agricultura: $200,000 millones
  - Educación: $100,000 millones
  - Salud: $80,000 millones
  - Otros sectores: $70,000 millones
```

**Diferencia con SGP y SGR**:
- **SGP**: Transferencias del nivel nacional a entidades territoriales (recursos territoriales)
- **SGR**: Regalías distribuidas a territorios (recursos territoriales)
- **PGN regionalizado**: Inversión ejecutada por el nivel nacional en los territorios (no se transfiere a entidades territoriales)

**Consulta en SICODIS**: [05-00. Introducción al PGN](../05-pgn/05-00-pgn-introduccion.md)

---

### P26: ¿Cómo consultar proyectos de inversión nacional en un departamento?

**Respuesta**:

Los proyectos de inversión nacional en un departamento se pueden consultar en el módulo **PGN Regionalización** de SICODIS:

**Pasos para consultar**:

**1. Acceder al módulo**:
- Menú: "Informes PGN" → "Regionalización Programación" o "Regionalización Seguimiento"
- Rutas: `/pgn-regionalizacion-programacion` o `/pgn-regionalizacion-seguimiento`

**2. Seleccionar filtros**:
- **Vigencia**: Año fiscal de interés (2023, 2024, 2025, 2026)
- **Departamento**: Elegir el departamento específico
- **Sector** (opcional): Filtrar por sector de inversión

**3. Visualizar resultados**:
- Tabla con proyectos de inversión
- Presupuesto asignado por proyecto
- Entidad ejecutora
- Ejecución presupuestal (en módulo de Seguimiento)

**Información disponible por proyecto**:
- Código BPIN (Banco de Programas y Proyectos de Inversión)
- Nombre del proyecto
- Entidad responsable
- Sector
- Apropiación presupuestal
- Ejecución (compromisos, obligaciones, pagos)
- Municipios beneficiados

**Módulo adicional**: **PGN Inversión por Sector**:
- Ruta: `/pgn-inversion-por-sector`
- Análisis por sectores económicos
- Comparación de sectores entre departamentos
- [Ver documentación](../05-pgn/05-03-pgn-inversion-sector.md)

**Exportación de datos**:
- Botón "Exportar Excel" en todos los módulos
- Descarga completa de proyectos y montos
- Útil para análisis detallado offline

**Ejemplo de consulta**:
```
Departamento: Cauca
Vigencia: 2025
Sector: Transporte

Resultados:
  Proyecto 1: Rehabilitación vía Popayán-Piendamó (30 km)
    Entidad: INVIAS
    Presupuesto: $80,000 millones
    BPIN: 2023000100123

  Proyecto 2: Puente sobre río Cauca
    Entidad: INVIAS
    Presupuesto: $120,000 millones
    BPIN: 2024000100456

  Total sector Transporte Cauca 2025: $200,000 millones
```

**Fuentes complementarias**:
- **Sistema General de Regalías (SUIFP-SGR)**: Proyectos financiados con regalías
- **MapaInversiones**: Georreferenciación de proyectos del DNP
- **SIIF Nación**: Ejecución presupuestal detallada (Ministerio de Hacienda)

**Documentación**: [05-01. PGN Regionalización Programación](../05-pgn/05-01-pgn-regionalizacion-programacion.md)

---

### P27: ¿Qué es el BPIN y cómo se relaciona con SICODIS?

**Respuesta**:

El **BPIN (Banco de Programas y Proyectos de Inversión)** es el sistema de información del DNP que registra, consolida y provee información sobre los programas y proyectos de inversión pública viables, técnica, ambiental y socialmente, susceptibles de ser financiados con recursos del Presupuesto General de la Nación.

**Funciones del BPIN**:

**1. Registro de proyectos**:
- Formulación de proyectos de inversión
- Metodología General Ajustada (MGA)
- Información técnica, financiera y social

**2. Viabilización**:
- Evaluación de viabilidad técnica
- Aprobación de recursos
- Priorización de proyectos

**3. Seguimiento**:
- Ejecución física y financiera
- Indicadores de resultado
- Evaluación de impacto

**Código BPIN**:
Cada proyecto registrado recibe un **código único BPIN**:
```
Formato: AAAA9999999999
  AAAA: Año de registro
  9999999999: Número consecutivo

Ejemplo: 2024000100123
  - Registrado en 2024
  - Número de proyecto: 100123
```

**Relación con SICODIS**:

**En módulos PGN de SICODIS**:
- Los proyectos de inversión se identifican por código BPIN
- Permite trazabilidad y consulta detallada
- Enlace entre presupuesto y proyectos específicos

**Información en SICODIS con BPIN**:
- Nombre del proyecto
- Entidad ejecutora
- Presupuesto asignado
- Regionalización (departamento, municipio)
- Sector de inversión
- Ejecución presupuestal

**Ejemplo en SICODIS**:
```
Módulo: PGN Regionalización Programación
Departamento: Boyacá
Vigencia: 2025

Proyecto visualizado:
  BPIN: 2023000100456
  Nombre: "Adecuación de distritos de riego en el Alto Chicamocha"
  Entidad: Agencia de Desarrollo Rural (ADR)
  Sector: Agricultura
  Presupuesto 2025: $25,000 millones
  Municipios: Tunja, Samacá, Ventaquemada
```

**Acceso al BPIN completo**:
- **Plataforma BPIN-DNP**: https://bpin.dnp.gov.co
- Consulta pública de proyectos
- Información detallada de cada BPIN
- Fichas técnicas, objetivos, poblaciones beneficiadas

**Diferencia BPIN vs SICODIS**:
- **BPIN**: Sistema de gestión de proyectos (formulación, evaluación, seguimiento técnico)
- **SICODIS**: Sistema de consulta de distribución de recursos (enfoque presupuestal y territorial)

**Complementariedad**:
- SICODIS muestra "cuánto y dónde" se invierte
- BPIN muestra "qué proyectos" y "cómo se ejecutan"
- Ambos sistemas se complementan para transparencia total

**Documentación**: [05-00. Introducción al PGN](../05-pgn/05-00-pgn-introduccion.md)

---

## Herramientas y Consultas

### P28: ¿Cómo exportar datos de SICODIS a Excel?

**Respuesta**:

Todos los módulos de SICODIS cuentan con funcionalidad de **exportación a Excel** para facilitar el análisis offline de los datos.

**Ubicación del botón**:
- Esquina superior derecha de las tablas
- Icono: Archivo Excel (.xlsx) o etiqueta "Exportar Excel" / "Descargar"
- Disponible en todos los módulos de reportes (SGP, SGR, PGN)

**Proceso de exportación**:

**1. Configurar filtros**:
- Seleccionar vigencia, departamento, municipio
- Aplicar filtros deseados (sector, asignación, etc.)
- El Excel contendrá solo los datos filtrados

**2. Hacer clic en "Exportar Excel"**:
- El navegador genera el archivo
- Descarga automática (carpeta de Descargas)

**3. Abrir archivo**:
- Formato: `.xlsx` (compatible con Excel, LibreOffice, Google Sheets)
- Preserva formato de moneda y porcentajes
- Incluye metadatos de la consulta

**Contenido del archivo Excel**:

**Hoja 1: Datos principales**:
- Tabla con todos los registros visualizados
- Formato de moneda: `$#,##0`
- Formato de porcentaje: `0.0%`
- Preservación de jerarquías (indentación en TreeTables)

**Hoja 2: Metadatos** (en algunos módulos):
- Vigencia consultada
- Departamento y municipio
- Fecha de generación del reporte
- Fuente de datos
- URL de SICODIS

**Ejemplo de archivo generado**:
```
Nombre: SGP_Resumen_Medellin_2025.xlsx

Contenido Hoja 1 "Resumen SGP":
┌─────────────────────────────┬────────────────┬──────────┐
│ Concepto                    │ Valor Asignado │ % Total  │
├─────────────────────────────┼────────────────┼──────────┤
│ 1. TOTAL SGP                │ $1.234.567.890 │ 100,0%   │
│   1.1. EDUCACIÓN            │ $722.222.222   │  58,5%   │
│     1.1.1. Prestación Serv. │ $600.000.000   │  48,6%   │
│   ...                       │ ...            │ ...      │
└─────────────────────────────┴────────────────┴──────────┘

Contenido Hoja 2 "Metadatos":
  Vigencia: 2025
  Departamento: 05 - Antioquia
  Municipio: 05001 - Medellín
  Fecha de generación: 2026-04-09 10:30:00
  Fuente: SICODIS - DNP
```

**Ventajas de exportar a Excel**:
- Análisis personalizado con fórmulas
- Generación de gráficos propios
- Comparación entre múltiples consultas
- Integración con otros datos institucionales
- Elaboración de presentaciones e informes

**Formatos alternativos**:
Algunos módulos también ofrecen:
- **Copiar al portapapeles**: Formato TSV (separado por tabuladores)
- **Imprimir a PDF**: Versión imprimible del reporte

**Limitaciones**:
- El Excel contiene solo los datos consultados (no toda la base de datos)
- Para consultas masivas, realizar múltiples exportaciones
- Tamaño máximo: Depende del navegador (generalmente sin límite práctico)

**Módulos con exportación**:
- ✓ Todos los módulos SGP
- ✓ Todos los módulos SGR
- ✓ Todos los módulos PGN
- ✓ Dashboards y reportes

---

### P29: ¿Con qué frecuencia se actualiza la información en SICODIS?

**Respuesta**:

La frecuencia de actualización de SICODIS varía según el sistema consultado:

**Sistema General de Participaciones (SGP)**:

**Frecuencia**: **Mensual**

**Actualización**:
- Tras cada distribución mensual de doceavas
- Generalmente durante la primera quincena de cada mes
- Posterior al giro efectivo de recursos por el Ministerio de Hacienda

**Contenido actualizado**:
- Doceavas distribuidas del mes
- Acumulado de transferencias del año
- Estado de giros por municipio/departamento

**Meses de actualización**: Enero a diciembre (12 actualizaciones anuales)

**Ejemplo**:
```
Actualización febrero 2025:
  - Doceava de febrero 2025: Publicada ~15 de febrero
  - Acumulado enero-febrero 2025: Actualizado
  - Histórico 2024: Sin cambios (consolidado)
```

---

**Sistema General de Regalías (SGR)**:

**Frecuencia**: **Mensual**

**Actualización**:
- Tras cada emisión de Instrucción de Abono a Cuenta (IAC)
- Generalmente durante la primera quincena de cada mes
- Publicación del recaudo corriente del mes anterior

**Contenido actualizado**:
- IAC mensuales (recaudo corriente)
- Acumulado del bienio
- Comparación presupuesto vs recaudo
- Asignaciones Directas por productor

**Actualizaciones especiales**:
- IAC de ingresos no corrientes: Cuando se emiten (no tienen periodicidad fija)
- Plan Bienal de Caja: Ajustes puntuales si se modifica durante el bienio

**Ejemplo**:
```
Actualización marzo 2026 (bienio 2025-2026):
  - IAC de recaudo febrero 2026: Publicada ~15 marzo
  - Acumulado bienio (ene 2025 - feb 2026): 14 meses
  - Plan de Recursos 2025-2034: Sin cambios (estático hasta nuevo bienio)
```

---

**Presupuesto General de la Nación (PGN)**:

**Frecuencia**: **Trimestral o Semestral**

**Regionalización Programación**:
- Actualización: **Anual** (al inicio de cada vigencia fiscal)
- Contenido: Presupuesto inicial regionalizado

**Regionalización Seguimiento**:
- Actualización: **Trimestral** (marzo, junio, septiembre, diciembre)
- Contenido: Ejecución presupuestal acumulada (compromisos, obligaciones, pagos)
- Fuente: Información del SIIF Nación (MinHacienda)

**Ejemplo**:
```
Vigencia 2025:
  Programación: Publicada enero 2025 (sin cambios durante el año)
  Seguimiento:
    - Corte 31 marzo 2025: Publicado ~30 abril 2025
    - Corte 30 junio 2025: Publicado ~31 julio 2025
    - Corte 30 septiembre 2025: Publicado ~31 octubre 2025
    - Corte 31 diciembre 2025: Publicado ~31 enero 2026
```

---

**Datos históricos**:

**Permanencia**: Los datos de vigencias anteriores permanecen disponibles y **no se modifican** (datos consolidados y cerrados).

**Ejemplo**: La información de SGP 2020 consultada en 2026 es la misma que en 2021 (cierre definitivo).

---

**Notificaciones de actualización**:

**Actualmente**: SICODIS no envía notificaciones automáticas de actualización.

**Recomendación para usuarios frecuentes**:
- Revisar mensualmente (primera quincena) para SGP y SGR
- Revisar trimestralmente para PGN Seguimiento
- Seguir redes sociales o página web del DNP para anuncios oficiales

---

**Consulta de última actualización**:

**En la interfaz**:
- Algunos módulos muestran fecha de última actualización en el footer
- Revisar la fecha más reciente en las tablas de datos mensuales

**Documentación**: Cada módulo puede especificar la periodicidad de actualización en su sección de ayuda.

---

## Soporte Técnico

### P30: ¿Qué hacer si encuentro inconsistencias en los datos?

**Respuesta completa en**: [06-02. Soporte y Contacto](./06-02-soporte-contacto.md) - Sección "Reporte de Inconsistencias"

**Resumen**:
1. Verificar filtros aplicados (vigencia, entidad territorial)
2. Comparar con fuentes oficiales (Documentos DNP, resoluciones)
3. Revisar si es un error de interpretación
4. Reportar al correo: **sicodis@dnp.gov.co**
5. Incluir: Módulo, filtros, captura de pantalla, descripción de la inconsistencia

---

### P31: ¿Hay documentación técnica y normativa disponible?

**Respuesta**:

Sí, SICODIS y el DNP ofrecen documentación técnica, metodológica y normativa relacionada con SGP, SGR y PGN.

**Documentación en SICODIS**:

**Módulos de documentos**:
- **SGP Documentos Anexos** (`/sgp-documentos-anexos`): Resoluciones de distribución, documentos oficiales SGP
  - [Ver documentación](../03-sgp/03-02-sgp-documentos-anexos.md)
- **Sección "Documentos Financiamiento Territorial"** (si disponible en el sitio)

**Documentación externa (DNP)**:

**Sitio web DNP**:
- URL: https://www.dnp.gov.co
- Sección: "Financiamiento Territorial" o "Transferencias"

**Tipos de documentos disponibles**:

**SGP**:
- Resoluciones de distribución anual
- Metodologías de cálculo
- Ley 715 de 2001 y modificaciones
- Actos Legislativos 01/2001, 04/2007, 05/2019
- Decretos reglamentarios

**SGR**:
- Acto Legislativo 05 de 2011
- Ley 1530 de 2012
- Decreto Ley 1949 de 2023
- Resoluciones de distribución bienal
- Plan de Recursos (documento técnico)
- Metodologías de distribución

**PGN**:
- Regionalización anual del PGN
- Metodología de regionalización
- Documentos técnicos por sector

**Documentación de usuario**:
- **Manual de Usuario de SICODIS**: Este documento y otros en `/docs/manual-de-usuario/`
- Preguntas frecuentes (FAQ)
- Glosario de términos: [06-01. Glosario de Términos](./06-01-glosario-terminos.md)

**Normativa general**:
- Constitución Política de Colombia (artículos relevantes)
- Leyes, decretos y resoluciones específicas
- Sentencias de la Corte Constitucional

**Acceso**:
- Documentos públicos descargables en PDF
- Algunos disponibles directamente en SICODIS
- Otros en la página web institucional del DNP

**Contacto para documentación**:
- **Email**: sicodis@dnp.gov.co
- Solicitar documentos específicos si no están disponibles públicamente

---

## Ver También

### Documentación Relacionada
- [01. Introducción General](../01-introduccion.md)
- [02. Navegación General](../02-navegacion-general.md)
- [03-00. Introducción al SGP](../03-sgp/03-00-sgp-introduccion.md)
- [04-00. Introducción al SGR](../04-sgr/04-00-sgr-introduccion.md)
- [05-00. Introducción al PGN](../05-pgn/05-00-pgn-introduccion.md)
- [06-01. Glosario de Términos](./06-01-glosario-terminos.md)
- [06-02. Soporte y Contacto](./06-02-soporte-contacto.md)

### Recursos Técnicos
- **Componente**: `src/app/components/faq/`
- **Interfaz FAQ**: `FaqSection`, `FaqItem`

### Contacto
Para preguntas no cubiertas en este documento:
- **Email**: sicodis@dnp.gov.co
- **Teléfono**: +57 601 381 50 00
- **PQRSD**: Formulario en línea en página DNP

---

*Última actualización: 2026-04-09*
*Para reportar errores o sugerencias sobre este documento, contacte a sicodis@dnp.gov.co*
