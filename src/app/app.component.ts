import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PrimeNG } from 'primeng/config';
import { Toast } from 'primeng/toast';
import { filter } from 'rxjs/operators';

declare let gtag: Function;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    BreadcrumbComponent,
    MatSlideToggleModule,
    Toast
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'SICODIS';
  ocultarHeader = false;

  constructor(
    private primeng: PrimeNG,
    private router: Router,
    private titleService: Title,
    private activatedRoute: ActivatedRoute
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

        // Vista de pantalla completa: el menú superior genera confusión ahí
        this.ocultarHeader = pagePath.startsWith('/mapa-recursos');

        gtag('config', 'G-WMEFPZBK1Y', {
          page_path: pagePath
        });

        // CC23 — Título dinámico por página
        let route = this.activatedRoute.root;
        while (route.firstChild) route = route.firstChild;
        const breadcrumb = route.snapshot.data?.['breadcrumb'];
        this.titleService.setTitle(breadcrumb ? `${breadcrumb} | SICODIS` : 'SICODIS');

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
