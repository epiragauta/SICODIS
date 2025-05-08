import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface BudgetItem {
  desc: string;
  value: number;
  detail: Array<{desc: string, value: number}>;
}

/**
 * Versión alternativa del servicio que no usa HttpClient
 * Útil para despliegues rápidos o cuando hay problemas con la inyección
 */
@Injectable({
  providedIn: 'root'
})
export class BudgetServiceStatic {

  getBudgetData(): Observable<BudgetItem[]> {
    // Retorna directamente los datos estáticos
    return of(this.getStaticData());
  }

  // Método para calcular el total SGP cuando sea necesario
  calculateTotalSGP(items: BudgetItem[]): number {
    const totalItem = items.find(item => item.desc === 'Total SGP');
    return totalItem ? totalItem.value : 0;
  }

  // Datos estáticos
  private getStaticData(): BudgetItem[] {
    return [
      { desc: 'Educación', value: 23740455119716, detail: [
        {desc: 'Prestación Servicios', value: 22605127495868},
        {desc: 'Calidad', value: 1135237623848}]
      },
      { desc: 'Salud', value: 10361244440826, detail: [
        {desc: 'Régimen Subsidiado', value: 8428995552662},
        {desc: 'Salud Pública', value: 966124444082},
        {desc: 'Subsidio a la oferta', value: 966124444082}]
      },
      { desc: 'Agua Potable', value: 3624435882562, detail: [] },
      { desc: 'Propósito General', value: 7785825229209, detail: [
        {desc: 'Libre destinación', value: 8428995552662},
        {desc: 'Deporte', value: 966124444082},
        {desc: 'Cultura', value: 966124444082}]
      },
      { desc: 'Alimentación Escolar', value: 349579078179, detail: [] },
      { desc: 'Ribereños', value: 55932652509, detail: [] },
      { desc: 'Resguardos Indígenas', value: 363562241306, detail: [] },
      { desc: 'Fonpet Asignaciones Especiales', value: 2281446083719, detail: [] },
      { desc: 'Total SGP', value: 70540879911189, detail: [] }
    ];
  }
}
