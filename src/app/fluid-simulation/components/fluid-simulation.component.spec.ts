import { async, ComponentFixture, TestBed } from '@angular/core/testing';


import { FluidSimulationComponent } from './fluid-simulation.component';

import { RouterTestingModule } from '@angular/router/testing';

describe('ColourComponent', () => {
  let component: FluidSimulationComponent;
  let fixture: ComponentFixture<FluidSimulationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FluidSimulationComponent ],
      imports: [
        RouterTestingModule,
      ],
      providers: [
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FluidSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
