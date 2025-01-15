import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyeccionSgpComponent } from './proyeccion-sgp.component';

describe('ProyeccionSgpComponent', () => {
  let component: ProyeccionSgpComponent;
  let fixture: ComponentFixture<ProyeccionSgpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyeccionSgpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProyeccionSgpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
