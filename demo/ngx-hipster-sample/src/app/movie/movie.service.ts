import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Movie } from './movie';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private resourceUrl = 'api/movies';

  constructor(private http: HttpClient) {}

  query(): Observable<Movie[]> {
    return this.http
      .get<Movie[]>(this.resourceUrl)
      .pipe(map((response: Movie[]) => this.parseArrayResponse(response)));
  }

  getById(id: number): Observable<Movie> {
    return this.http
      .get<Movie>(`${this.resourceUrl}/${id}`)
      .pipe(map((movie: Movie) => this.parseResponse(movie)));
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

  private parseArrayResponse(response: Movie[]): Movie[] {
    response.forEach((movie: Movie) => {
      this.parseResponse(movie);
    });
    return response;
  }

  private parseResponse(movie: Movie): Movie {
    movie.releaseDate = new Date(movie.releaseDate);
    return movie;
  }
}
