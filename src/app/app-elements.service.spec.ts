import { TestBed } from '@angular/core/testing';

import { AppElementsService } from './app-elements.service';

describe('AppElementsService', () => {
  let service: AppElementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppElementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
