import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColourService } from '@core/services/colour.service';
import { ConsoleService } from '@core/services/console.service';

import { ColourComponent } from './colour.component';

import { provideRouter } from '@angular/router';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('ColourComponent', () => {
  let component: ColourComponent;
  let fixture: ComponentFixture<ColourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ColourComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideRouter([]),
        ColourService,
        ConsoleService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
