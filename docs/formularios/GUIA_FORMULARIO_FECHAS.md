# Guía del Formulario de Fechas - Panel de Administración

## Resumen

Se ha implementado el **Formulario de Edición de Fechas** en el panel de administración de SICODIS. Este formulario permite gestionar centralmente todas las fechas de actualización y corte de recaudo utilizadas en los componentes del sistema.

---

## Ubicación

**Ruta:** `/admin-config` → Tab "Fechas y Vigencias"

**Componente:** `ConfigFechasFormComponent`

**Archivos:**
- `src/app/components/admin-config/components/config-fechas-form/config-fechas-form.component.ts` (580 líneas)
- `src/app/components/admin-config/components/config-fechas-form/config-fechas-form.component.html` (490 líneas)
- `src/app/components/admin-config/components/config-fechas-form/config-fechas-form.component.scss` (190 líneas)

---

## Estructura del Formulario

El formulario está organizado en **5 secciones** dentro de un acordeón de PrimeNG:

### 1. SGR - Vigencia Actual (2025-2026)
**Campos:**
- Fecha de Actualización (texto español)
- Fecha ISO (Actualización)
- Fecha de Corte de Recaudo (texto español)
- Fecha ISO (Corte)

**Componentes afectados:**
- `sgr-comparativo`
- `sgr-montos-corrientes-constantes`
- `sgr-programacion`

### 2. SGR - Plan Bienal (2025-2026)
**Campos:**
- Fecha de Actualización (texto español)
- Fecha ISO (Actualización)
- Fecha de Corte de Recaudo (texto español)
- Fecha ISO (Corte)

**Componentes afectados:**
- `sgr-plan-bienal-caja`
- `sgr-plan-bienal-recursos`

### 3. SGP - Reporte de Eficiencias
**Campos:**
- Fecha de Actualización (texto español)
- Fecha ISO (Actualización)
- Fecha de Corte (texto español)
- Fecha ISO (Corte)

**Componente afectado:**
- `sgp-eficiencias`

### 4. SGP - Resguardos Indígenas
**Campos:**
- Fecha de Actualización (texto español)
- Fecha ISO (Actualización)

**Componente afectado:**
- `sgp-resguardos`

### 5. SGR - Reporte de Funcionamiento (Tabla Editable)
**Datos:**
- Tabla con 8 vigencias (2012-2013 hasta 2026-2027)
- Edición inline por fila
- Sincronización automática de fechas ISO

**Componente afectado:**
- `reporte-funcionamiento`

---

## Características Principales

### 1. Sincronización Automática de Fechas

Cuando el usuario edita una fecha en **formato ISO** (usando el calendario), el campo de **texto español** se actualiza automáticamente, y viceversa.

**Ejemplo:**
```
Usuario selecciona: 2025-05-30 (calendario)
↓
Sistema actualiza: "mayo 30 de 2025" (texto)
```

**Implementación:**
```typescript
onFechaISOChange(form: FormGroup, isoField: string, textoField: string): void {
  const isoDate: Date | null = form.get(isoField)?.value;
  if (isoDate) {
    const textoFecha = this.convertirDateATextoEspanol(isoDate);
    form.patchValue({ [textoField]: textoFecha }, { emitEvent: false });
  }
}

onFechaTextoChange(form: FormGroup, textoField: string, isoField: string): void {
  const textoFecha: string = form.get(textoField)?.value;
  if (textoFecha) {
    const isoDate = this.convertirTextoEspanolADate(textoFecha);
    if (isoDate) {
      form.patchValue({ [isoField]: isoDate }, { emitEvent: false });
    }
  }
}
```

### 2. Validaciones

#### Validación de Formato de Fecha Texto
```typescript
private validarFormatoFechaTexto(control: any): { [key: string]: boolean } | null {
  const value = control.value;
  if (!value) return null;

  // Formato esperado: "mes día de año" (ej: "mayo 30 de 2025")
  const regex = /^([a-z]+)\s+(\d{1,2})\s+de\s+(\d{4})$/i;
  const match = value.match(regex);

  if (!match) {
    return { formatoInvalido: true };
  }

  const [, mes, dia, anio] = match;

  // Validar que el mes esté en español
  if (!this.MESES_ES.includes(mes.toLowerCase())) {
    return { mesInvalido: true };
  }

  // Validar día (1-31)
  const diaNum = parseInt(dia, 10);
  if (diaNum < 1 || diaNum > 31) {
    return { diaInvalido: true };
  }

  // Validar año (2000-2100)
  const anioNum = parseInt(anio, 10);
  if (anioNum < 2000 || anioNum > 2100) {
    return { anioInvalido: true };
  }

  return null;
}
```

#### Mensajes de Error en Pantalla
- "Campo requerido"
- "Formato inválido. Use: 'mes día de año'"
- "Mes inválido. Use un mes en español"
- "Día inválido (1-31)"
- "Año inválido (2000-2100)"

