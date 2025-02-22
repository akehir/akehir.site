import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HexComponent } from './hex.component';
import { FluidSimulationModule } from '@triangular/fluid-simulation';
import { NotoEmojiIconsModule } from '@triangular/noto-emoji-icons';
import { RpgAwesomeIconsModule } from '@triangular/rpg-awesome-icons';
import { FontAwesomeIconsModule } from '@triangular/font-awesome-icons';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

describe('HexComponent', () => {
  let component: HexComponent;
  let fixture: ComponentFixture<HexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HexComponent,
        NotoEmojiIconsModule,
        RpgAwesomeIconsModule,
        FontAwesomeIconsModule,
        FluidSimulationModule.forRoot(),
      ],
      providers: [
        provideRouter([]),
        provideExperimentalZonelessChangeDetection(),
      ],
    }).compileComponents();
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
