import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundComponent } from './background.component';
import { RouterTestingModule } from '@angular/router/testing';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('BackgroundComponent', () => {
  let component: BackgroundComponent;
  let fixture: ComponentFixture<BackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [BackgroundComponent],
      providers: [provideExperimentalZonelessChangeDetection()],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(BackgroundComponent);
    await fixture.whenStable();
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
