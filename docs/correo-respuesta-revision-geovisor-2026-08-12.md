**Asunto:** Ajustes al Geovisor de Recursos según la revisión del 06/08/2026

Estimados,

Atendiendo las observaciones de la revisión del Geovisor, les comparto un resumen
de los ajustes realizados para mejorar la experiencia de usuario, la jerarquía
visual y la consistencia con los mockups definidos. Todos los cambios fueron
verificados en el navegador con datos reales.

---

### 1. Tarjetas de cobertura más compactas
Se redujo la altura de las tarjetas de cobertura para dar mayor protagonismo al
mapa del Geovisor.

### 2. Reorganización del menú lateral
Se reordenaron las opciones siguiendo el flujo natural de consulta:
**Consulta de recursos → Vigencia → Consulta especial → Visualización →
Aplicar/Limpiar filtros → Acerca del visor → Notas.**

### 3. Control de opacidad más claro
Se agregó la etiqueta **"Opacidad"** sobre cada control deslizante y se muestra el
**porcentaje aplicado** a cada sistema (y a los municipios en la vista de detalle).

### 4. Cabecera de las vistas de detalle
Se reorganizó para presentar la información de forma más ordenada: a la izquierda,
el botón **Volver**, el **nombre y código del territorio** (con la ruta
Departamento › Municipio); a la derecha, los **accesos a los sistemas
(SGR / SGP / PGN)** y la **vigencia** consultada.

### 5. Árbol de categorías desplegable
El listado de asignaciones (SGR) y participaciones (SGP) pasó a un **árbol
desplegable con casillas de selección**, conforme al mockup. Esto reduce la
longitud del panel y permite **seleccionar una o varias asignaciones** para
compararlas. Los valores ya no se muestran dentro del árbol (se presentan en el
pop-up y en el panel derecho).

### 6. Información del municipio en un pop-up
Al seleccionar un municipio, su información se presenta en una **ventana sobre el
mapa**, evitando duplicar datos en los paneles. La ventana muestra el detalle de
las asignaciones/participaciones seleccionadas en el árbol. Para el Presupuesto
Nacional (PGN), que no cuenta con información a nivel de municipio, se mantiene el
mensaje **"Sin información a nivel de municipio"**.

### 7. Panel derecho enfocado en la selección
Se rediseñó para **no repetir** la información de los indicadores superiores.
Ahora presenta la **distribución porcentual** (gráfica de anillo) de las
asignaciones/participaciones seleccionadas y **amplía el detalle financiero** de
cada una.

### 8. Colores consistentes con SICODIS
Cada participación del SGP utiliza los **mismos colores** que en SICODIS
(Educación, Salud, Agua Potable, Propósito General y Asignaciones Especiales),
favoreciendo la consistencia visual entre aplicaciones.

### 9. Conexión de datos del SGP
Se corrigió la visualización del SGP: antes la **Distribución** y el **Avance**
aparecían en cero. Ahora la tarjeta de **Distribución** muestra el valor
distribuido del territorio y el **Avance** refleja el 100% (el SGP se distribuye
en su totalidad).

### 10. PGN en la vista municipal
Cuando el usuario está en la vista de un municipio y selecciona **PGN**, la
consulta se **redirige a la vista departamental** correspondiente, dado que este
sistema no dispone de información a nivel municipal.

---

Adicionalmente, se resolvió un problema de rendimiento que congelaba la vista de
detalle al interactuar con el árbol de selección.

Quedamos atentos a sus comentarios.

Cordial saludo,
