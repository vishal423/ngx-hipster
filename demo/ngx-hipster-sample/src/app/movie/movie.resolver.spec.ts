import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { MovieResolver } from './movie.resolver';

describe('MovieResolveService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    })
  );

  it('should be created', () => {
    const service: MovieResolver = TestBed.inject(MovieResolver);
    expect(service).toBeTruthy();
  });
});
