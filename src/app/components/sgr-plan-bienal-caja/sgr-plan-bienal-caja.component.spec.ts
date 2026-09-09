import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { SgrPlanBienalCajaComponent } from './sgr-plan-bienal-caja.component';

describe('SgrPlanBienalCajaComponent', () => {
  let component: SgrPlanBienalCajaComponent;
  let fixture: ComponentFixture<SgrPlanBienalCajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SgrPlanBienalCajaComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SgrPlanBienalCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
