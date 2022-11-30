import { TestBed } from '@angular/core/testing';

import { AdminConsoleLibService } from './admin-console-lib.service';

describe('AdminConsoleLibService', () => {
  let service: AdminConsoleLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminConsoleLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
