import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { MovieListResolver } from './movie-list.resolver';

describe('MovieListResolver', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ imports: [HttpClientModule] })
  );

  it('should be created', () => {
    const service: MovieListResolver = TestBed.get(MovieListResolver);
    expect(service).toBeTruthy();
  });
});
