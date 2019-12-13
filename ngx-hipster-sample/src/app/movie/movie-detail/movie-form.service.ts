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
        Validators.maxLength(20)
      ]),
      plot: this.formBuilder.control(movie.plot, [Validators.minLength(100)]),
      genre: this.formBuilder.control(movie.genre, [])
    });
  }

  fromFormGroup(formGroup: FormGroup) {
    return {
      id: formGroup.get('id').value,
      title: formGroup.get('title').value,
      plot: formGroup.get('plot').value,
      genre: formGroup.get('genre').value
    };
  }
}
