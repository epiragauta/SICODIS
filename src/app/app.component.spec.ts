import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { provideUserAuth } from './auth/auth.providers';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    // `ngOnInit` fuerza un `window.location.reload()` la primera vez de cada
    // sesión. En Karma eso recarga el propio runner y tumba la corrida, así que
    // se marca el centinela por adelantado para que ese camino no se dispare.
    sessionStorage.setItem('appReloaded', 'true');

    await TestBed.configureTestingModule({
      imports: [AppComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideUserAuth(),
        MessageService
      ]
    }).compileComponents();
  });

  afterEach(() => {
    sessionStorage.removeItem('appReloaded');
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it(`should have the 'SICODIS' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance.title).toEqual('SICODIS');
  });

  it('should render the layout shell', () => {
    // La plantilla generada por `ng new` mostraba un «Hello, SICODIS»; el
    // armazón real es enlace de salto + cabecera + migas + main + pie.
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('a.skip-link')?.textContent)
      .toContain('Saltar al contenido principal');
    expect(compiled.querySelector('main#main-content')).toBeTruthy();
    expect(compiled.querySelector('app-footer')).toBeTruthy();
  });
});
