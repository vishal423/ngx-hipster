import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { MovieFormService } from './movie-form.service';

describe('MovieFormService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [FormBuilder]
    })
  );

  it('should be created', () => {
    const service: MovieFormService = TestBed.get(MovieFormService);
    expect(service).toBeTruthy();
  });
});
