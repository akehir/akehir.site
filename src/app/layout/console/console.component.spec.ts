import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoleComponent } from './console.component';

import { ConsoleService } from '../../services';

import { SharedModule } from '../../../shared';
import {provideRouter} from "@angular/router";
import {provideExperimentalZonelessChangeDetection} from "@angular/core";

describe('ConsoleComponent', () => {
  let component: ConsoleComponent;
  let fixture: ComponentFixture<ConsoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsoleComponent ],
      imports: [
        SharedModule,
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
