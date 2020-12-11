import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MapComponent } from './map.component';
import {HexComponent} from '../hex/hex.component';
import {BackgroundComponent} from '../background/background.component';
import {ProjectComponent} from '../project/project.component';
import {FluidSimulationModule} from '@triangular/fluid-simulation';
import { ProjectsService } from '@core/services/projects.service';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FluidSimulationModule.forRoot(),
      ],
      declarations: [
        MapComponent,
        HexComponent,
        BackgroundComponent,
        ProjectComponent,
      ],
      providers: [
        ProjectsService,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
