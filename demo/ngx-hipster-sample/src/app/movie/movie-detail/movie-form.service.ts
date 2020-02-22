import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { Movie } from '../movie';

@Injectable({
  providedIn: 'root'
})
export class MovieFormService {
  constructor(private formBuilder: FormBuilder) {}

  toFormGroup(movie: Partial<Movie> = {}) {
    return this.formBuilder.group({
      id: this.formBuilder.control(movie.id, []),
      title: this.formBuilder.control(movie.title, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(200)
      ]),
      plot: this.formBuilder.control(movie.plot, [
        Validators.minLength(100),
        Validators.maxLength(1000)
      ]),
      rated: this.formBuilder.control(movie.rated, []),
      genres: this.formBuilder.control(movie.genres, [Validators.required]),
      director: this.formBuilder.control(movie.director, [Validators.required]),
      writer: this.formBuilder.control(movie.writer, [Validators.required]),
      releaseDate: this.formBuilder.control(movie.releaseDate, [
        Validators.required
      ])
    });
  }

  fromFormGroup(formGroup: FormGroup) {
    return {
      id: formGroup.get('id')!.value,
      title: formGroup.get('title')!.value,
      plot: formGroup.get('plot')!.value,
      rated: formGroup.get('rated')!.value,
      genres: formGroup.get('genres')!.value,
      director: formGroup.get('director')!.value,
      writer: formGroup.get('writer')!.value,
      releaseDate: formGroup.get('releaseDate')!.value
    };
  }
}
