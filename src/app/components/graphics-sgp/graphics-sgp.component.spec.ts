import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicsSgpComponent } from './graphics-sgp.component';

describe('GraphicsSgpComponent', () => {
  let component: GraphicsSgpComponent;
  let fixture: ComponentFixture<GraphicsSgpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphicsSgpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphicsSgpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
