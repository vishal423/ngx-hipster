import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Movie } from './movie';
import { MovieService } from './movie.service';

@Injectable({
  providedIn: 'root',
})
export class MovieListResolver implements Resolve<Movie[]> {
  constructor(private service: MovieService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<Movie[]> {
    return this.service.query();
  }
}
