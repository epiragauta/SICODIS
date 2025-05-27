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
    const num = Number(value);

    // Check if it's a valid number
    if (isNaN(num)) {
      return '';
    }

    // Use toLocaleString with specific options for Spanish (Colombia) formatting
    return num.toLocaleString('es-CO', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping: true
    });
  }
}