### 3. Tabla Editable (Reporte Funcionamiento)

La tabla permite edición **inline** fila por fila:

**Características:**
- Click en ícono de lápiz para editar una fila
- Edición de fecha de actualización y fecha de corte
- Botones de Guardar (✓) y Cancelar (✗)
- Actualización automática de fechas ISO al guardar
- Resaltado visual de la fila en edición (fondo amarillo claro)

**Flujo:**
1. Usuario hace click en ícono de lápiz
2. La fila se pone en modo edición
3. Usuario edita las fechas en texto español
4. Usuario hace click en ✓ (guardar)
5. Sistema convierte texto a ISO automáticamente
6. Fila vuelve a modo lectura

**Código de guardado:**
```typescript
onRowEditSave(vigencia: FechasReporteFuncionamiento): void {
  // Actualizar fecha ISO basándose en fecha texto
  const dateActualizacion = this.convertirTextoEspanolADate(vigencia.fecha_actualizacion);
  const dateCorte = this.convertirTextoEspanolADate(vigencia.fecha_corte_recaudo);

  if (dateActualizacion) {
    vigencia.fecha_iso_actualizacion = this.formatDateToISO(dateActualizacion) || '';
  }

  if (dateCorte) {
    vigencia.fecha_iso_corte = this.formatDateToISO(dateCorte) || '';
  }

  this.editingVigencia = null;
}
```

### 4. Persistencia en ConfigService

Cada sección tiene su propio método de guardado:
- `guardarSgrVigencia()`
- `guardarSgrPlanBienal()`
- `guardarSgpEficiencias()`
- `guardarSgpResguardos()`
- `guardarReporteFuncionamiento()`

**Flujo de guardado:**
```typescript
guardarSgrVigencia(): void {
  if (this.sgrVigenciaForm.invalid) {
    this.markFormGroupTouched(this.sgrVigenciaForm);
    return;
  }

  this.isSaving.set(true);
  this.saveError.set(null);

  const formValue = this.sgrVigenciaForm.value;
  const fechaData: FechaActualizacion = {
    fecha_actualizacion: formValue.fecha_actualizacion,
    fecha_corte_recaudo: formValue.fecha_corte_recaudo,
    fecha_iso_actualizacion: this.formatDateToISO(formValue.fecha_iso_actualizacion),
    fecha_iso_corte: this.formatDateToISO(formValue.fecha_iso_corte)
  };

  this.configService.setConfig({
    categoria: 'fechas',
    clave: 'sgr_fecha_actualizacion_vigencia_2025_2026',
    valor: JSON.stringify(fechaData),
    tipo_dato: 'json',
    descripcion: 'Fechas de actualización y corte de recaudo SGR vigencia 2025-2026'
  }).subscribe({
    next: () => {
      this.isSaving.set(false);
      this.saveSuccess.set(true);
      setTimeout(() => this.saveSuccess.set(false), 3000);
    },
    error: (error) => {
      this.isSaving.set(false);
      this.saveError.set('Error al guardar: ' + error.message);
    }
  });
}
```

### 5. Retroalimentación Visual

**Mensajes de éxito:**
- Aparecen en la parte superior del formulario
- Fondo verde con ícono de check
- Se ocultan automáticamente después de 3 segundos

**Mensajes de error:**
- Aparecen en la parte superior del formulario
- Fondo rojo con ícono de error
- Muestran el mensaje de error específico

**Loading states:**
- Botón "Guardar" muestra spinner mientras guarda
- Botón deshabilitado durante el guardado

---

## Uso del Formulario

### Paso 1: Acceder al Formulario
1. Navegar a `/admin-config`
2. Hacer click en el tab "Fechas y Vigencias"

### Paso 2: Editar una Sección
1. Expandir el acordeón de la sección deseada (ej: "SGR - Vigencia Actual")
2. Editar las fechas usando:
   - **Opción A:** Escribir directamente en formato texto español ("mayo 30 de 2025")
   - **Opción B:** Usar el calendario para seleccionar la fecha ISO
3. Hacer click en "Guardar Configuración"
4. Esperar confirmación de éxito

### Paso 3: Editar Tabla de Reporte Funcionamiento
1. Expandir "SGR - Reporte de Funcionamiento"
2. Click en ícono de lápiz en la fila a editar
3. Modificar las fechas en texto español
4. Click en ✓ para guardar la fila
5. Repetir para otras filas si es necesario
6. Click en "Guardar Todas las Vigencias" al finalizar

---

## Ejemplos de Uso

### Ejemplo 1: Cambiar Fecha de Actualización SGR Vigencia Actual

**Antes:**
```
Fecha de Actualización: mayo 30 de 2025
Fecha ISO: 2025-05-30
```

