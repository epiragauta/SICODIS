**Asunto:** Ajustes realizados al reporte de Administración y Sistema de Seguimiento (Funcionamiento del SGR)

Buen día,

A continuación comparto el resumen de los ajustes realizados sobre el reporte de
**Funcionamiento del SGR** (Administración y Sistema de Seguimiento – SSEC), a partir
de las observaciones recibidas. Los cambios buscan que la información mostrada
corresponda mejor a cada tipo de consulta y que los filtros se vean ordenados y
legibles.

---

### 1. Se ocultan indicadores que no aplican a los recursos "por distribuir"
Cuando se consulta el item **"Recursos por distribuir"** de las asignaciones
**Funcionamiento SGR** y **Fiscalización**, ya **no se muestran** la tarjeta de
**"Ejecución Presupuestal"** ni la gráfica de **"Afectación Presupuestal"**. Estos
recursos aún no han sido distribuidos, por lo que no tienen ejecución ni afectación
presupuestal que reportar, y mostrarlos podía prestarse a confusión.

### 2. Lista de conceptos depurada para Fiscalización en el bienio 2013 – 2014
Al seleccionar la asignación **"Fiscalización"** en la vigencia **2013 – 2014**, la
lista de **Conceptos** ahora muestra **únicamente "Fiscalización"**, que es el único
concepto con información en ese bienio. Se retiraron del listado los conceptos que
no tienen datos en esa vigencia, evitando así consultas que no arrojaban resultados.

### 3. Comparación de hasta tres municipios
Para la consulta de la asignación **"Funcionamiento SGR"**, concepto
**"Fortalecimiento entidades territoriales"**, beneficiario **"Municipios"**, ahora
es posible **seleccionar hasta tres municipios a la vez** y ver una **comparación**
entre ellos en la sección de detalle (una ficha y una gráfica por municipio). Además,
los selectores de **Departamento** y **Municipio** se ampliaron para que se vean
completos y ya no aparezcan recortados.

### 4. Corrección de registros duplicados en el detalle
Al consultar beneficiarios de la asignación **"Funcionamiento SGR"**, concepto
**"Entidades que emiten CTUS"** (por ejemplo, el Ministerio de Tecnologías de la
Información y las Comunicaciones o la Unidad Nacional para la Gestión del Riesgo de
Desastres), el detalle **mostraba el mismo registro repetido varias veces**. Ahora
cada beneficiario aparece **una sola vez**.

### 5. Nombres largos legibles en las gráficas de detalle
Los nombres de entidades muy largos hacían que la barra de la gráfica se viera muy
pequeña. Ahora esos nombres se **distribuyen en varias líneas**, de modo que la barra
recupera su tamaño y la información se lee con claridad.

### 6. Tarjetas de caja y recaudo según la entidad de la Comisión Rectora
Para el beneficiario **"Departamento Nacional de Planeación – Comisión Rectora"**, las
tarjetas de **"Situación de Caja"** y **"Avance del recaudo de ingresos corrientes"**
(con sus gráficas) **solo se muestran** cuando la entidad seleccionada es
**"Comisión Rectora – DNP"**. Para las demás entidades (departamentos, municipios y
asociaciones) esas tarjetas se ocultan, ya que no tienen situación de caja ni avance
de recaudo propios.

### 7. Presentación de la tarjeta "Avance del recaudo de ingresos corrientes"
Los tres datos de esta tarjeta (Presupuesto corriente, Recaudo corriente y Avance) se
mostraban **apilados verticalmente**. Se corrigió para que aparezcan **en una sola
fila**, igual que las demás tarjetas del reporte.

### 8. Selector de "Entidad" sin texto superpuesto
En el selector de **Entidad** (que aparece para la Comisión Rectora), el título se
**superponía** con el texto de ayuda. Se corrigió y, además, se **igualó su ancho** al
de los demás selectores para que el título se vea completo.

---

Todos los ajustes fueron revisados y el reporte compila correctamente. Quedo atento a
cualquier observación adicional.

Cordial saludo,
