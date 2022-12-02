import { TestBed } from '@angular/core/testing';

import { FirebaseUtilService } from './firebase-util.service';

describe('FirebaseUtilService', () => {
  let service: FirebaseUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
