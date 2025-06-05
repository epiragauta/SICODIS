import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSgpComponent } from './home-sgp.component';

describe('HomeSgpComponent', () => {
  let component: HomeSgpComponent;
  let fixture: ComponentFixture<HomeSgpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeSgpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeSgpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
