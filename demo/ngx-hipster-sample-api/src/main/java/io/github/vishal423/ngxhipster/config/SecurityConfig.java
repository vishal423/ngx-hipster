package io.github.vishal423.ngxhipster.config;

import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.HttpStatusServerEntryPoint;
import org.springframework.security.web.server.authentication.logout.HttpStatusReturningServerLogoutSuccessHandler;
import org.springframework.security.web.server.csrf.CookieServerCsrfTokenRepository;
import org.springframework.security.web.server.csrf.CsrfToken;
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatchers;
import reactor.core.publisher.Mono;

@EnableWebFluxSecurity
public class SecurityConfig {

  @Bean
  public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
    http
      .csrf(csrf -> csrf.csrfTokenRepository(CookieServerCsrfTokenRepository.withHttpOnlyFalse()))
      .addFilterAfter((exchange, chain) -> exchange.<Mono<CsrfToken>>getAttribute(CsrfToken.class.getName())
        .doOnSuccess(csrfToken-> {})
        .then(chain.filter(exchange)), SecurityWebFiltersOrder.CSRF)
      .authorizeExchange(exchange ->
        exchange
          .pathMatchers("/actuator/info", "/actuator/health").permitAll()
          .pathMatchers("/api/authenticate").permitAll()
          .anyExchange().authenticated()
      )
      .formLogin(formLoginSpec -> formLoginSpec
        .requiresAuthenticationMatcher(ServerWebExchangeMatchers.pathMatchers(HttpMethod.POST,"/api/authentication"))
        .authenticationEntryPoint(new HttpStatusServerEntryPoint(HttpStatus.UNAUTHORIZED))
        .authenticationSuccessHandler((exchange, authentication) -> Mono.fromRunnable(() ->
          exchange.getExchange().getResponse().setStatusCode(HttpStatus.OK))
        )
        .authenticationFailureHandler((exchange, authentication) -> Mono.fromRunnable(() ->
          exchange.getExchange().getResponse().setStatusCode(HttpStatus.UNAUTHORIZED))
        )
      )
      .logout(logoutSpec ->
        logoutSpec
          .logoutUrl("/api/logout")
          .logoutSuccessHandler(new HttpStatusReturningServerLogoutSuccessHandler())
      );

    return http.build();
  }
}
