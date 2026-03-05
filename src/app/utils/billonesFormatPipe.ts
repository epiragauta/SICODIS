import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'billonesFormat',
  standalone: true
})
export class BillonesFormatPipe implements PipeTransform {
  transform(value: number | string | null | undefined, decimals: number = 2): string {
    if (value === null || value === undefined) {
      return '';
    }
    const num = Number(value);
    if (isNaN(num)) {
      return '';
    }
    const billones = num / 1e12;
    return billones.toFixed(decimals).replace('.', ',') + ' billones';
  }
}
