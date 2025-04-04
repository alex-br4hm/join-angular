import { TestBed } from '@angular/core/testing';

import { CompareObjectsService } from './compare-objects.service';

describe('CompareObjectsService', () => {
  let service: CompareObjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompareObjectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
