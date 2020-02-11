import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HexComponent } from './hex.component';
import {BackgroundComponent} from '../background/background.component';
import {ProjectComponent} from '../project/project.component';
import {FluidSimulationModule} from '@triangular/fluid-simulation';

describe('HexComponent', () => {
  let component: HexComponent;
  let fixture: ComponentFixture<HexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FluidSimulationModule.forRoot(),
      ],
      declarations: [
        HexComponent,
        BackgroundComponent,
        ProjectComponent,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
