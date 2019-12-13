import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { movieRoutes } from './movie.route';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { MovieDeleteComponent } from './movie-delete/movie-delete.component';

@NgModule({
  declarations: [
    MovieListComponent,
    MovieDetailComponent,
    MovieDeleteComponent
  ],
  imports: [SharedModule, RouterModule.forChild(movieRoutes)],
  entryComponents: [MovieDeleteComponent],
  exports: []
})
export class MovieModule {}
