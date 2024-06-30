import { BrowserModule } from '@angular/platform-browser';
import { NgModule, provideExperimentalZonelessChangeDetection } from '@angular/core';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './layout/map/map.component';
import { HexComponent } from './layout/hex/hex.component';
import { BackgroundComponent } from './layout/background/background.component';
import { ProjectComponent } from './pages/project/project.component';
import { MachinaComponent } from './pages/machina/machina.component';
import { FluidSimulationModule } from '@triangular/fluid-simulation';
import { NavigationComponent } from './layout/navigation/navigation.component';
import { ProjectsService } from '@core/services/projects.service';
import { HomeComponent } from './pages/home/home.component';
import { NotoEmojiIconsModule } from '@triangular/noto-emoji-icons';
import { RpgAwesomeIconsModule } from '@triangular/rpg-awesome-icons';
import { FontAwesomeIconsModule } from '@triangular/font-awesome-icons';
import { BackgroundService } from "@core/services/background.service";
import { ConsoleComponent } from "./layout/console";
import { ColourComponent } from "./pages/colour";
import { ConsoleService } from "@core/services/console.service";
import { ColourService } from "@core/services/colour.service";

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    HexComponent,
    BackgroundComponent,
    ProjectComponent,
    NavigationComponent,
    HomeComponent,
    MachinaComponent,
  ],
  imports: [
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
    provideExperimentalZonelessChangeDetection(),
    provideHttpClient(withInterceptorsFromDi()),
    ProjectsService,
    BackgroundService,
    ConsoleService,
    ColourService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
