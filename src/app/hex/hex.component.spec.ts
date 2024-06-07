import { ComponentFixture, TestBed, } from '@angular/core/testing';

import { HexComponent } from './hex.component';
import {BackgroundComponent} from '../background/background.component';
import {ProjectComponent} from '../project/project.component';
import {FluidSimulationModule} from '@triangular/fluid-simulation';
import { RouterTestingModule } from '@angular/router/testing';
import { NotoEmojiIconsModule } from '@triangular/noto-emoji-icons';
import { RpgAwesomeIconsModule } from '@triangular/rpg-awesome-icons';
import { FontAwesomeIconsModule } from '@triangular/font-awesome-icons';
import {provideExperimentalZonelessChangeDetection} from "@angular/core";

describe('HexComponent', () => {
  let component: HexComponent;
  let fixture: ComponentFixture<HexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NotoEmojiIconsModule,
        RpgAwesomeIconsModule,
        FontAwesomeIconsModule,
        FluidSimulationModule.forRoot(),
      ],
      declarations: [
        HexComponent,
        BackgroundComponent,
        ProjectComponent,
      ], providers: [provideExperimentalZonelessChangeDetection()]
    })
    .compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(HexComponent);
    await fixture.whenStable();
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
