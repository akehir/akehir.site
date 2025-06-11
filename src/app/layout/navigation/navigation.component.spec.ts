import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationComponent } from './navigation.component';
import { FluidSimulationModule } from '@triangular/fluid-simulation';
import { provideZonelessChangeDetection } from '@angular/core';
import { FontAwesomeIconsModule } from '@triangular/font-awesome-icons';
import { RpgAwesomeIconsModule } from '@triangular/rpg-awesome-icons';
import { provideRouter } from '@angular/router';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NavigationComponent,
        FluidSimulationModule.forRoot(),
        FontAwesomeIconsModule,
        RpgAwesomeIconsModule,
      ],
      providers: [provideRouter([]), provideZonelessChangeDetection()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
