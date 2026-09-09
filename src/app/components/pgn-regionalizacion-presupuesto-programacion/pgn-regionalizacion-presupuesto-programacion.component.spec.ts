import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { PgnRegionalizacionPresupuestoProgramacionComponent } from './pgn-regionalizacion-presupuesto-programacion.component';

describe('PgnRegionalizacionPresupuestoProgramacionComponent', () => {
  let component: PgnRegionalizacionPresupuestoProgramacionComponent;
  let fixture: ComponentFixture<PgnRegionalizacionPresupuestoProgramacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgnRegionalizacionPresupuestoProgramacionComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgnRegionalizacionPresupuestoProgramacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
