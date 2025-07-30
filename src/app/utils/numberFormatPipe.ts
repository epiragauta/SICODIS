import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat',
  standalone: true
})
export class NumberFormatPipe implements PipeTransform {
  transform(value: number | string | null | undefined, decimals: number = 0): string {
    // If value is null, undefined, or not a number, return empty string
    if (value === null || value === undefined) {
      return '';
    }

    // Convert to number and parse
    let num = Number(value);

    // Check if it's a valid number
    if (isNaN(num)) {
      return '';
    }

    // Convert to millions
    num = num / 1000000;

    // Format with Colombian locale and then adjust separators
    // Separador de miles: punto (.), decimales: coma (,)
    const formatted = num.toLocaleString('es-CO', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: 1,
      useGrouping: true
    });

    // Replace Colombian format (thousands: comma, decimals: period) 
    // to requested format (thousands: period, decimals: comma)
    //.replace(/\./g, '|').replace(/,/g, '.').replace(/\|/g, ',')
    return formatted;
  }
}