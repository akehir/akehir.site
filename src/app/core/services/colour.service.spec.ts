import { TestBed, inject } from '@angular/core/testing';

import { ColourService } from './colour.service';
import { provideZonelessChangeDetection } from '@angular/core';

describe('ColourService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), ColourService],
    });
  });

  it('should be created', inject([ColourService], (service: ColourService) => {
    expect(service).toBeTruthy();
  }));
});
