import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColourService, ConsoleService } from '../../services';

import { ColourComponent } from './colour.component';

import { SharedModule } from '../../../shared';
import {provideRouter} from "@angular/router";
import {provideExperimentalZonelessChangeDetection} from "@angular/core";

describe('ColourComponent', () => {
  let component: ColourComponent;
  let fixture: ComponentFixture<ColourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColourComponent ],
      imports: [
        SharedModule,
      ],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideRouter([]),
        ColourService,
        ConsoleService,
      ],
    })
    .compileComponents();
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
