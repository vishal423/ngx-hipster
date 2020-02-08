import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Movie } from '../movie';

@Component({
  selector: 'app-movie-delete',
  templateUrl: './movie-delete.component.html',
  styleUrls: ['./movie-delete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieDeleteComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Movie) {}
}
