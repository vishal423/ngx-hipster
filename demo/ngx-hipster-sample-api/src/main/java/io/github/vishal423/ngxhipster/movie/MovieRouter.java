package io.github.vishal423.ngxhipster.movie;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

@Configuration
class MovieRouter {

  @Bean
  RouterFunction<ServerResponse> movieRoutes(MovieHandler handler) {
    return RouterFunctions
      .route()
      .path("/api/movies", builder -> builder
        .GET("",
          handler::getMovies)
        .GET("/{id}",
          handler::getMovieById))
      .build();
  }
}
