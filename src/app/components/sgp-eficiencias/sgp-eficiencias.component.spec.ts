import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { SgpEficienciasComponent } from './sgp-eficiencias.component';

describe('SgpEficienciasComponent', () => {
  let component: SgpEficienciasComponent;
  let fixture: ComponentFixture<SgpEficienciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SgpEficienciasComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SgpEficienciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});