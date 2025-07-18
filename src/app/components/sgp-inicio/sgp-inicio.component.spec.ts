import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgpInicioComponent } from './sgp-inicio.component';

describe('SgpInicioComponent', () => {
  let component: SgpInicioComponent;
  let fixture: ComponentFixture<SgpInicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SgpInicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SgpInicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
