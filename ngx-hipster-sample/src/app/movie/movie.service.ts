import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Movie } from './movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private resourceUrl = 'api/movies';

  constructor(private http: HttpClient) {}

  query(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.resourceUrl);
  }

  getById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.resourceUrl}/${id}`);
  }

  create(movie: Movie): Observable<Movie> {
    return this.http.post<Movie>(this.resourceUrl, movie);
  }

  update(movie: Movie): Observable<Movie> {
    return this.http.put<Movie>(`${this.resourceUrl}/${movie.id}`, movie);
  }

  delete(id: number) {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`);
  }
}
