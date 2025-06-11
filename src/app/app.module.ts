import { BrowserModule } from '@angular/platform-browser';
import { NgModule, provideZonelessChangeDetection } from '@angular/core';
import {
  provideHttpClient,
  withInterceptorsFromDi,
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
import { NavigationComponent } from './layout/navigation/navigation.component';

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
  ],
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptorsFromDi()),
    ProjectsService,
    BackgroundService,
    ConsoleService,
    ColourService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
