import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { SgrPlanBienalRecursosComponent } from './sgr-plan-bienal-recursos.component';

describe('SgrPlanBienalRecursosComponent', () => {
  let component: SgrPlanBienalRecursosComponent;
  let fixture: ComponentFixture<SgrPlanBienalRecursosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SgrPlanBienalRecursosComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SgrPlanBienalRecursosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
