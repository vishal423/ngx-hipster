import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { MovieService } from './../movie.service';
import { MovieDeleteComponent } from '../movie-delete/movie-delete.component';
import { Movie } from '../movie';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit {
  displayedColumns = ['title', 'genre', 'formActions'];
  routeData$ = this.route.data;
  showLoader = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private movieService: MovieService
  ) {}

  ngOnInit() {}

  delete(id: number, movie: Movie) {
    const dialogRef = this.dialog.open(MovieDeleteComponent, {
      data: movie
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.showLoader = true;
        this.movieService.delete(id).subscribe({
          next: () => this.router.navigate(['/movies']),
          error: () => (this.showLoader = false),
          complete: () => (this.showLoader = false)
        });
      }
    });
  }
}
