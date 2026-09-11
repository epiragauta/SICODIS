import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { ReporteFuncionamientoComponent } from './reporte-funcionamiento.component';

describe('ReporteFuncionamientoComponent', () => {
  let component: ReporteFuncionamientoComponent;
  let fixture: ComponentFixture<ReporteFuncionamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteFuncionamientoComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteFuncionamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
