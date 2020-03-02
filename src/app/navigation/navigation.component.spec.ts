import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationComponent } from './navigation.component';
import { HexComponent } from '../hex/hex.component';
import { BackgroundComponent } from '../background/background.component';
import { ProjectComponent } from '../project/project.component';
import { FluidSimulationModule } from '@triangular/fluid-simulation';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FluidSimulationModule.forRoot(),
      ],
      declarations: [
        NavigationComponent,
        BackgroundComponent,
        ProjectComponent,
        HexComponent,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
