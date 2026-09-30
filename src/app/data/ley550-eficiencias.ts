/**
 * Estado "Ley 550" por entidad territorial para los indicadores de Eficiencia Fiscal (ef)
 * y Eficiencia Administrativa (ea) del SGP - Participación de Propósito General.
 *
 * Una ET aparece marcada en un año cuando su indicador coincide con el PROMEDIO NACIONAL
 * de ese año, lo que ocurre cuando cuenta con concepto favorable del Ministerio de Hacienda
 * y Crédito Público sobre el cumplimiento de un Acuerdo de Reestructuración de Pasivos
 * (Ley 550 de 1999) y/o Programa de Saneamiento Fiscal y Financiero. En ese caso, para la
 * distribución se le asigna el promedio nacional del respectivo indicador (art. 23 Ley 1176
 * de 2007), por lo que puede recibir recursos de eficiencia aun con indicadores propios
 * negativos.
 *
 * FUENTE: src/assets/db/Eficiencias Propósito General_2026_v_0.2.xlsx, hoja
 * "Indicadores_Ley 550" (réplica exacta de la fórmula de la hoja "Comparativa").
 * Los arreglos contienen los AÑOS de vigencia en los que aplica el estado.
 *
 * NOTA: Este archivo es una solución de frontend mientras el backend
 * (`GET /api/eficiencias/resumen/{dane}`) no exponga los campos
 * `ley_550_eficiencia_fiscal` / `ley_550_eficiencia_administrativa`
 * (ver docs/backend-eficiencias-ley-550.md). Si el backend los provee, tienen prioridad.
 * Corte de datos: vigencias 2019–2026.
 */

export interface Ley550Entry {
  /** Años en los que la ET está en Ley 550 para Eficiencia Fiscal */
  ef: number[];
  /** Años en los que la ET está en Ley 550 para Eficiencia Administrativa */
  ea: number[];
}

export const LEY_550_EFICIENCIAS: { [codigoDane: string]: Ley550Entry } = {
  '05190': { ef: [2019, 2020, 2021, 2022, 2023, 2024], ea: [2019, 2021] },
  '05483': { ef: [2024], ea: [2022, 2024, 2025, 2026] },
  '05659': { ef: [2019, 2020], ea: [2019, 2020] },
  '05789': { ef: [2019, 2020, 2021], ea: [] },
  '05819': { ef: [2019, 2020, 2021, 2022, 2023, 2024, 2026], ea: [2019, 2020, 2021, 2022, 2023, 2024, 2026] },
  '08001': { ef: [2019], ea: [2019] },
  '08520': { ef: [], ea: [2024] },
  '08638': { ef: [2019, 2020, 2021, 2022, 2023, 2025], ea: [2019, 2020, 2025, 2026] },
  '08758': { ef: [2019, 2020, 2024, 2025, 2026], ea: [2022, 2023] },
  '13430': { ef: [2019, 2020, 2021, 2022, 2023, 2024, 2026], ea: [2026] },
  '19110': { ef: [2019, 2020, 2021, 2022, 2023], ea: [2019, 2020, 2021, 2022] },
  '19318': { ef: [2020, 2022, 2023, 2024, 2025, 2026], ea: [2019, 2022, 2023] },
  '19743': { ef: [2019, 2020, 2022], ea: [2019, 2020, 2021, 2022, 2023] },
  '20001': { ef: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026], ea: [2022, 2023, 2024, 2025, 2026] },
  '20787': { ef: [2022, 2023, 2024, 2025, 2026], ea: [2020, 2021] },
  '23001': { ef: [2019, 2020, 2021], ea: [2019, 2020, 2021] },
  '23068': { ef: [2019, 2020, 2021, 2022], ea: [2020, 2021, 2023, 2024] },
  '23090': { ef: [2019], ea: [2019] },
  '23162': { ef: [2019], ea: [] },
  '23189': { ef: [2019, 2023, 2024, 2025], ea: [] },
  '23670': { ef: [2019, 2020, 2021], ea: [2019, 2020, 2021] },
  '23686': { ef: [2019, 2020, 2021, 2022, 2024, 2025], ea: [2019, 2020, 2021, 2022, 2024, 2025, 2026] },
  '27001': { ef: [2019, 2020, 2023, 2024, 2025, 2026], ea: [2019, 2022, 2023, 2024, 2025, 2026] },
  '44110': { ef: [2019, 2020], ea: [2019, 2020] },
  '52079': { ef: [2019, 2021, 2022, 2023, 2024, 2025, 2026], ea: [2019, 2024] },
  '52835': { ef: [2019], ea: [2019] },
  '70001': { ef: [2019, 2020, 2021, 2022, 2023], ea: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026] },
  '70508': { ef: [2024, 2025, 2026], ea: [2026] },
  '70742': { ef: [2019, 2021, 2022, 2023, 2024, 2026], ea: [2019, 2020, 2021, 2022, 2023, 2024, 2026] },
  '73055': { ef: [2019], ea: [2019] },
  '73347': { ef: [2019, 2020, 2021], ea: [2019, 2020, 2021] },
  '73349': { ef: [2019], ea: [2019] },
  '73411': { ef: [2019], ea: [2019] },
  '76001': { ef: [2019], ea: [2019] }
};
