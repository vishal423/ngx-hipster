import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { MovieService } from './movie.service';

describe('MovieService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    })
  );

  it('should be created', () => {
    const service: MovieService = TestBed.get(MovieService);
    expect(service).toBeTruthy();
  });
});
