import { Route } from '@angular/router';

import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { MovieResolver } from './movie.resolver';
import { MovieListResolver } from './movie-list.resolver';

export const movieRoutes: Route[] = [
  {
    path: 'new',
    component: MovieDetailComponent,
    resolve: {
      movie: MovieResolver,
    },
  },
  {
    path: ':id/edit',
    component: MovieDetailComponent,
    resolve: {
      movie: MovieResolver,
    },
  },
  {
    path: '',
    component: MovieListComponent,
    resolve: {
      movies: MovieListResolver,
    },
    runGuardsAndResolvers: 'always',
  },
];
