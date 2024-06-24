import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationComponent } from './navigation.component';
import { HexComponent } from '../hex/hex.component';
import { BackgroundComponent } from '../background/background.component';
import { ProjectComponent } from '../../pages/project/project.component';
import { FluidSimulationModule } from '@triangular/fluid-simulation';
import {provideExperimentalZonelessChangeDetection} from "@angular/core";
import { FontAwesomeIconsModule } from '@triangular/font-awesome-icons';
import { RpgAwesomeIconsModule } from '@triangular/rpg-awesome-icons';


describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FluidSimulationModule.forRoot(),
        FontAwesomeIconsModule,
        RpgAwesomeIconsModule,
      ],
      declarations: [
        NavigationComponent,
        BackgroundComponent,
        ProjectComponent,
        HexComponent,
      ], providers: [provideExperimentalZonelessChangeDetection()]
    })
    .compileComponents();
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
