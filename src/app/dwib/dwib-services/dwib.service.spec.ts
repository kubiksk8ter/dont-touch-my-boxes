import { TestBed } from '@angular/core/testing';

import { DwibService } from './dwib.service';

describe('DwibService', () => {
  let service: DwibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DwibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
