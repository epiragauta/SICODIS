import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentFormat',
  standalone: true
})
export class PercentFormatPipe implements PipeTransform {
  transform(value: number | string | null | undefined, decimals: number = 2): string {
    // If value is null, undefined, or not a number, return empty string
    if (value === null || value === undefined) {
      return '';
    }

    // Convert to number
    let num = Number(value);

    // Check if it's a valid number
    if (isNaN(num)) {
      return '';
    }

    // Convert to percentage (multiply by 100)
    const percentage = num * 100;

    // Format without using locale to avoid comma thousands separator
    const formatted = percentage.toFixed(decimals).replace('.', ',');
    
    return formatted + '%';
  }
}