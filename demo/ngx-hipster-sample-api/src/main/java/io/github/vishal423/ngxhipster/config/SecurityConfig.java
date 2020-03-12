package io.github.vishal423.ngxhipster.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.client.registration.ReactiveClientRegistrationRepository;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.HttpStatusServerEntryPoint;
import org.springframework.security.web.server.authentication.logout.HttpStatusReturningServerLogoutSuccessHandler;
import org.springframework.security.web.server.authentication.logout.ServerLogoutSuccessHandler;
import org.springframework.security.web.server.csrf.CookieServerCsrfTokenRepository;
import org.springframework.security.web.server.csrf.CsrfToken;
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatchers;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.function.Predicate;

@EnableWebFluxSecurity
public class SecurityConfig {

  private final Environment environment;
  private final ReactiveClientRegistrationRepository clientRegistrationRepository;
  private final ObjectMapper objectMapper;

  public SecurityConfig(Environment environment, ReactiveClientRegistrationRepository clientRegistrationRepository, ObjectMapper objectMapper) {
    this.environment = environment;
    this.clientRegistrationRepository = clientRegistrationRepository;
    this.objectMapper = objectMapper;
  }

  @Bean
  public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
    http
      .csrf(csrf -> csrf.csrfTokenRepository(CookieServerCsrfTokenRepository.withHttpOnlyFalse()))
      .addFilterAfter((exchange, chain) -> exchange.<Mono<CsrfToken>>getAttribute(CsrfToken.class.getName())
        .doOnSuccess(csrfToken-> {})
        .then(chain.filter(exchange)), SecurityWebFiltersOrder.CSRF)
      .authorizeExchange(exchange -> exchange
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

    if(Arrays.stream(environment.getActiveProfiles()).anyMatch(Predicate.isEqual("oidc"))) {
      configureOidcLogin(http);
    }

    if(Arrays.stream(environment.getActiveProfiles()).anyMatch(Predicate.isEqual("basic"))) {
      configureBasicAuth(http);
    }

    return http.build();
  }

  private void configureOidcLogin(ServerHttpSecurity http){
    http.oauth2Login()
      .and().logout(logout -> logout
      .logoutSuccessHandler(oidcLogoutSuccessHandler())
    );
  }

  private ServerLogoutSuccessHandler oidcLogoutSuccessHandler() {
    return new OidcLogoutSuccessHandler(clientRegistrationRepository, objectMapper);
  }

  private void configureBasicAuth(ServerHttpSecurity http){
    http.httpBasic().and()
      .csrf().disable();
  }
}
