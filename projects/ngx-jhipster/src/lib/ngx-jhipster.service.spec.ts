import { TestBed } from '@angular/core/testing';

import { NgxJhipsterService } from './ngx-jhipster.service';

describe('NgxJhipsterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxJhipsterService = TestBed.get(NgxJhipsterService);
    expect(service).toBeTruthy();
  });
});
