/**
 * Estado de un cargue de archivo, compartido por las pantallas de
 * administración del SGR (carga de insumos, ejecución de la distribución,
 * Instrucción de Abono a Cuenta).
 */
export type EstadoCarga = 'pendiente' | 'cargando' | 'cargado' | 'error';

/** Severidad de `p-tag` asociada a cada estado. */
export type SeveridadTag = 'success' | 'info' | 'danger' | 'warn';

/** Rótulo en español para mostrar al usuario. */
export function estadoCargaLabel(estado: EstadoCarga): string {
  switch (estado) {
    case 'cargado': return 'Cargado';
    case 'cargando': return 'Cargando…';
    case 'error': return 'Error';
    default: return 'Pendiente';
  }
}

/** Severidad visual de PrimeNG para el estado. */
export function estadoCargaSeverity(estado: EstadoCarga): SeveridadTag {
  switch (estado) {
    case 'cargado': return 'success';
    case 'cargando': return 'info';
    case 'error': return 'danger';
    default: return 'warn';
  }
}
