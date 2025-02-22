import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectComponent } from './project.component';
import { ProjectsService } from '@core/services/projects.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NotoEmojiIconsModule } from '@triangular/noto-emoji-icons';
import { RpgAwesomeIconsModule } from '@triangular/rpg-awesome-icons';
import { FontAwesomeIconsModule } from '@triangular/font-awesome-icons';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('UnitComponent', () => {
  let component: ProjectComponent;
  let fixture: ComponentFixture<ProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NotoEmojiIconsModule,
        RpgAwesomeIconsModule,
        FontAwesomeIconsModule,
      ],
      declarations: [ProjectComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        ProjectsService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
