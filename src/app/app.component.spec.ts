import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FluidSimulationModule } from '@triangular/fluid-simulation';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { ProjectComponent } from './project/project.component';
import { HexComponent } from './hex/hex.component';
import { BackgroundComponent } from './background/background.component';
import { NavigationComponent } from './navigation/navigation.component';
import { NotoEmojiIconsModule } from '@triangular/noto-emoji-icons';
import { RpgAwesomeIconsModule } from '@triangular/rpg-awesome-icons';
import { FontAwesomeIconsModule } from '@triangular/font-awesome-icons';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NotoEmojiIconsModule,
        RpgAwesomeIconsModule,
        FontAwesomeIconsModule,
        FluidSimulationModule.forRoot(),
      ],
      declarations: [
        AppComponent,
        MapComponent,
        ProjectComponent,
        HexComponent,
        BackgroundComponent,
        NavigationComponent,
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
