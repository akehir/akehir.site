import { BrowserModule } from '@angular/platform-browser';
import {
  isDevMode,
  NgModule,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  withXhr,
} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FluidSimulationModule } from '@triangular/fluid-simulation';
import { ProjectsService } from '@core/services/projects.service';
import { NotoEmojiIconsModule } from '@triangular/noto-emoji-icons';
import { RpgAwesomeIconsModule } from '@triangular/rpg-awesome-icons';
import { FontAwesomeIconsModule } from '@triangular/font-awesome-icons';
import { BackgroundService } from '@core/services/background.service';
import { ConsoleComponent } from './layout/console';
import { ColourComponent } from './pages/colour';
import { ConsoleService } from '@core/services/console.service';
import { ColourService } from '@core/services/colour.service';
import { AppUpdateService } from '@core/services/app-update.service';
import { NavigationComponent } from './layout/navigation/navigation.component';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [AppComponent],
  imports: [
    NavigationComponent,
    BrowserModule,
    AppRoutingModule,
    FluidSimulationModule.forRoot({
      SCREENSHOT_KEY_CODE: '',
      // SCREENSHOT_KEY_CODE: 'KeyS',
      PAUSE_KEY_CODE: '',
      // PAUSE_KEY_CODE: 'KeyP',
      SPLASH_KEY: ' ',
      BLOOM_INTENSITY: 0,
      SPLAT_FORCE: 0,
      SPLAT_RADIUS: 1,
      CURL: 1,
      PRESSURE: 0,
      PRESSURE_ITERATIONS: 10,
    }),
    NotoEmojiIconsModule,
    RpgAwesomeIconsModule,
    FontAwesomeIconsModule,
    ConsoleComponent,
    ColourComponent,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(withXhr(), withInterceptorsFromDi()),
    ProjectsService,
    BackgroundService,
    ConsoleService,
    ColourService,
    AppUpdateService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
