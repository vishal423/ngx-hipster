package io.github.vishal423.ngxhipster.movie;

import io.github.vishal423.ngxhipster.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class MovieService {

  private final MovieRepository repository;
  private final MovieMapper movieMapper;

  public MovieService(MovieRepository repository, MovieMapper movieMapper) {
    this.repository = repository;
    this.movieMapper = movieMapper;
  }

  public Flux<MovieDto> getMovies() {
    return repository.findAll().map(movieMapper::mapToDto);
  }

  public Mono<MovieDto> getMovieById(String movieId) {
    return repository.findById(movieId).map(movieMapper::mapToDto)
      .switchIfEmpty(Mono.error(new ResourceNotFoundException("Movie not found")));
  }
}
