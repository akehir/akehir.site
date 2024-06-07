import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MapComponent } from './map.component';
import {HexComponent} from '../hex/hex.component';
import {BackgroundComponent} from '../background/background.component';
import {ProjectComponent} from '../project/project.component';
import {FluidSimulationModule} from '@triangular/fluid-simulation';
import { ProjectsService } from '@core/services/projects.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NotoEmojiIconsModule } from '@triangular/noto-emoji-icons';
import { RpgAwesomeIconsModule } from '@triangular/rpg-awesome-icons';
import { FontAwesomeIconsModule } from '@triangular/font-awesome-icons';
import {provideExperimentalZonelessChangeDetection} from "@angular/core";

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NotoEmojiIconsModule,
        RpgAwesomeIconsModule,
        FontAwesomeIconsModule,
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
        provideExperimentalZonelessChangeDetection()
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
