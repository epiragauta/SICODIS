import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'sgpBold',
  standalone: true
})
export class SgpBoldPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) {
      return '';
    }

    // Find the position of "SGP" (case insensitive) and make everything from that point bold
    const sgpIndex = value.toLowerCase().indexOf('sgp');
    
    if (sgpIndex !== -1) {
      const beforeSgp = value.substring(0, sgpIndex);
      const fromSgpOnwards = value.substring(sgpIndex);
      const boldText = beforeSgp + '<strong>' + fromSgpOnwards + '</strong>';
      return this.sanitizer.bypassSecurityTrustHtml(boldText);
    }
    
    // If "SGP" is not found, return the original text
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}