import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HexComponent } from './hex.component';
import {BackgroundComponent} from '../background/background.component';
import {ProjectComponent} from '../project/project.component';
import {FluidSimulationModule} from '@triangular/fluid-simulation';
import { RouterTestingModule } from '@angular/router/testing';
import { NotoEmojiIconsModule } from '@triangular/noto-emoji-icons';
import { RpgAwesomeIconsModule } from '@triangular/rpg-awesome-icons';
import { FontAwesomeIconsModule } from '@triangular/font-awesome-icons';

describe('HexComponent', () => {
  let component: HexComponent;
  let fixture: ComponentFixture<HexComponent>;

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
        HexComponent,
        BackgroundComponent,
        ProjectComponent,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
