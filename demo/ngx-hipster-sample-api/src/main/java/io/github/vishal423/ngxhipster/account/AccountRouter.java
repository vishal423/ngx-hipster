package io.github.vishal423.ngxhipster.account;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.RequestPredicates;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

@Configuration
public class AccountRouter {

  @Bean
  public RouterFunction<ServerResponse> route(AccountHandler handler) {
    return RouterFunctions
      .route()
      .path("/api", builder -> builder
        .GET("/authenticate",
          RequestPredicates.accept(MediaType.TEXT_PLAIN),
          handler::getLoggedInUsername)
        .GET("/account",
          RequestPredicates.accept(MediaType.APPLICATION_JSON), handler::getLoggedInUserDetails))
      .build();
  }
}
