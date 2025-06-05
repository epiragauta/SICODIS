import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioSgp } from './inicio-sgp';

describe('InicioSgp', () => {
  let component: InicioSgp;
  let fixture: ComponentFixture<InicioSgp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioSgp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioSgp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
