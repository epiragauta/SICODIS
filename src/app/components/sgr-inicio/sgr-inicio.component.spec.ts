import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgrInicioComponent } from './sgr-inicio.component';

describe('SgrInicioComponent', () => {
  let component: SgrInicioComponent;
  let fixture: ComponentFixture<SgrInicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SgrInicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SgrInicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
