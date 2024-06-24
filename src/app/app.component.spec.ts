import { TestBed } from '@angular/core/testing';
import { FluidSimulationModule } from '@triangular/fluid-simulation';
import { AppComponent } from './app.component';
import { MapComponent } from './layout/map/map.component';
import { ProjectComponent } from './pages/project/project.component';
import { HexComponent } from './layout/hex/hex.component';
import { BackgroundComponent } from './layout/background/background.component';
import { NavigationComponent } from './layout/navigation/navigation.component';
import { NotoEmojiIconsModule } from '@triangular/noto-emoji-icons';
import { RpgAwesomeIconsModule } from '@triangular/rpg-awesome-icons';
import { FontAwesomeIconsModule } from '@triangular/font-awesome-icons';
import { AppRoutingModule } from "./app-routing.module";
import {provideExperimentalZonelessChangeDetection} from "@angular/core";
import { BackgroundService } from '@core/services/background.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NotoEmojiIconsModule,
        RpgAwesomeIconsModule,
        FontAwesomeIconsModule,
        FluidSimulationModule.forRoot(),
        AppRoutingModule
      ],
      declarations: [
        AppComponent,
        MapComponent,
        ProjectComponent,
        HexComponent,
        BackgroundComponent,
        NavigationComponent,
      ],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        BackgroundService,
      ]
    }).compileComponents();
  });

  it('should create the app', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();

    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'akehir.com | CyberShaman by the Graces of Electron'`, async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();

    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('akehir.com | CyberShaman by the Graces of Electron');
  });
});
