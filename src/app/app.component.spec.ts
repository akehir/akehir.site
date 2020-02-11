import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FluidSimulationModule } from '@triangular/fluid-simulation';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { ProjectComponent } from './project/project.component';
import { HexComponent } from './hex/hex.component';
import { BackgroundComponent } from './background/background.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FluidSimulationModule.forRoot(),
      ],
      declarations: [
        AppComponent,
        MapComponent,
        ProjectComponent,
        HexComponent,
        BackgroundComponent,
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'akehir.com | CyberShaman by the Graces of Electron'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('akehir.com | CyberShaman by the Graces of Electron');
  });
});