**Cambio:**
1. Escribir en campo de texto: "junio 15 de 2025"
2. Al salir del campo (blur), la fecha ISO se actualiza a: 2025-06-15
3. Click en "Guardar Configuración"
4. Mensaje de éxito aparece

**Después:**
```
Fecha de Actualización: junio 15 de 2025
Fecha ISO: 2025-06-15
```

### Ejemplo 2: Usar Calendario para Cambiar Fecha

**Cambio:**
1. Click en ícono de calendario en "Fecha ISO (Actualización)"
2. Seleccionar fecha: 2025-07-20
3. El campo de texto se actualiza automáticamente a: "julio 20 de 2025"
4. Click en "Guardar Configuración"

### Ejemplo 3: Editar Vigencia en Tabla

**Vigencia 2025-2026 - Antes:**
```
Fecha Actualización: mayo 30 de 2025
Fecha Corte: junio 30 de 2025
```

**Cambio:**
1. Click en lápiz en la fila "2025-2026"
2. Editar "Fecha Actualización" a: "julio 10 de 2025"
3. Editar "Fecha Corte" a: "agosto 10 de 2025"
4. Click en ✓ (guardar fila)
5. Click en "Guardar Todas las Vigencias"

**Después:**
```
Fecha Actualización: julio 10 de 2025
Fecha Corte: agosto 10 de 2025
ISO Actualización: 2025-07-10
ISO Corte: 2025-08-10
```

---

## Estilos y Diseño

### Paleta de Colores
- **Header del card:** Fondo gris claro con texto primario
- **Tabla en modo edición:** Fondo amarillo claro (#ffffe0)
- **Mensaje de éxito:** Fondo verde claro con borde verde
- **Mensaje de error:** Fondo rojo claro con borde rojo
- **Header de tabla:** Fondo color primario con texto blanco

### Responsivo
- **Desktop (>768px):** Formularios en grid 2 columnas
- **Mobile (<768px):** Formularios en 1 columna
- **Tabla:** Scroll horizontal en pantallas pequeñas

### Accesibilidad
- Tooltips informativos en campos complejos
- Mensajes de error claros y específicos
- Loading states visibles
- Focus visible en campos del formulario

---

## Tecnologías Utilizadas

### Angular
- Reactive Forms (`FormBuilder`, `FormGroup`, `Validators`)
- Signals para estado reactivo
- Standalone Components

### PrimeNG
- `AccordionModule` - Secciones colapsables
- `CardModule` - Contenedores
- `CalendarModule` - Selector de fechas
- `TableModule` - Tabla editable
- `MessagesModule` - Notificaciones
- `ButtonModule` - Botones
- `InputTextModule` - Campos de texto

### RxJS
- `Observable` - Operaciones asíncronas
- `subscribe` - Manejo de respuestas

---

## Próximos Pasos

### Mejoras Pendientes
1. **Validación cruzada:** Asegurar que fecha de corte >= fecha de actualización
2. **Preview en vivo:** Mostrar cómo se verá la fecha en los componentes
3. **Historial de cambios:** Mostrar quién y cuándo modificó cada fecha
4. **Exportar/Importar:** Permitir backup de configuraciones
5. **Tests unitarios:** Agregar tests para validaciones y sincronización

### Integración con Componentes
1. Migrar `sgr-comparativo` para usar fechas del ConfigService
2. Migrar `sgr-montos-corrientes-constantes`
3. Migrar `sgr-programacion`
4. Migrar `sgr-plan-bienal-caja`
5. Migrar `sgr-plan-bienal-recursos`
6. Migrar `sgp-eficiencias`
7. Migrar `sgp-resguardos`
8. Migrar `reporte-funcionamiento`

---

## Soporte y Resolución de Problemas

### Problema: "Campo requerido" al guardar
**Solución:** Asegurarse de llenar todos los campos obligatorios antes de guardar.

### Problema: "Formato inválido"
**Solución:** Verificar que el formato sea "mes día de año" con mes en español minúsculas (ej: "mayo 30 de 2025").

### Problema: Las fechas ISO no se sincronizan
**Solución:** Asegurarse de hacer blur (salir del campo) después de escribir la fecha en texto, o usar el calendario.

### Problema: Cambios no persisten
**Solución:** Verificar que haya hecho click en el botón "Guardar Configuración" y que aparezca el mensaje de éxito.

---

## Conclusión

El **Formulario de Fechas** está completamente funcional y permite gestionar todas las configuraciones de fechas del sistema SICODIS desde una interfaz centralizada. Los cambios se aplican inmediatamente y se persisten en localStorage hasta que se implemente la sincronización con backend.

**Estado:** ✅ COMPLETADO
**Fecha de implementación:** 10 de junio de 2026
**Próximo paso:** Migrar componentes para usar las fechas del ConfigService
