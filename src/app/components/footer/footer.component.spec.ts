import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { provideUserAuth } from '../../auth/auth.providers';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [provideHttpClient(), provideRouter([]), provideUserAuth()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('muestra el acceso autenticado en la sección de contacto', () => {
    const enlace: HTMLAnchorElement | null =
      fixture.nativeElement.querySelector('.gov-co-acceso-autenticado');

    expect(enlace).toBeTruthy();
    expect(enlace!.getAttribute('href')).toBe('/autenticacion');
    expect(enlace!.textContent).toContain('Ingreso funcionarios');
    expect(enlace!.querySelector('i.pi-lock')).toBeTruthy();
  });
});
