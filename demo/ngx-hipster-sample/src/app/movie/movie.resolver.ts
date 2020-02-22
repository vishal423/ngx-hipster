import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { Movie } from './movie';
import { MovieService } from './movie.service';

@Injectable({
  providedIn: 'root'
})
export class MovieResolver implements Resolve<Movie | undefined> {
  constructor(private service: MovieService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Movie | undefined> {
    const idParam = 'id';
    const id = route.params[idParam];
    if (id) {
      return this.service.getById(id);
    }
    return of(undefined);
  }
}
