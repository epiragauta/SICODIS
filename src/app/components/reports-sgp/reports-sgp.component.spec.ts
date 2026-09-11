import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { ReportsSgpComponent } from './reports-sgp.component';

describe('ReportsSgpComponent', () => {
  let component: ReportsSgpComponent;
  let fixture: ComponentFixture<ReportsSgpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsSgpComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsSgpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
