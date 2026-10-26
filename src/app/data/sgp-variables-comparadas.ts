/**
 * Configuración de la pestaña "Variables Comparadas" del Tablero comparativo SGP
 * (componente sgp-comparativa).
 *
 * Cada sección corresponde a una subpestaña y define las variables a mostrar.
 * El origen de cada variable es uno de:
 *  - `eficiencias`: se calcula a partir de `GET /api/eficiencias/resumen/{dane}` para el año dado.
 *  - `ejemplo`: valores provisionales [vigencia anterior, vigencia] por entidad (1 y 2),
 *    mostrados como "dato preliminar" mientras se depura la información.
 *
 * Cuando el área funcional entregue la lista depurada de variables, basta con ajustar
 * este archivo (ver docs/plan-sgp-comparativa-variables-comparadas.md).
 */

import { ResumenMunicipioEficiencia } from '../services/sicodis-api.service';

export type SeccionVariablesId = 'generales' | 'educacion' | 'salud' | 'agua' | 'proposito' | 'asignaciones';

/**
 * - entero: separador de miles, sin decimales
 * - decimal: dos decimales
 * - porcentaje: el valor ya viene en puntos porcentuales (26.67 → "26,67 %")
 * - indice: cuatro decimales
 * - moneda: pesos sin decimales
 * - texto: se muestra tal cual, sin variación
 */
export type FormatoVariable = 'entero' | 'decimal' | 'porcentaje' | 'indice' | 'moneda' | 'texto';

export type ValorVariable = number | string | null;

export interface VariableDefinicion {
  nombre: string;
  formato: FormatoVariable;
  /** Obtiene el valor de la variable para un año de vigencia desde el resumen de Eficiencias */
  eficiencias?: (data: ResumenMunicipioEficiencia, anio: number) => number | null;
  /** Valores provisionales: [[anterior, vigencia] entidad 1, [anterior, vigencia] entidad 2] */
  ejemplo?: [[ValorVariable, ValorVariable], [ValorVariable, ValorVariable]];
}

export interface SeccionVariables {
  id: SeccionVariablesId;
  label: string;
  titulo: string;
  icono: string;
  /** La sección aún no tiene variables definidas */
  enDepuracion?: boolean;
  variables: VariableDefinicion[];
}

/** Fila calculada que se muestra en la tabla comparativa */
export interface VariableComparada {
  nombre: string;
  formato: FormatoVariable;
  anterior: ValorVariable;
  actual: ValorVariable;
  /** Variación porcentual (0.0123 = 1,23 %); null cuando no aplica */
  variacion: number | null;
  preliminar: boolean;
}

/** Desfase entre la vigencia SGP y el año de los insumos fiscales (FUT / Ley 617) */
const REZAGO_FISCAL = 2;

const valorPorAnio = (serie: { anio: number; valor: number | null }[] | undefined, anio: number): number | null =>
  serie?.find(item => item.anio === anio)?.valor ?? null;

const poblacion = (data: ResumenMunicipioEficiencia, anio: number): number | null =>
  data.poblacion?.find(item => item.anio === anio)?.poblacion ?? null;

const ingresosTributarios = (data: ResumenMunicipioEficiencia, anio: number): number | null =>
  valorPorAnio(data.ingresos_tributarios, anio - REZAGO_FISCAL);

const ingresosTributariosPerCapita = (data: ResumenMunicipioEficiencia, anio: number): number | null => {
  const ingresos = ingresosTributarios(data, anio);
  const pob = poblacion(data, anio - REZAGO_FISCAL);
  return ingresos !== null && pob ? ingresos / pob : null;
};

const ICON_BASE = 'assets/img/sgp/comparativo';

