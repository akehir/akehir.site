import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NavigationComponent } from './layout/navigation/navigation.component';
import { NotoEmojiIconsModule } from '@triangular/noto-emoji-icons';
import { RpgAwesomeIconsModule } from '@triangular/rpg-awesome-icons';
import { FontAwesomeIconsModule } from '@triangular/font-awesome-icons';
import { AppRoutingModule } from './app-routing.module';
import { provideZonelessChangeDetection } from '@angular/core';
import { BackgroundService } from '@core/services/background.service';
import { provideRouter } from '@angular/router';
import { FluidSimulationModule } from '@triangular/fluid-simulation';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppUpdateService } from '@core/services/app-update.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NavigationComponent,
        NotoEmojiIconsModule,
        RpgAwesomeIconsModule,
        FontAwesomeIconsModule,
        FluidSimulationModule.forRoot(),
        AppRoutingModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
      ],
      declarations: [AppComponent],
      providers: [
        provideZonelessChangeDetection(),
        BackgroundService,
        AppUpdateService,
        provideRouter([]),
      ],
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
    expect(app.title).toEqual(
      'akehir.com | CyberShaman by the Graces of Electron'
    );
  });
});
