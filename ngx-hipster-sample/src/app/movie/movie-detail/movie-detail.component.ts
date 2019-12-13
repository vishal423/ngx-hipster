import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { MovieService } from '../movie.service';
import { MovieFormService } from './movie-form.service';
import { Movie } from '../movie';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss']
})
export class MovieDetailComponent implements OnInit {
  movie: Movie;
  form: FormGroup;
  isSaveOrUpdateInProgress = false;
  error: string = undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formService: MovieFormService,
    private movieService: MovieService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(({ movie }) => {
      this.movie = movie;
      this.form = this.formService.toFormGroup(movie);
    });
    this.error = undefined;
  }

  saveOrUpdate() {
    this.isSaveOrUpdateInProgress = true;
    this.error = undefined;
    if (this.form.value.id) {
      this.subscribeToResponse(
        this.movieService.update(this.formService.fromFormGroup(this.form))
      );
    } else {
      this.subscribeToResponse(
        this.movieService.create(this.formService.fromFormGroup(this.form))
      );
    }
  }

  private subscribeToResponse(result: Observable<Movie>) {
    result.subscribe({
      next: () => this.router.navigate(['/movies']),
      error: response => {
        this.isSaveOrUpdateInProgress = false;
        this.error = response.error
          ? response.error.detail ||
            response.error.title ||
            'Internal Server Error'
          : 'Internal Server Error';
      },
      complete: () => (this.isSaveOrUpdateInProgress = false)
    });
  }

  cancel() {
    this.router.navigate(['/movies']);
    return false;
  }
}
