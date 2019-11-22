import { TestBed } from '@angular/core/testing';

import { NgxHipsterService } from './ngx-hipster.service';

describe('NgxHipsterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxHipsterService = TestBed.get(NgxHipsterService);
    expect(service).toBeTruthy();
  });
});
