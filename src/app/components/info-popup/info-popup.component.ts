import { Component, OnInit, Input, Output, EventEmitter, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-info-popup',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  providers: [CookieService],
  templateUrl: './info-popup.component.html',
  styleUrls: ['./info-popup.component.scss']
})
export class InfoPopupComponent implements OnInit {
  @Input() contentTitle: string = "Información Importante";
  @Input() infoText: string = "";
  @Input() showPopup: boolean | undefined = undefined; // Para control externo del popup
  @Input() useAutomaticDisplay: boolean = true; // Para controlar si usa el sistema automático de cookies
  @Output() onClose = new EventEmitter<void>(); // Evento cuando se cierra el popup

  displayPopup: boolean = false;
  cookieName: string = 'sgrInfoPopupCount';
  maxDisplays: number = 30;

  constructor(
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Solo usar el sistema automático si useAutomaticDisplay es true y showPopup no está definido
    if (this.useAutomaticDisplay && this.showPopup === undefined) {
      if (isPlatformBrowser(this.platformId)) {
        let count = Number(this.cookieService.get(this.cookieName) || 0);
        if (count < this.maxDisplays) {
          setTimeout(() => {
            this.displayPopup = true;
          }, 750);
          count++;
          this.cookieService.set(this.cookieName, count.toString(), 365, '/');
        }
      }
    }
  }

  ngOnChanges(): void {
    // Si showPopup está definido, usar ese valor para controlar el popup
    if (this.showPopup !== undefined) {
      this.displayPopup = this.showPopup;
    }
  }

  onPopupHide(): void {
    this.displayPopup = false;
    // Emitir evento de cierre para componentes padre
    this.onClose.emit();
  }

  closePopup(): void {
    this.onPopupHide();
  }
}