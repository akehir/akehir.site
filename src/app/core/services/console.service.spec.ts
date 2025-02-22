import { TestBed, inject } from '@angular/core/testing';

import { ConsoleService } from './console.service';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('ConsoleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection(), ConsoleService],
    });
  });

  it('should be created', inject(
    [ConsoleService],
    (service: ConsoleService) => {
      expect(service).toBeTruthy();
    }
  ));
});
