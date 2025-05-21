import { Component, OnInit, Input, PLATFORM_ID, Inject } from '@angular/core';
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

  displayPopup: boolean = false;
  cookieName: string = 'sgrInfoPopupCount';
  maxDisplays: number = 5;

  constructor(
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      let count = Number(this.cookieService.get(this.cookieName) || 0);
      if (count < this.maxDisplays) {
        this.displayPopup = true;
        count++;
        this.cookieService.set(this.cookieName, count.toString(), 365, '/');
      }
    }
  }

  onPopupHide(): void {
    this.displayPopup = false;
  }
}
