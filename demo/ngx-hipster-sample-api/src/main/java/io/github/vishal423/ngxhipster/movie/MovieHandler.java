package io.github.vishal423.ngxhipster.movie;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

@Component
class MovieHandler {

  private final MovieService service;

  public MovieHandler(MovieService service) {
    this.service = service;
  }

  Mono<ServerResponse> getMovies(ServerRequest request) {
    return ServerResponse.ok()
      .body(service.getMovies(), MovieDto.class);
  }

  Mono<ServerResponse> getMovieById(ServerRequest request) {
    return ServerResponse.ok()
      .body(service.getMovieById(request.pathVariable("id")), MovieDto.class);
  }

  Mono<ServerResponse> createMovie(ServerRequest request) {

    return ServerResponse.ok()
      .body(service.createMovie(request.bodyToMono(MovieDto.class)), MovieDto.class);
  }

  Mono<ServerResponse> updateMovie(ServerRequest request) {
    return ServerResponse.ok()
      .body(service.updateMovie(request.bodyToMono(MovieDto.class)), MovieDto.class);
  }

  Mono<ServerResponse> deleteMovieById(ServerRequest request) {
    return service.deleteMovieById(request.pathVariable("id"))
    .then(ServerResponse.noContent().build());
  }
}
