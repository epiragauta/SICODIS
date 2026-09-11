import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { ReportsTargetComponent } from './reports-target.component';

describe('ReportsTargetComponent', () => {
  let component: ReportsTargetComponent;
  let fixture: ComponentFixture<ReportsTargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsTargetComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsTargetComponent);
    component = fixture.componentInstance;
    // `ngOnInit` lee `reports` sin comprobarlo, así que la entrada es obligatoria.
    component.reports = {
      roteImg: '/assets/img/prueba.png',
      date: '2026-09-08',
      title: 'Reporte de prueba'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
