import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoleComponent } from './console.component';

import { ConsoleService } from '@core/services/console.aervice';

import {provideRouter} from "@angular/router";
import {provideExperimentalZonelessChangeDetection} from "@angular/core";

describe('ConsoleComponent', () => {
  let component: ConsoleComponent;
  let fixture: ComponentFixture<ConsoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsoleComponent ],
      imports: [
      ],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideRouter([]),
        ConsoleService,
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