export const SECCIONES_VARIABLES: SeccionVariables[] = [
  {
    id: 'generales',
    label: 'Variables Generales',
    titulo: 'Variables generales entidad territorial',
    icono: `${ICON_BASE}/generales.png`,
    variables: [
      { nombre: 'Población total', formato: 'entero', eficiencias: poblacion },
      { nombre: 'Población rural', formato: 'entero', ejemplo: [[44000, 45000], [34000, 35000]] },
      { nombre: 'Población urbana', formato: 'entero', ejemplo: [[104000, 105000], [48000, 50000]] },
      { nombre: 'NBI', formato: 'porcentaje', eficiencias: (d, anio) => valorPorAnio(d.nbi, anio) },
      { nombre: 'Categorización Ley 617/00', formato: 'texto', ejemplo: [[4, 4], [5, 5]] },
      { nombre: 'Área geográfica (km²)', formato: 'decimal', ejemplo: [[1250.5, 1250.5], [850.3, 850.3]] },
      { nombre: 'Long. ribera río Magdalena (km)', formato: 'decimal', ejemplo: [[35.2, 35.2], [28.7, 28.7]] }
    ]
  },
  {
    id: 'educacion',
    label: 'Educación',
    titulo: 'Variables sector educación',
    icono: `${ICON_BASE}/educacion.png`,
    variables: [
      { nombre: 'Entidad Territorial Certificada en Educación (ETC)', formato: 'texto', ejemplo: [['Sí', 'Sí'], ['No', 'No']] },
      { nombre: 'Matrícula total', formato: 'entero', ejemplo: [[34850, 35420], [18200, 18650]] },
      { nombre: 'Matrícula oficial', formato: 'entero', ejemplo: [[28500, 28950], [16500, 16850]] },
      { nombre: 'Deserción escolar', formato: 'porcentaje', ejemplo: [[4.2, 3.8], [4.8, 4.5]] }
    ]
  },
  {
    id: 'salud',
    label: 'Salud',
    titulo: 'Variables sector salud',
    icono: `${ICON_BASE}/salud.png`,
    enDepuracion: true,
    variables: []
  },
  {
    id: 'agua',
    label: 'Agua Potable',
    titulo: 'Variables sector agua potable',
    icono: `${ICON_BASE}/agua-potable.png`,
    variables: [
      { nombre: 'Cobertura de acueducto en área total', formato: 'texto', ejemplo: [['Sí', 'Sí'], ['Sí', 'Sí']] },
      { nombre: 'Cobertura de alcantarillado en área total', formato: 'entero', ejemplo: [[34850, 35420], [34850, 35420]] },
      { nombre: 'Uso adecuado recursos', formato: 'entero', ejemplo: [[28500, 28950], [28500, 28950]] },
      { nombre: 'Subsidios pagados', formato: 'decimal', ejemplo: [[4.2, 3.8], [4.2, 3.8]] },
      { nombre: 'Aplicación estratificación socioeconómica', formato: 'decimal', ejemplo: [[4.2, 3.8], [4.2, 3.8]] },
      { nombre: 'Planes sectoriales adoptados (PGIRS)', formato: 'decimal', ejemplo: [[4.2, 3.8], [4.2, 3.8]] },
      { nombre: 'Tarifa de prestadores directos AAA', formato: 'decimal', ejemplo: [[4.2, 3.8], [4.2, 3.8]] },
      { nombre: 'Avance cobertura alcantarillado', formato: 'decimal', ejemplo: [[4.2, 3.8], [4.2, 3.8]] },
      { nombre: 'Avance cobertura rural acueducto', formato: 'decimal', ejemplo: [[4.2, 3.8], [4.2, 3.8]] },
      { nombre: 'Avance cobertura rural alcantarillado', formato: 'decimal', ejemplo: [[4.2, 3.8], [4.2, 3.8]] },
      { nombre: 'Avance cobertura urbana acueducto', formato: 'decimal', ejemplo: [[4.2, 3.8], [4.2, 3.8]] },
      { nombre: 'Avance cobertura urbana aseo', formato: 'decimal', ejemplo: [[4.2, 3.8], [4.2, 3.8]] },
      { nombre: 'Avance indicador calidad de agua (IRCA)', formato: 'decimal', ejemplo: [[4.2, 3.8], [4.2, 3.8]] }
    ]
  },
  {
    id: 'proposito',
    label: 'Propósito General',
    titulo: 'Variables propósito general',
    icono: `${ICON_BASE}/proposito.png`,
    variables: [
      { nombre: 'Reporte oportuno ingresos tributarios en FUT', formato: 'texto', ejemplo: [['Sí', 'Sí'], ['Sí', 'Sí']] },
      { nombre: 'Ingresos tributarios refrendados', formato: 'moneda', eficiencias: ingresosTributarios },
      { nombre: 'Ingresos tributarios per cápita', formato: 'moneda', eficiencias: ingresosTributariosPerCapita },
      { nombre: 'Indicador crecimiento ingresos per cápita (eficiencia fiscal)', formato: 'indice', eficiencias: (d, anio) => valorPorAnio(d.eficiencia_fiscal, anio) },
      { nombre: 'Indicador de eficiencia administrativa', formato: 'indice', eficiencias: (d, anio) => valorPorAnio(d.eficiencia_administrativa, anio) },
      { nombre: 'Ingresos corrientes de libre destinación (ICLD)', formato: 'moneda', eficiencias: (d, anio) => valorPorAnio(d.ley_617_icld, anio - REZAGO_FISCAL) },
      { nombre: 'Gastos de funcionamiento (GF)', formato: 'moneda', eficiencias: (d, anio) => valorPorAnio(d.ley_617_gastos_funcionamiento, anio - REZAGO_FISCAL) },
      { nombre: 'Razón GF / ICLD (Ley 617/00)', formato: 'indice', eficiencias: (d, anio) => valorPorAnio(d.ley_617_razon, anio - REZAGO_FISCAL) },
      { nombre: 'Holgura (Ley 617/00)', formato: 'indice', eficiencias: (d, anio) => valorPorAnio(d.ley_617_holgura, anio - REZAGO_FISCAL) },
      { nombre: 'Cumplimiento límite de gastos de funcionamiento Ley 617/00', formato: 'texto', ejemplo: [['Sí', 'Sí'], ['Sí', 'Sí']] },
      { nombre: 'Municipio en Ley 550/99 o 617/00 y utiliza recursos del SGP', formato: 'texto', ejemplo: [['No', 'No'], ['No', 'No']] },
      { nombre: 'Envío actualización SISBÉN', formato: 'texto', ejemplo: [['Sí', 'Sí'], ['Sí', 'Sí']] }
    ]
  },
  {
    id: 'asignaciones',
    label: 'Asignaciones Especiales',
    titulo: 'Variables asignaciones especiales',
    icono: `${ICON_BASE}/asignaciones-especiales.png`,
    variables: [
      { nombre: 'Población en resguardo indígena', formato: 'texto', ejemplo: [['Sí', 'Sí'], ['No', 'No']] },
      { nombre: 'Pasivo pensional total', formato: 'moneda', ejemplo: [[34850, 35420], [18200, 18650]] }
    ]
  }
];
