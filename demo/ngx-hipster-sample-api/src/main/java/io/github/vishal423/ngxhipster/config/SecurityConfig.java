package io.github.vishal423.ngxhipster.config;

import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.logout.HttpStatusReturningServerLogoutSuccessHandler;
import org.springframework.security.web.server.csrf.CookieServerCsrfTokenRepository;
import reactor.core.publisher.Mono;

@EnableWebFluxSecurity
public class SecurityConfig {

  @Bean
  public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
    http
      .csrf(csrf -> csrf.csrfTokenRepository(CookieServerCsrfTokenRepository.withHttpOnlyFalse()))
      .authorizeExchange(exchanges ->
        exchanges
          .anyExchange().authenticated()
      )
      .formLogin(formLoginSpec -> formLoginSpec
        .authenticationSuccessHandler((exchange, authentication) -> {
          exchange.getExchange().getResponse().setStatusCode(HttpStatus.OK);
          return Mono.empty();
        })
        .authenticationFailureHandler((exchange, authentication) -> {
          exchange.getExchange().getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
          return Mono.empty();
        })
      )
      .logout(logoutSpec -> logoutSpec.logoutSuccessHandler(new HttpStatusReturningServerLogoutSuccessHandler()));

    return http.build();
  }
}
