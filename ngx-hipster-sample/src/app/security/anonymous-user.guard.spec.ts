import { TestBed, inject } from '@angular/core/testing';

import { AnonymousUserGuard } from './anonymous-user.guard';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('AnonymousUserGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnonymousUserGuard],
      imports: [HttpClientModule, RouterTestingModule]
    });
  });

  it('should ...', inject([AnonymousUserGuard], (guard: AnonymousUserGuard) => {
    expect(guard).toBeTruthy();
  }));
});
