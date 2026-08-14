**Asunto:** Ajustes en el Mapa de Recursos del Geovisor — continuidad de la información por sistema (SICODIS)

Estimados,

Les comparto un resumen de los ajustes realizados en el **Mapa de Recursos** del
Geovisor. El foco de esta entrega es garantizar la **continuidad de la
información**: que al entrar al detalle de un sistema (Regalías, Participaciones
o Presupuesto Nacional) toda la consulta —mapa, ventana de municipio y notas—
se mantenga coherente con ese sistema.

---

### 1. La ventana del municipio muestra solo el sistema consultado

Al seleccionar una de las opciones **"Ver detalle"** de un departamento (SGR, SGP
o PGN) y luego hacer clic sobre un municipio, la ventana emergente ahora presenta
**únicamente la información del sistema seleccionado**.

Antes, esa ventana volvía a mostrar los tres sistemas a la vez, lo que rompía la
continuidad de la consulta. Con el ajuste, si se ingresó por Regalías, el
municipio muestra Regalías; si se ingresó por Participaciones, muestra
Participaciones; y en Presupuesto Nacional se indica de forma clara **"Sin
información a nivel de municipio"** (dado que actualmente no hay ese nivel de
desagregación para PGN).

### 2. La ventana del municipio se actualiza al cambiar de sistema

Si se cambia de sistema (SGR / SGP / PGN) con un municipio ya seleccionado, la
ventana emergente **se actualiza automáticamente** con la información del nuevo
sistema. Antes se quedaba con los datos del sistema inicial.

### 3. El municipio seleccionado conserva su resaltado

- Al ajustar el control de **opacidad de municipios**, el municipio seleccionado
  **conserva su resaltado** (contorno y énfasis), mientras el resto de la capa
  responde al control. Así no se pierde de vista cuál está seleccionado.
- Al **cambiar de sistema**, el municipio seleccionado mantiene el resaltado y
  adopta el color del nuevo sistema, en lugar de perder la selección.

### 4. Notas del panel según el sistema seleccionado

Las **notas** del panel de detalle dejaron de ser fijas y ahora corresponden al
sistema consultado, alineadas con las notas oficiales de cada módulo:

- **Regalías (SGR):** cifras en pesos corrientes; Ley 2441 de 2024 - Decretos 379
  y 380 del 2025.
- **Participaciones (SGP):** cifras en pesos corrientes; nota sobre los recursos
  pendientes por distribuir (educación y FONPET).
- **Presupuesto Nacional (PGN):** cifras en pesos corrientes; fuente DNP - DPIP -
  SDRT a partir del Presupuesto General de la Nación y reportes de
  regionalización presupuestal.

### 5. Ajustes visuales menores

Se afinó la legibilidad de las tarjetas de resumen (tamaño de la sigla y el
nombre del sistema) y de las líneas de cobertura.

---

Quedamos atentos a sus comentarios. En particular, si desean **ajustar el texto
de las notas de PGN** o incorporar alguna nota adicional, con gusto lo
incorporamos.

Cordial saludo,
