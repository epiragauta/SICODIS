import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { SgpComparativaComponent } from './sgp-comparativa.component';

describe('SgpComparativaComponent', () => {
  let component: SgpComparativaComponent;
  let fixture: ComponentFixture<SgpComparativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SgpComparativaComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SgpComparativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
