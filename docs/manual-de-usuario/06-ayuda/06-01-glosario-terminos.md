# 6.1. Glosario de Términos

## Información del Documento
- **Módulo**: Glosario de Términos
- **Última actualización**: Ver [CHANGELOG.md](../CHANGELOG.md)
- **Versión**: 1.0.0

## Tabla de Contenidos
- [Propósito](#propósito)
- [Términos A-C](#términos-a-c)
- [Términos D-I](#términos-d-i)
- [Términos L-O](#términos-l-o)
- [Términos P-R](#términos-p-r)
- [Términos S-Z](#términos-s-z)
- [Ver También](#ver-también)

---

## Propósito

Este glosario proporciona definiciones claras y contextualizadas de los términos técnicos utilizados en SICODIS, el Sistema General de Participaciones (SGP), el Sistema General de Regalías (SGR) y el Presupuesto General de la Nación (PGN).

Los términos están ordenados alfabéticamente y cada entrada incluye:
- Definición clara
- Contexto de uso en SICODIS
- Normativa aplicable (cuando corresponda)
- Módulos relacionados
- Referencias cruzadas a términos relacionados

---

## Términos A-C

### Aforado / No Aforado

**Definición**: El término "aforado" se refiere a lo que ha sido proyectado, estimado o presupuestado oficialmente. En el contexto del SGR, distingue entre recursos proyectados y recursos adicionales.

**Recaudo Aforado**: Monto proyectado de regalías en el Plan Bienal de Caja (PBC), incluido en la apropiación presupuestal del bienio.

**Recaudo No Aforado**: Recursos de regalías que superan la apropiación presupuestal corriente del bienio, generalmente por mayor producción de recursos naturales o precios internacionales superiores a los proyectados.

**Contexto en SICODIS**: Los módulos SGR comparan el presupuesto aforado con el recaudo real, mostrando si hay recaudo no aforado (excedente).

**Normativa**: Decreto Ley 1949 de 2023

**Módulos relacionados**:
- [04-03. SGR Presupuesto y Recaudo](../04-sgr/04-03-sgr-presupuesto-recaudo.md)
- [04-06. SGR Plan Bienal de Caja](../04-sgr/04-06-sgr-plan-bienal-caja.md)

**Ver también**: [Plan Bienal de Caja](#plan-bienal-de-caja-pbc), [Recaudo](#recaudo)

---

### ANH - Agencia Nacional de Hidrocarburos

**Definición**: Entidad adscrita al Ministerio de Minas y Energía, responsable de la administración integral de las reservas de hidrocarburos de la Nación.

**Funciones en el SGR**:
- Certificar producción de petróleo y gas natural
- Distribuir Asignaciones Directas de hidrocarburos (AD 20% y AD 5%)
- Calcular regalías por explotación de hidrocarburos

**Contexto en SICODIS**: Los datos de Asignaciones Directas de hidrocarburos provienen de la certificación de la ANH.

**Normativa**: Decreto 1760 de 2003, Decreto Ley 1949 de 2023

**Ver también**: [ANM](#anm---agencia-nacional-de-minería), [Asignaciones Directas](#asignaciones-directas-ad)

---

### ANM - Agencia Nacional de Minería

**Definición**: Entidad adscrita al Ministerio de Minas y Energía, encargada de administrar los recursos minerales del Estado.

**Funciones en el SGR**:
- Certificar producción minera (carbón, oro, níquel, etc.)
- Distribuir Asignaciones Directas de minería (AD 20% y AD 5%)
- Calcular regalías por explotación de minerales

**Contexto en SICODIS**: Los datos de Asignaciones Directas de minería se basan en certificaciones de la ANM.

**Normativa**: Decreto 4134 de 2011, Decreto Ley 1949 de 2023

**Ver también**: [ANH](#anh---agencia-nacional-de-hidrocarburos), [Asignaciones Directas](#asignaciones-directas-ad)

---

### Apropiación

**Definición**: Autorización máxima de gasto incluida en el presupuesto para una vigencia fiscal específica. Representa el cupo presupuestal asignado a una entidad o programa.

**En el SGR**: Monto incluido en la Ley Bienal de Presupuesto del SGR por asignación y beneficiario.

**En el PGN**: Monto asignado en la Ley Anual de Presupuesto a cada entidad y proyecto.

**Flujo presupuestal**:
```
Apropiación → Compromiso → Obligación → Pago
```

**Contexto en SICODIS**: Los módulos muestran las apropiaciones presupuestales iniciales y su ejecución.

**Normativa**: Estatuto Orgánico de Presupuesto (Decreto 111 de 1996)

**Ver también**: [Compromiso](#compromiso), [Obligación](#obligación), [Pago](#pago)

---

### Asignaciones Directas (AD)

**Definición**: Recursos del SGR asignados directamente a las entidades territoriales productoras de recursos naturales no renovables, reconociendo su condición de territorios donde se explotan estos recursos.

**Composición**:

**AD 20%**: Primera asignación directa
- Departamentos productores
- Municipios productores
- Municipios portuarios (transporte de RNNR)
- Distribución proporcional a la producción certificada

**AD 5%**: Asignación directa adicional
- Solo para municipios productores
- Complementa la AD 20%
- Calculada sobre ingresos corrientes del SGR

**Total Asignaciones Directas**: 25% del total del SGR

**Entidades distribuidoras**:
- **ANH**: AD de hidrocarburos (petróleo, gas)
- **ANM**: AD de minería (carbón, oro, níquel, otros)

**Contexto en SICODIS**: Módulo específico para consultar recaudo de AD por entidad productora.

**Normativa**: Acto Legislativo 05 de 2011, Decreto Ley 1949 de 2023

**Módulos relacionados**:
- [04-02. SGR Recaudo Directas](../04-sgr/04-02-sgr-recaudo-directas.md)

**Ver también**: [RNNR](#rnnr---recursos-naturales-no-renovables), [Recaudo No Aforado](#aforado--no-aforado)

---

### BPIN - Banco de Programas y Proyectos de Inversión

**Definición**: Sistema de información del DNP que registra, consolida y provee información sobre los programas y proyectos de inversión pública viables, susceptibles de ser financiados con recursos del Presupuesto General de la Nación.

**Código BPIN**: Identificador único de cada proyecto
```
Formato: AAAA9999999999
  AAAA = Año de registro
  9999999999 = Número consecutivo

Ejemplo: 2024000100123
```

**Funciones**:
- Registro y formulación de proyectos (Metodología General Ajustada - MGA)
- Viabilización técnica y financiera
- Seguimiento a la ejecución
- Evaluación de impacto

**Contexto en SICODIS**: Los módulos PGN identifican proyectos por su código BPIN, permitiendo trazabilidad.

**Plataforma**: https://bpin.dnp.gov.co

**Módulos relacionados**:
- [05-01. PGN Regionalización Programación](../05-pgn/05-01-pgn-regionalizacion-programacion.md)
- [05-02. PGN Regionalización Seguimiento](../05-pgn/05-02-pgn-regionalizacion-seguimiento.md)

**Ver también**: [PGN](#pgn---presupuesto-general-de-la-nación), [Regionalización](#regionalización-del-pgn)

---

### Certificación

**Definición**: En el contexto de transferencias territoriales, es la condición que habilita a una entidad territorial para administrar directamente recursos de un sector específico (educación o salud).

**Certificación en Educación**:

**Requisito**: Municipios con más de 100,000 habitantes (censo DANE) y que cumplan condiciones técnicas, administrativas y financieras.

**Responsabilidades certificados**:
- Administración de nómina docente
- Gestión de planta de personal
- Inversión en calidad educativa

**Municipios NO certificados**: Reciben educación del departamento (SGP Educación del municipio = $0 en SICODIS).

**Certificación en Salud**:

**Departamentos**: Automáticamente certificados

**Municipios**: Requieren demostrar capacidad técnica, administrativa y financiera

**Responsabilidades**:
- Afiliación al régimen subsidiado
- Contratación de EPS
- Salud pública

**Contexto en SICODIS**: Si un municipio tiene asignación SGP Educación > $0, está certificado en educación.

**Normativa**: Ley 715 de 2001, Decretos reglamentarios del MEN y MinSalud

**Módulos relacionados**: [03-01. SGP Resumen](../03-sgp/03-01-sgp-resumen.md)

**Ver también**: [SGP](#sgp---sistema-general-de-participaciones)

---

### Compromiso

**Definición**: Segundo momento de la ejecución presupuestal. Es la afectación definitiva de la apropiación presupuestal mediante la celebración de un contrato, convenio o acto administrativo.

**Características**:
- Afecta la apropiación presupuestal (reduce disponibilidad)
- No genera salida efectiva de recursos aún
- Requiere certificado de disponibilidad presupuestal previo

**Ejemplo**:
```
Apropiación proyecto vial: $100,000 millones
  ↓
Firma contrato construcción: $80,000 millones (COMPROMISO)
  ↓
Disponibilidad restante: $20,000 millones
```

**Contexto en SICODIS**: Los módulos de seguimiento PGN muestran compromisos acumulados de proyectos.

**Flujo presupuestal**:
```
Apropiación → COMPROMISO → Obligación → Pago
```

**Normativa**: Estatuto Orgánico de Presupuesto (Decreto 111 de 1996)

**Módulos relacionados**:
- [05-02. PGN Regionalización Seguimiento](../05-pgn/05-02-pgn-regionalizacion-seguimiento.md)

**Ver también**: [Apropiación](#apropiación), [Obligación](#obligación), [Pago](#pago)

---

### CTI - Ciencia, Tecnología e Innovación

**Definición**: Asignación del SGR destinada a financiar proyectos de investigación científica, desarrollo tecnológico e innovación que contribuyan al desarrollo regional y nacional.

**Porcentaje**: 10% de los ingresos corrientes del SGR

**Beneficiarios**:
- Fondo de Ciencia, Tecnología e Innovación del SGR
- Universidades públicas (asignación directa)
- Entidades territoriales (proyectos CTI)

**Aprobación de proyectos**: OCAD CTI (Órgano Colegiado de Administración y Decisión de Ciencia, Tecnología e Innovación)

**Tipos de proyectos financiables**:
- Investigación básica y aplicada
- Desarrollo tecnológico
- Transferencia de tecnología
- Formación de capital humano en ciencia
- Infraestructura científica

**Contexto en SICODIS**: Se visualiza como una asignación específica del SGR en módulos de Plan de Recursos y Presupuesto.

**Normativa**: Acto Legislativo 05 de 2011, Ley 1530 de 2012, Decreto Ley 1949 de 2023

**Módulos relacionados**:
- [04-05. SGR Plan de Recursos](../04-sgr/04-05-sgr-plan-recursos.md)

**Ver también**: [OCAD](#ocad---órganos-colegiados-de-administración-y-decisión), [SGR](#sgr---sistema-general-de-regalías)

---

## Términos D-I

### DANE - Departamento Administrativo Nacional de Estadística

**Definición**: Entidad responsable de la planeación, levantamiento, procesamiento, análisis y difusión de las estadísticas oficiales de Colombia.

**Información certificada para SICODIS**:
- **Población**: Censos y proyecciones poblacionales
- **NBI (Necesidades Básicas Insatisfechas)**: Indicador de pobreza estructural
- **Desempleo**: Tasa de desocupación por territorio
- **Códigos DANE**: Identificación única de departamentos y municipios

**Códigos DANE**:
```
Departamento: 2 dígitos (05 = Antioquia, 11 = Bogotá)
Municipio: 5 dígitos (05001 = Medellín, 11001 = Bogotá)
```

**Uso en distribución SGR**: Las variables certificadas por DANE son criterios de distribución de Inversión Local y Regional.

**Contexto en SICODIS**: Los filtros de departamento y municipio utilizan códigos DANE.

**Ver también**: [NBI](#nbi---necesidades-básicas-insatisfechas), [Población](#población)

---

### Destinación Étnica

**Definición**: Recursos del SGR que las entidades territoriales productoras (con Asignaciones Directas) deben destinar específicamente a financiar proyectos de inversión con enfoque diferencial para grupos étnicos.

**Porcentaje del SGR**: 2,32% del total
- 1,0% Pueblos y Comunidades Indígenas
- 1,1% Comunidades Negras, Afrocolombianas, Raizales y Palenqueras (NARP)
- 0,22% Pueblo Rrom o Gitano

**Responsables**:
- **DNP**: Distribuye el 2,32% entre grupos étnicos y publica cálculo indicativo por territorio
- **Municipios y departamentos productores**: Realizan la destinación específica dentro de sus AD

**Condiciones**:
- Tener presupuesto de Asignaciones Directas
- Contar con población étnica acreditada por el Ministerio del Interior que resida en el territorio

**Inversión**: Proyectos con enfoque diferencial (educación propia, salud intercultural, infraestructura en territorios étnicos, etc.)

**Normativa**: Decreto Ley 1949 de 2023, sentencias de la Corte Constitucional

**Ver también**: [Asignaciones Directas](#asignaciones-directas-ad), [Grupos Étnicos](#grupos-étnicos)

---

### Doceava

**Definición**: Cada una de las doce partes iguales en que se divide el monto anual del Sistema General de Participaciones para su distribución mensual a las entidades territoriales.

**Cálculo**:
```
Doceava = Total Asignación Anual / 12
```

**Distribución por sector**:

**Educación**: 12 doceavas
- Distribuidas de enero a diciembre del año en curso
- Cada mes: 1/12 del total anual
- Objetivo: Garantizar pago mensual de nómina docente

**Salud, Agua, Propósito General**: 11 + 1 doceavas
- 11 doceavas del año en curso
- 1 doceava de diciembre del año anterior (girada en enero del año actual)
- Total: 12 pagos en el año

**Fechas de giro**: Generalmente primera quincena de cada mes

**Contexto en SICODIS**: El módulo SGP Detalle Presupuestal muestra el calendario de doceavas mensuales.

**Normativa**: Ley 715 de 2001, Decreto 1073 de 2015

**Módulos relacionados**:
- [03-03. SGP Detalle Presupuestal](../03-sgp/03-03-sgp-detalle-presupuestal.md)

**Ver también**: [SGP](#sgp---sistema-general-de-participaciones)

---

### FONPET - Fondo Nacional de Pensiones de las Entidades Territoriales

**Definición**: Fondo destinado a atender el pasivo pensional de las entidades territoriales, financiado con recursos del SGR.

**Objetivo**: Garantizar el pago de pensiones de jubilación de empleados de entidades territoriales, aliviando la carga fiscal local.

**Financiación**: Porcentaje del SGR destinado a ahorro pensional (variable según normativa vigente)

**Administración**: Cuenta especial administrada por el Ministerio de Hacienda

**Beneficiarios**: Entidades territoriales con pasivo pensional no cubierto

**Criterio de distribución**: Proporción del pasivo pensional certificado de cada entidad territorial

**Contexto en SICODIS**: Aparece como concepto en el desglose de Propósito General del SGP y como asignación del SGR.

**Normativa**: Ley 549 de 1999, Ley 1530 de 2012, Decreto Ley 1949 de 2023

**Ver también**: [SGR](#sgr---sistema-general-de-regalías), [SGP](#sgp---sistema-general-de-participaciones)

---

### Grupos Étnicos

**Definición**: Comunidades diferenciadas cultural, social e históricamente, reconocidas por la Constitución y la ley, con derechos especiales incluyendo asignación de recursos del SGR.

**Grupos reconocidos en el SGR**:

**Pueblos y Comunidades Indígenas**:
- Asignación: 1,0% del SGR
- Acreditación: Ministerio del Interior
- Autoridades: Cabildos, resguardos

**Comunidades Negras, Afrocolombianas, Raizales y Palenqueras (NARP)**:
- Asignación: 1,1% del SGR
- Acreditación: Ministerio del Interior
- Autoridades: Consejos comunitarios

**Pueblo Rrom o Gitano**:
- Asignación: 0,22% del SGR
- Acreditación: Ministerio del Interior

**Derechos especiales**:
- Consulta previa para proyectos que los afecten
- Destinación específica de recursos SGR
- Participación en priorización de proyectos
- Enfoque diferencial en inversión pública

**Marco normativo**: Constitución Política (artículos 7, 70, 329, 330), Convenio 169 OIT, Decreto Ley 1949 de 2023

**Ver también**: [Destinación Étnica](#destinación-étnica), [SGR](#sgr---sistema-general-de-regalías)

---

### IAC - Instrucción de Abono a Cuenta

**Definición**: Comunicación oficial que remite el DNP al Ministerio de Hacienda con los montos resultantes de la distribución de recursos del SGR, para ser registrados en las cuentas de cada beneficiario en el SPGR.

**Propósito**:
- Comunicar oficialmente la distribución de regalías
- Habilitar recursos para que beneficiarios puedan pagar obligaciones
- Garantizar trazabilidad en la distribución

**Tipos de IAC**:

**IAC Mensuales (Ingresos Corrientes)**:
- Periodicidad: Cada mes
- Contenido: Distribución del recaudo corriente mensual
- Base: Plan Bienal de Caja (PBC)

**IAC de Ingresos No Corrientes**:
- Periodicidad: Puntual (cuando se apropian recursos)
- Contenido: Rendimientos financieros, desahorro, mayor recaudo

**Contenido de una IAC**:
- Número de IAC (consecutivo)
- Fecha de emisión
- Bienio
- Tipo de ingreso
- Asignación
- Beneficiario
- Monto a abonar

**Importante**: Las IAC NO transfieren recursos a cuentas de entidades territoriales. Los recursos permanecen en la Cuenta Única del SGR y se pagan directamente a destinatarios finales vía SPGR.

**Contexto en SICODIS**: Los módulos SGR muestran las IAC emitidas mensualmente por el DNP.

**Normativa**: Decreto Ley 1949 de 2023

**Módulos relacionados**:
- [04-01. SGR Recaudo Mensual](../04-sgr/04-01-sgr-recaudo-mensual.md)
- [04-03. SGR Presupuesto y Recaudo](../04-sgr/04-03-sgr-presupuesto-recaudo.md)

**Ver también**: [SPGR](#spgr---sistema-de-presupuesto-y-giro-de-regalías), [Plan Bienal de Caja](#plan-bienal-de-caja-pbc)

---

### ICLD - Ingresos Corrientes de Libre Destinación

**Definición**: Ingresos de las entidades territoriales que NO tienen destinación específica por ley, es decir, pueden ser utilizados libremente por la entidad territorial según sus prioridades.

**Componentes típicos**:
- Impuesto predial
- Impuesto de industria y comercio
- Sobretasa a la gasolina (porción de libre destinación)
- Otros ingresos tributarios locales
- Recursos de libre inversión del SGP

**Importancia**:
- Indicador de autonomía fiscal territorial
- Base para calcular límites de gasto (Ley 617 de 2000)
- Criterio para acceso a crédito

**Contexto en SICODIS**: Algunos recursos del SGP (Propósito General - Libre Inversión) se consideran ICLD una vez transferidos a la entidad territorial.

**Normativa**: Ley 617 de 2000, Ley 715 de 2001

**Ver también**: [Ley 617](#ley-617), [Propósito General](#propósito-general)

---

### Ingresos Corrientes del SGR

**Definición**: Recursos proyectados que se esperan recaudar durante el bienio por la explotación de los recursos naturales no renovables (RNNR).

**Características**:
- Proyecciones basadas en estimación de producción y precios
- Incluidos en el Plan de Recursos y presupuesto bienal
- Base del Plan Bienal de Caja (PBC)
- Generan IAC mensuales

**Fuentes**:
- Regalías de hidrocarburos (petróleo, gas)
- Regalías de minería (carbón, oro, níquel, otros)

**Uso del término "corriente"**: Se refiere a flujos regulares y permanentes de recaudo, NO al año en curso.

**Importancia**: Base para calcular el 10% de CTI (Ciencia, Tecnología e Innovación)

**Contexto en SICODIS**: Diferenciados de ingresos no corrientes en módulos SGR.

**Módulos relacionados**:
- [04-05. SGR Plan de Recursos](../04-sgr/04-05-sgr-plan-recursos.md)
- [04-06. SGR Plan Bienal de Caja](../04-sgr/04-06-sgr-plan-bienal-caja.md)

**Ver también**: [Ingresos No Corrientes](#ingresos-no-corrientes-del-sgr), [RNNR](#rnnr---recursos-naturales-no-renovables)

---

### Ingresos No Corrientes del SGR

**Definición**: Recursos apropiados en la ley bienal de presupuesto o mediante decreto, que NO dependen del recaudo por explotación directa de RNNR durante el bienio.

**Tipos**:
- Rendimientos financieros (intereses de recursos del SGR)
- Desahorro (liberación de recursos de FONPET)
- Mayor recaudo de bienios anteriores
- Recuperación de cartera
- Multas y sanciones
- Excedentes financieros

**Características**:
- NO proyectables con precisión
- NO incluidos en PBC inicial
- Se adicionan mediante decretos durante el bienio
- NO son base para calcular CTI (10%)

**Distribución**: Puede tener reglas especiales según normativa

**Contexto en SICODIS**: Los informes SGR diferencian claramente entre corrientes y no corrientes.

**Normativa**: Decreto Ley 1949 de 2023

**Ver también**: [Ingresos Corrientes](#ingresos-corrientes-del-sgr), [IAC](#iac---instrucción-de-abono-a-cuenta)

---

## Términos L-O

### Ley 617

**Definición**: Ley de racionalización del gasto público de las entidades territoriales, que establece límites de gasto de funcionamiento según categoría de la entidad y sus ingresos corrientes de libre destinación (ICLD).

**Año**: 2000

**Objetivo**: Garantizar sostenibilidad fiscal de departamentos y municipios

**Límites de gasto de funcionamiento**:

**Municipios** (según categoría):
- Categoría Especial: Máximo 50% de ICLD
- Categoría 1: Máximo 65% de ICLD
- Categoría 2 y 3: Máximo 70% de ICLD
- Categoría 4, 5 y 6: Máximo 80% de ICLD

**Departamentos**:
- Categoría Especial: Máximo 50% de ICLD
- Categoría 1, 2 y 3: Máximo 55% de ICLD
- Categoría 4: Máximo 70% de ICLD

**Sanciones por incumplimiento**:
- Reducción de transferencias SGP
- Inhabilidad para acceder a crédito
- Medidas fiscales especiales

**Contexto en SICODIS**: Afecta cómo las entidades pueden usar recursos de libre inversión del SGP.

**Normativa completa**: Ley 617 de 2000

**Ver también**: [ICLD](#icld---ingresos-corrientes-de-libre-destinación), [SGP](#sgp---sistema-general-de-participaciones)

---

### Ley 715

**Definición**: Ley que establece las normas orgánicas en materia de recursos y competencias para organizar la prestación de los servicios de educación y salud, y distribuir el Sistema General de Participaciones.

**Año**: 2001

**Contenido principal**:
- Distribución de competencias entre Nación y entidades territoriales
- Estructura del SGP (Educación, Salud, Agua, Propósito General)
- Criterios de distribución de recursos
- Certificación de municipios en educación y salud
- Sistemas de información y seguimiento

**Reformas**:
- Acto Legislativo 01 de 2001
- Acto Legislativo 04 de 2007
- Acto Legislativo 05 de 2019
- Múltiples decretos reglamentarios

**Contexto en SICODIS**: Base legal del SGP, determina toda la distribución de participaciones visualizada en SICODIS.

**Normativa**: Ley 715 de 2001 y modificaciones

**Módulos relacionados**: Todos los módulos SGP

**Ver también**: [SGP](#sgp---sistema-general-de-participaciones), [Certificación](#certificación)

---

### NBI - Necesidades Básicas Insatisfechas

**Definición**: Indicador de pobreza estructural que identifica hogares con carencias críticas en vivienda, servicios públicos, educación y capacidad económica.

**Componentes**:
- Viviendas inadecuadas
- Hacinamiento crítico
- Viviendas con servicios inadecuados (agua, saneamiento)
- Hogares con alta dependencia económica
- Hogares con niños en edad escolar que no asisten a la escuela

**Cálculo**: Porcentaje de hogares con al menos una NBI

**Ejemplo**:
```
Municipio con NBI del 35%:
  → 35% de hogares tienen al menos una necesidad básica insatisfecha
  → Indicador de alta pobreza estructural
```

**Uso en distribución SGR**:
- Criterio para distribuir Inversión Local y Regional
- Ponderación: 40% en la fórmula de distribución
- A mayor NBI, mayor asignación de recursos

**Certificación**: DANE (Departamento Administrativo Nacional de Estadística)

**Contexto en SICODIS**: Variable utilizada para calcular asignaciones del SGR por municipio/departamento.

**Ver también**: [DANE](#dane---departamento-administrativo-nacional-de-estadística), [SGR](#sgr---sistema-general-de-regalías)

---

### Obligación

**Definición**: Tercer momento de la ejecución presupuestal. Es la adquisición de un compromiso de pago derivado del cumplimiento de requisitos contractuales o legales.

**Características**:
- Surge cuando el contratista cumple su obligación (entrega bien, presta servicio)
- Se reconoce formalmente la deuda
- Genera derecho de pago al acreedor
- Paso previo al pago efectivo

**Ejemplo**:
```
Compromiso: Contrato por $80,000 millones
  ↓
Contratista ejecuta obra: Avance del 50%
  ↓
OBLIGACIÓN reconocida: $40,000 millones
  ↓
Pendiente de pago: $40,000 millones
```

**Flujo presupuestal**:
```
Apropiación → Compromiso → OBLIGACIÓN → Pago
```

**Contexto en SICODIS**: Los módulos de seguimiento PGN muestran obligaciones acumuladas de proyectos.

**Normativa**: Estatuto Orgánico de Presupuesto (Decreto 111 de 1996)

**Módulos relacionados**:
- [05-02. PGN Regionalización Seguimiento](../05-pgn/05-02-pgn-regionalizacion-seguimiento.md)

**Ver también**: [Apropiación](#apropiación), [Compromiso](#compromiso), [Pago](#pago)

---

### OCAD - Órganos Colegiados de Administración y Decisión

**Definición**: Instancias colegiadas del SGR responsables de definir los proyectos de inversión que se financiarán con recursos de regalías, garantizando participación regional.

**Tipos de OCAD**:

**OCAD Paz**: Asignación para la Paz y el Medio Ambiente (3%)

**OCAD CTI**: Ciencia, Tecnología e Innovación (10% de corrientes)

**OCAD Regionales**: Desarrollo Regional (17%)
- Por regiones del país
- Proyectos de impacto regional

**OCAD Departamentales**: Inversión Departamental (10%)
- Por cada departamento
- Proyectos de impacto departamental

**OCAD Municipales**: Inversión Municipal (45%)
- Por grupos de municipios
- Proyectos de impacto local

**Funciones**:
- Priorizar proyectos de inversión
- Aprobar proyectos técnica y financieramente viables
- Realizar seguimiento a la ejecución
- Garantizar participación ciudadana

**Composición típica**:
- Gobernadores y/o alcaldes
- Delegados del gobierno nacional
- Representantes de comunidades (según asignación)

**Contexto en SICODIS**: SICODIS muestra la distribución presupuestal; los proyectos aprobados se consultan en SUIFP-SGR.

**Normativa**: Ley 1530 de 2012, Decreto Ley 1949 de 2023

**Ver también**: [SGR](#sgr---sistema-general-de-regalías), [CTI](#cti---ciencia-tecnología-e-innovación)

---

## Términos P-R

### Pago

**Definición**: Cuarto y último momento de la ejecución presupuestal. Es la extinción de la obligación mediante la salida efectiva de recursos de la entidad a favor del acreedor.

**Características**:
- Transferencia efectiva de dinero
- Extingue la obligación
- Se registra contablemente la erogación
- Momento final del ciclo presupuestal

**Flujo presupuestal completo**:
```
Apropiación → Compromiso → Obligación → PAGO
```

**En el SGR**: Los pagos se realizan directamente desde la Cuenta Única del SGR a través del SPGR (no se transfiere a entidades territoriales).

**Ejemplo**:
```
Obligación reconocida: $40,000 millones
  ↓
Radicación de cuenta de cobro
  ↓
Verificación de requisitos
  ↓
PAGO efectivo: $40,000 millones a cuenta del contratista
```

**Contexto en SICODIS**: Los módulos de seguimiento PGN muestran pagos acumulados de proyectos.

**Normativa**: Estatuto Orgánico de Presupuesto (Decreto 111 de 1996)

**Módulos relacionados**:
- [05-02. PGN Regionalización Seguimiento](../05-pgn/05-02-pgn-regionalizacion-seguimiento.md)

**Ver también**: [Apropiación](#apropiación), [Compromiso](#compromiso), [Obligación](#obligación), [SPGR](#spgr---sistema-de-presupuesto-y-giro-de-regalías)

---

### PBC - Plan Bienal de Caja

**Definición**: Herramienta de programación financiera del SGR que determina los flujos estimados de ingresos mensuales del presupuesto corriente bienal durante los 24 meses de ejecución.

**Horizonte**: 24 meses (2 años del bienio)

**Contenido**:
- Proyección mensual de recaudo de regalías
- Distribución por fuente (hidrocarburos, minería)
- Desagregación por asignación
- Distribución por beneficiario (departamento, municipio)

**Funciones**:
- Base para IAC mensuales
- Planeación de proyectos por entidades territoriales
- Control presupuestal (comparación PBC vs recaudo real)

**Elaboración**: DNP en coordinación con MinHacienda

**Actualización**: Puede ajustarse durante el bienio si hay variaciones significativas

**Ejemplo**:
```
Bienio 2025-2026
Municipio: Barrancabermeja (Santander)
Asignación: Inversión Municipal

Mes       | Hidrocarburos | Minería   | Total Mes
----------|---------------|-----------|-------------
Ene 2025  | $500 mill     | $50 mill  | $550 mill
Feb 2025  | $520 mill     | $52 mill  | $572 mill
...
Dic 2026  | $680 mill     | $68 mill  | $748 mill

Total bienio: $15,000 millones
```

**Contexto en SICODIS**: Módulo específico para consultar PBC mensual.

**Normativa**: Decreto Ley 1949 de 2023

**Módulos relacionados**:
- [04-06. SGR Plan Bienal de Caja](../04-sgr/04-06-sgr-plan-bienal-caja.md)

**Ver también**: [Plan de Recursos](#plan-de-recursos-pr), [IAC](#iac---instrucción-de-abono-a-cuenta)

---

### PGN - Presupuesto General de la Nación

**Definición**: Cálculo anticipado de los ingresos y gastos del Estado colombiano durante una vigencia fiscal (año), aprobado mediante ley por el Congreso de la República.

**Componentes**:
- **Funcionamiento**: Gastos de operación del Estado
- **Inversión**: Proyectos de desarrollo económico y social
- **Servicio de la deuda**: Pago de obligaciones financieras

**En SICODIS**: Solo se visualiza la **inversión regionalizada** del PGN
- Presupuesto de inversión con ubicación geográfica
- Ejecutado por entidades del nivel nacional en los territorios
- NO incluye transferencias (SGP) ni regalías (SGR)

**Aprobación**: Ley Anual de Presupuesto del Congreso

**Ejecución**: Entidades del gobierno nacional (ministerios, agencias, institutos)

**Módulos en SICODIS**:
- Regionalización Programación (presupuesto inicial)
- Regionalización Seguimiento (ejecución)
- Inversión por Sector

**Normativa**: Constitución Política (artículos 345-355), Estatuto Orgánico de Presupuesto (Decreto 111 de 1996)

**Módulos relacionados**:
- [05-00. Introducción al PGN](../05-pgn/05-00-pgn-introduccion.md)
- [05-01. PGN Regionalización Programación](../05-pgn/05-01-pgn-regionalizacion-programacion.md)
- [05-02. PGN Regionalización Seguimiento](../05-pgn/05-02-pgn-regionalizacion-seguimiento.md)

**Ver también**: [BPIN](#bpin---banco-de-programas-y-proyectos-de-inversión), [Regionalización](#regionalización-del-pgn)

---

### Plan de Recursos (PR)

**Definición**: Proyección de las fuentes de financiamiento a 10 años del Sistema General de Regalías, diferenciando entre minería e hidrocarburos.

**Horizonte temporal**: 10 años
- Proyecciones anuales de ingresos del SGR
- Los primeros 2 años: Base del presupuesto bienal
- Años 3-10: Planeación estratégica

**Responsabilidades**:
- **MHCP**: Elabora documento técnico con proyecciones de ingresos
- **DNP**: Distribuye recursos proyectados entre asignaciones y beneficiarios

**Componentes**:
- Proyección de producción de RNNR (barriles, toneladas)
- Proyección de precios internacionales
- Proyección de ingresos por regalías
- Distribución por asignaciones del SGR

**Relación con presupuesto bienal**:
Los años 1 y 2 del PR constituyen el proyecto de presupuesto bienal que se radica en el Congreso para aprobación.

**Actualización**: Bianual (cada nuevo bienio)

**Contexto en SICODIS**: Módulo de Plan de Recursos muestra proyecciones de 10 años.

**Normativa**: Decreto Ley 1949 de 2023

**Módulos relacionados**:
- [04-05. SGR Plan de Recursos](../04-sgr/04-05-sgr-plan-recursos.md)

**Ver también**: [PBC](#pbc---plan-bienal-de-caja), [SGR](#sgr---sistema-general-de-regalías)

---

### Población

**Definición**: Número de habitantes de un territorio, utilizado como criterio de distribución de recursos en SGP y SGR.

**Fuente oficial**: DANE
- Censos poblacionales (cada 10 años)
- Proyecciones intercensales
- Actualizaciones anuales

**Uso en distribución de recursos**:

**SGP**:
- Criterio para distribución de Educación (según matrícula)
- Criterio para distribución de Salud (según población a afiliar)
- Criterio para distribución de Agua y Propósito General

**SGR (Inversión Local y Regional)**:
- Ponderación: 40% en la fórmula de distribución
- A mayor población, mayor asignación

**Tipos de población relevantes**:
- **Población total**: Habitantes totales
- **Población en edad escolar**: Niños y jóvenes 5-17 años (Educación)
- **Población SISBEN**: Población pobre a afiliar (Salud)
- **Población étnica**: Indígenas, NARP, Rrom (Destinación étnica)
- **Población víctima**: Registro Único de Víctimas (SGR)

**Contexto en SICODIS**: Variable subyacente en cálculos de asignación (no siempre visible, pero determina distribución).

**Ver también**: [DANE](#dane---departamento-administrativo-nacional-de-estadística), [NBI](#nbi---necesidades-básicas-insatisfechas)

---

### Propósito General

**Definición**: Uno de los cuatro componentes del Sistema General de Participaciones (SGP), destinado a financiar diversos sectores y usos según las necesidades de las entidades territoriales.

**Porcentaje del SGP**: Aproximadamente 11-17% (varía según normativa vigente)

**Componentes**:

**Libre Inversión**:
- Uso discrecional de la entidad territorial
- Puede destinarse a cualquier sector de inversión
- Se convierte en ICLD una vez transferido

**Forzosa Inversión** (destinos específicos):
- **Deporte**: 5% mínimo para recreación y deporte
- **Cultura**: 3% mínimo para cultura
- **Alimentación Escolar**: Municipios certificados en educación
- **Ribereños del Río Magdalena**: Municipios ribereños específicos
- **Resguardos Indígenas**: Municipios con resguardos indígenas
- **FONPET**: Ahorro para pasivo pensional (si aplica)

**Distribución**:
- Criterios: Población, NBI, otros indicadores
- Diferenciación entre departamentos y municipios

**Contexto en SICODIS**: Aparece como nodo en la tabla jerárquica del SGP con sus subconceptos.

**Normativa**: Ley 715 de 2001, Actos Legislativos modificatorios

**Módulos relacionados**:
- [03-01. SGP Resumen](../03-sgp/03-01-sgp-resumen.md)

**Ver también**: [SGP](#sgp---sistema-general-de-participaciones), [ICLD](#icld---ingresos-corrientes-de-libre-destinación), [FONPET](#fonpet---fondo-nacional-de-pensiones-de-las-entidades-territoriales)

---

### Recaudo

**Definición**: En el contexto del SGR, es el ingreso efectivo de recursos por concepto de regalías provenientes de la explotación de recursos naturales no renovables.

**Proceso de recaudo**:
```
1. Explotación de RNNR (petróleo, carbón, oro, etc.)
  ↓
2. Certificación de producción (ANH, ANM)
  ↓
3. Liquidación de regalías (tarifas aplicadas)
  ↓
4. RECAUDO efectivo a Cuenta Única del SGR
  ↓
5. Distribución por DNP (IAC)
```

**Tipos**:

**Recaudo Corriente**: Por explotación actual de RNNR durante el bienio

**Recaudo No Corriente**: Ingresos extraordinarios (rendimientos, desahorro)

**Recaudo Aforado**: Monto proyectado en el PBC

**Recaudo No Aforado**: Exceso sobre lo proyectado

**Periodicidad**: Continuo durante el bienio, distribuido mensualmente vía IAC

**Contexto en SICODIS**: Los módulos SGR muestran recaudo mensual y acumulado del bienio.

**Módulos relacionados**:
- [04-01. SGR Recaudo Mensual](../04-sgr/04-01-sgr-recaudo-mensual.md)
- [04-02. SGR Recaudo Directas](../04-sgr/04-02-sgr-recaudo-directas.md)

**Ver también**: [IAC](#iac---instrucción-de-abono-a-cuenta), [Aforado](#aforado--no-aforado), [RNNR](#rnnr---recursos-naturales-no-renovables)

---

### Regionalización del PGN

**Definición**: Proceso de identificación y asignación geográfica del presupuesto de inversión del gobierno nacional a departamentos y municipios.

**Alcance**:
- Solo presupuesto de **inversión** (no funcionamiento ni deuda)
- Recursos ejecutados por el **nivel nacional** en los territorios
- Proyectos con **ubicación geográfica** específica

**Tipos en SICODIS**:

**Regionalización Programación**:
- Presupuesto inicial asignado por territorio
- Proyectos priorizados al inicio de la vigencia
- Distribución por sector de inversión

**Regionalización Seguimiento**:
- Ejecución presupuestal acumulada
- Compromisos, obligaciones y pagos
- Avance físico y financiero de proyectos

**Sectores incluidos**:
- Transporte e infraestructura
- Agricultura y desarrollo rural
- Educación
- Salud
- Vivienda y agua potable
- Ciencia y tecnología
- Otros

**Diferencia con SGP y SGR**:
- **SGP/SGR**: Transferencias a entidades territoriales (recursos que administran localmente)
- **PGN regionalizado**: Inversión ejecutada por el nivel nacional en los territorios (NO se transfiere)

**Contexto en SICODIS**: Módulos PGN muestran cuánto invierte el gobierno nacional en cada departamento/municipio.

**Módulos relacionados**:
- [05-01. PGN Regionalización Programación](../05-pgn/05-01-pgn-regionalizacion-programacion.md)
- [05-02. PGN Regionalización Seguimiento](../05-pgn/05-02-pgn-regionalizacion-seguimiento.md)

**Ver también**: [PGN](#pgn---presupuesto-general-de-la-nación), [BPIN](#bpin---banco-de-programas-y-proyectos-de-inversión)

---

### RNNR - Recursos Naturales No Renovables

**Definición**: Recursos que existen en cantidad limitada, formados durante miles o millones de años, que se agotan con su extracción y no se regeneran a escala humana de tiempo.

**Tipos en Colombia**:

**Hidrocarburos**:
- Petróleo crudo
- Gas natural
- Medición: Barriles/día, pies cúbicos
- Principales regiones: Llanos Orientales, Valle del Magdalena, Caribe

**Minería**:
- Carbón (térmico y metalúrgico)
- Oro
- Níquel
- Esmeraldas
- Materiales de construcción
- Otros minerales

**Regalías generadas**:
- Contraprestación económica que recibe el Estado por la explotación
- Tarifas según tipo de recurso y volumen de producción
- Distribuidas a través del SGR

**Fundamento constitucional**:
- Artículo 332: Los RNNR son patrimonio de la Nación
- Artículo 360-361: Regalías por explotación

**Entidades certificadoras**:
- **ANH**: Producción de hidrocarburos
- **ANM**: Producción minera

**Contexto en SICODIS**: Los módulos SGR diferencian recaudo por tipo de RNNR (hidrocarburos vs minería).

**Ver también**: [SGR](#sgr---sistema-general-de-regalías), [Asignaciones Directas](#asignaciones-directas-ad), [Recaudo](#recaudo)

---

## Términos S-Z

### SGP - Sistema General de Participaciones

**Definición**: Mecanismo establecido por la Constitución y la ley para distribuir recursos del presupuesto nacional hacia las entidades territoriales para financiar servicios a su cargo (educación, salud, agua potable, propósito general).

**Marco normativo**:
- Constitución Política (artículo 357)
- Ley 715 de 2001 y modificaciones
- Actos Legislativos 01/2001, 04/2007, 05/2019

**Componentes**:
- **Educación** (~58% del SGP): Nómina docente, calidad educativa
- **Salud** (~25% del SGP): Régimen subsidiado, salud pública
- **Agua Potable** (~5% del SGP): Infraestructura de acueductos y alcantarillado
- **Propósito General** (~11-17% del SGP): Inversión libre y forzosa

**Base de cálculo**:
Ingresos Corrientes de la Nación (ICN) certificados por CONFIS, con crecimiento según inflación más incremento real.

**Distribución**:
- Mensual (doceavas)
- Transferencia a cuentas maestras de entidades territoriales
- Criterios: Población, matrícula, población a afiliar, NBI, otros

**Contexto en SICODIS**: Sistema con mayor cantidad de módulos (Resumen, Detalle Presupuestal, Comparativo, Histórico, Eficiencias, Documentos).

**Módulos relacionados**:
- [03-00. Introducción al SGP](../03-sgp/03-00-sgp-introduccion.md)
- Todos los módulos del capítulo 3

**Ver también**: [Doceava](#doceava), [Certificación](#certificación), [Propósito General](#propósito-general)

---

### SGR - Sistema General de Regalías

**Definición**: Conjunto de ingresos, asignaciones, órganos, procedimientos y regulaciones para la distribución y uso eficiente de recursos provenientes de la explotación de recursos naturales no renovables.

**Marco normativo**:
- Constitución Política (artículos 360-361)
- Acto Legislativo 05 de 2011
- Ley 1530 de 2012
- Decreto Ley 1949 de 2023

**Asignaciones** (distribución):
- Asignaciones Directas (25%): Productores
- Inversión Local y Regional (55%)
- Desarrollo Regional (17%)
- CTI (10% de corrientes)
- Paz y Ambiente (3%)
- Asignaciones especiales (FONPET, SSEC, Fiscalización)

**Ciclo presupuestal**: Bienal (2 años)

**Instrumentos de planeación**:
- Plan de Recursos (10 años)
- Plan Bienal de Caja (24 meses)

**Órganos**:
- OCAD (aprueban proyectos)
- Comisión Rectora (orientación del sistema)
- DNP (distribución de recursos)
- MinHacienda (giros vía SPGR)

**Contexto en SICODIS**: Sistema con módulos de Recaudo Mensual, Recaudo Directas, Presupuesto y Recaudo, Plan de Recursos, Plan Bienal de Caja, Comparativo.

**Módulos relacionados**:
- [04-00. Introducción al SGR](../04-sgr/04-00-sgr-introduccion.md)
- Todos los módulos del capítulo 4

**Ver también**: [RNNR](#rnnr---recursos-naturales-no-renovables), [IAC](#iac---instrucción-de-abono-a-cuenta), [OCAD](#ocad---órganos-colegiados-de-administración-y-decisión)

---

### SISBEN

**Definición**: Sistema de Identificación de Potenciales Beneficiarios de Programas Sociales. Herramienta de focalización que clasifica a la población según condiciones socioeconómicas.

**Versiones**:
- SISBEN I, II, III (anteriores)
- **SISBEN IV** (vigente desde 2020)

**Clasificación**: Grupos A, B, C, D
- Grupo A: Pobreza extrema
- Grupo B: Pobreza moderada
- Grupo C: Vulnerable
- Grupo D: No pobre, no vulnerable

**Uso en SGP Salud**:
- Identificar población a afiliar al Régimen Subsidiado
- Calcular Unidad de Pago por Capitación (UPC-S)
- Determinar asignación de recursos SGP Salud por municipio/departamento

**Administración**: Departamento Nacional de Planeación (DNP)

**Contexto en SICODIS**: Variable subyacente en distribución de SGP Salud (no siempre visible directamente).

**Ver también**: [UPC-S](#upc-s---unidad-de-pago-por-capitación---régimen-subsidiado), [SGP](#sgp---sistema-general-de-participaciones)

---

### SPGR - Sistema de Presupuesto y Giro de Regalías

**Definición**: Plataforma tecnológica administrada por el Ministerio de Hacienda a través de la cual se ejecutan los recursos del SGR mediante pagos directos desde la Cuenta Única a destinatarios finales.

**Funcionamiento**:
```
1. DNP emite IAC (comunica distribución)
  ↓
2. MinHacienda registra disponibilidad en SPGR
  ↓
3. Beneficiario (entidad territorial) contrata y solicita pago en SPGR
  ↓
4. MinHacienda verifica y aprueba
  ↓
5. PAGO directo desde Cuenta Única del SGR a cuenta del contratista/proveedor
```

**Característica clave**: Los recursos NO se transfieren a cuentas de entidades territoriales, permanecen en la Cuenta Única del SGR.

**Ventajas**:
- Control y transparencia total
- Trazabilidad de recursos
- Prevención de desvío de fondos
- Pagos más rápidos a destinatarios finales

**Usuarios**: Entidades beneficiarias de recursos del SGR (departamentos, municipios, entidades nacionales)

**Administrador**: Ministerio de Hacienda y Crédito Público

**Contexto en SICODIS**: SICODIS muestra las IAC (distribución); la ejecución de pagos se consulta en SPGR.

**Ver también**: [IAC](#iac---instrucción-de-abono-a-cuenta), [SGR](#sgr---sistema-general-de-regalías), [Pago](#pago)

---

### SSEC - Sistema de Seguimiento, Evaluación y Control

**Definición**: Sistema del SGR destinado a realizar seguimiento, evaluación y control de los recursos y proyectos financiados con regalías.

**Funciones**:
- Seguimiento físico y financiero de proyectos
- Evaluación de resultados e impactos
- Control de legalidad y eficiencia
- Generación de alertas tempranas
- Información pública y transparencia

**Componentes**:
- Plataforma tecnológica (SUIFP-SGR)
- Interventorías y auditorías
- Indicadores de gestión
- Reportes de ejecución

**Financiación**: Porcentaje del SGR (asignación de funcionamiento)

**Responsables**:
- DNP: Coordinación del SSEC
- Contraloría General: Control fiscal
- Procuraduría: Control disciplinario
- Órganos de control territorial

**Contexto en SICODIS**: Aparece como concepto presupuestal en algunos módulos SGR (Funcionamiento SSEC).

**Normativa**: Ley 1530 de 2012, Decreto Ley 1949 de 2023

**Ver también**: [SGR](#sgr---sistema-general-de-regalías), [OCAD](#ocad---órganos-colegiados-de-administración-y-decisión)

---

### TreeTable

**Definición**: Componente de interfaz de usuario que presenta datos en forma de tabla con estructura jerárquica expandible/colapsable, utilizado extensivamente en SICODIS.

**Características**:
- **Niveles jerárquicos**: Nodos padre, hijos y hojas
- **Expansión/Colapso**: Iconos de flecha para expandir/colapsar nodos
- **Indentación**: Visual para identificar niveles
- **Totales automáticos**: Suma de nodos hijos en nodos padre

**Uso en SICODIS**:

**SGP**: Estructura de participaciones
```
1. TOTAL SGP (nivel 1)
  1.1. EDUCACIÓN (nivel 2)
    1.1.1. Prestación del Servicio (nivel 3 - hoja)
    1.1.2. Calidad - Gratuidad (nivel 3 - hoja)
  1.2. SALUD (nivel 2)
    1.2.1. Régimen Subsidiado (nivel 3 - hoja)
```

**SGR**: Distribución de asignaciones

**PGN**: Jerarquía de sectores y proyectos

**Tecnología**: PrimeNG TreeTable (Angular)

**Iconografía común**:
- **▼**: Nodo expandido
- **▶**: Nodo colapsado
- **•**: Nodo hoja (sin hijos)

**Módulos que usan TreeTable**:
- [03-01. SGP Resumen](../03-sgp/03-01-sgp-resumen.md)
- [04-05. SGR Plan de Recursos](../04-sgr/04-05-sgr-plan-recursos.md)
- Otros módulos con datos jerárquicos

**Ver también**: Documentación técnica en [CLAUDE.md](../../CLAUDE.md)

---

### UPC-S - Unidad de Pago por Capitación - Régimen Subsidiado

**Definición**: Valor per cápita anual que reconoce el Estado a las Entidades Promotoras de Salud (EPS) del Régimen Subsidiado por cada afiliado, para financiar el Plan de Beneficios en Salud.

**Características**:
- Valor anual por persona afiliada
- Cubre servicios del Plan de Beneficios (PBS)
- Diferenciado por edad, sexo, ubicación geográfica (zona urbana/rural)
- Actualizado anualmente por el Ministerio de Salud

**Cálculo de asignación SGP Salud**:
```
Recursos SGP Régimen Subsidiado = Población a afiliar × UPC-S

Ejemplo:
  Municipio con 50,000 personas SISBEN grupos A y B
  UPC-S promedio: $1,200,000/año

  Asignación SGP Salud Régimen Subsidiado:
  50,000 × $1,200,000 = $60,000 millones/año
```

**Componentes de la UPC-S**:
- Servicios de salud (hospitalarios, ambulatorios)
- Medicamentos del PBS
- Exámenes diagnósticos
- Procedimientos quirúrgicos

**Contexto en SICODIS**: Variable subyacente en cálculo de recursos SGP Salud (no siempre visible).

**Normativa**: Ley 1438 de 2011, Resoluciones anuales del Ministerio de Salud

**Ver también**: [SISBEN](#sisben), [SGP](#sgp---sistema-general-de-participaciones)

---

### Vigencia Fiscal

**Definición**: Período de un año calendario durante el cual se ejecuta el presupuesto público, correspondiente del 1 de enero al 31 de diciembre.

**En Colombia**: Coincide con el año calendario (enero-diciembre)

**Diferencias por sistema**:

**SGP**: Vigencia anual
- Cada año es una vigencia independiente
- Distribución de doceavas mensuales
- Cierre 31 de diciembre

**SGR**: Vigencia bienal
- Presupuesto para 2 años (bienio)
- Ejemplo: Bienio 2025-2026 = Vigencias 2025 y 2026
- Los bienios pueden traslaparse en su inicio

**PGN**: Vigencia anual
- Ley Anual de Presupuesto
- Ejecución enero-diciembre

**Contexto en SICODIS**: Los filtros de año permiten seleccionar la vigencia fiscal a consultar.

**Normativa**: Estatuto Orgánico de Presupuesto (Decreto 111 de 1996)

**Ver también**: [SGP](#sgp---sistema-general-de-participaciones), [SGR](#sgr---sistema-general-de-regalías), [PGN](#pgn---presupuesto-general-de-la-nación)

---

## Ver También

### Documentación Relacionada
- [01. Introducción General](../01-introduccion.md)
- [03-00. Introducción al SGP](../03-sgp/03-00-sgp-introduccion.md)
- [04-00. Introducción al SGR](../04-sgr/04-00-sgr-introduccion.md)
- [05-00. Introducción al PGN](../05-pgn/05-00-pgn-introduccion.md)
- [06-00. Preguntas Frecuentes](./06-00-preguntas-frecuentes.md)
- [06-02. Soporte y Contacto](./06-02-soporte-contacto.md)

### Recursos Externos
- **DNP - Financiamiento Territorial**: https://www.dnp.gov.co
- **DANE - Estadísticas**: https://www.dane.gov.co
- **Ministerio de Hacienda - SPGR**: https://www.minhacienda.gov.co
- **BPIN**: https://bpin.dnp.gov.co

### Normativa Fundamental
- Constitución Política de Colombia (artículos 356, 357, 360, 361)
- Ley 715 de 2001 (SGP)
- Acto Legislativo 05 de 2011 (SGR)
- Ley 1530 de 2012 (SGR)
- Decreto Ley 1949 de 2023 (SGR)
- Decreto 111 de 1996 (Estatuto Orgánico de Presupuesto)

---

*Última actualización: 2026-04-09*
*Para sugerencias de nuevos términos o correcciones, contacte a sicodis@dnp.gov.co*
