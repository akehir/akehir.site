import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { HexComponent } from './hex/hex.component';
import { BackgroundComponent } from './background/background.component';
import { ProjectComponent } from './project/project.component';
import { FluidSimulationModule } from '@triangular/fluid-simulation';
import { NavigationComponent } from './navigation/navigation.component';
import { ProjectsService } from '@core/services/projects.service';
import { HomeComponent } from './home/home.component';
import { NotoEmojiIconsModule } from '@triangular/noto-emoji-icons';
import { RpgAwesomeIconsModule } from '@triangular/rpg-awesome-icons';
import { FontAwesomeIconsModule } from '@triangular/font-awesome-icons';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    HexComponent,
    BackgroundComponent,
    ProjectComponent,
    NavigationComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FluidSimulationModule.forRoot({
      SCREENSHOT_KEY_CODE: 'KeyS',
      PAUSE_KEY_CODE: 'KeyP',
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
  ],
  providers: [
    ProjectsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
