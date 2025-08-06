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

    // Replace "SGP" with bold version (case insensitive)
    const boldText = value.replace(/(SGP)/gi, '<strong>$1</strong>');
    
    return this.sanitizer.bypassSecurityTrustHtml(boldText);
  }
}