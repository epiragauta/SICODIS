/**
 * Utilidades de descarga de archivos en el navegador.
 *
 * Centraliza el patrón `createObjectURL` + `<a download>` + `revokeObjectURL`
 * que hasta ahora cada componente resolvía por su cuenta.
 */

/**
 * Dispara la descarga de un blob con el nombre indicado.
 *
 * Revoca siempre la URL temporal para no filtrar memoria.
 */
export function dispararDescarga(blob: Blob, nombreArchivo: string): void {
  const url = window.URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombreArchivo;
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  window.URL.revokeObjectURL(url);
}

/**
 * Extrae el nombre de archivo de la cabecera `Content-Disposition`.
 *
 * Soporta las dos formas habituales: `filename="x.xlsx"` y la codificada
 * `filename*=UTF-8''x.xlsx`. Devuelve `null` si no puede determinarlo, para
 * que quien llama decida el nombre por defecto.
 */
export function extraerNombreArchivo(contentDisposition: string | null): string | null {
  if (!contentDisposition) {
    return null;
  }

  const codificado = /filename\*=UTF-8''([^;]+)/i.exec(contentDisposition);
  if (codificado?.[1]) {
    try {
      return decodeURIComponent(codificado[1].trim());
    } catch {
      return codificado[1].trim();
    }
  }

  const simple = /filename="?([^";]+)"?/i.exec(contentDisposition);
  return simple?.[1]?.trim() ?? null;
}

/**
 * Descarga un texto plano (por ejemplo, un log de validación) como archivo.
 */
export function descargarTexto(contenido: string, nombreArchivo: string): void {
  dispararDescarga(new Blob([contenido], { type: 'text/plain;charset=utf-8' }), nombreArchivo);
}
