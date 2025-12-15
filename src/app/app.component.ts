import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PrimeNG } from 'primeng/config';
import { filter } from 'rxjs/operators';

declare let gtag: Function;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    MatSlideToggleModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'SICODIS';

  constructor(
    private primeng: PrimeNG,
    private router: Router
  ) {}

  ngOnInit() {

    /* ===============================
       Configuración PrimeNG
    =============================== */
    this.primeng.ripple.set(true);
    this.primeng.zIndex = {
      modal: 1100,
      overlay: 1000,
      menu: 1000,
      tooltip: 1100
    };

    /* ===============================
       Google Analytics 4 – Page Views
    =============================== */
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {

        const pagePath = event.urlAfterRedirects;

        gtag('config', 'G-WMEFPZBK1Y', {
          page_path: pagePath
        });

      });

    /* ===============================
       Recarga controlada (tu lógica)
    =============================== */
    if (!sessionStorage.getItem('appReloaded')) {
      sessionStorage.setItem('appReloaded', 'true');
      window.location.reload();
    }
  }
}
