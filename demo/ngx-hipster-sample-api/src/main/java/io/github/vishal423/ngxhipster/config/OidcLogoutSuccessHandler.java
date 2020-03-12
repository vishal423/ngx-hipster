package io.github.vishal423.ngxhipster.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.buffer.DataBufferFactory;
import org.springframework.core.io.buffer.DefaultDataBufferFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ReactiveClientRegistrationRepository;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.server.WebFilterExchange;
import org.springframework.security.web.server.authentication.logout.ServerLogoutSuccessHandler;
import org.springframework.web.server.ServerErrorException;
import reactor.core.publisher.Mono;

import java.util.Map;

public class OidcLogoutSuccessHandler implements ServerLogoutSuccessHandler {
  private final ReactiveClientRegistrationRepository clientRegistrationRepository;
  private final ObjectMapper objectMapper;

  public OidcLogoutSuccessHandler(ReactiveClientRegistrationRepository clientRegistrationRepository, ObjectMapper objectMapper) {
    this.clientRegistrationRepository = clientRegistrationRepository;
    this.objectMapper = objectMapper;
  }

  @Override
  public Mono<Void> onLogoutSuccess(WebFilterExchange exchange, Authentication authentication) {
    ServerHttpResponse response = exchange.getExchange().getResponse();
    response.setStatusCode(HttpStatus.OK);
    response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
    return response.writeWith(
      Mono.just(authentication)
        .filter(OAuth2AuthenticationToken.class::isInstance)
        .map(OAuth2AuthenticationToken.class::cast)
        .flatMap(authenticationToken -> Mono.zip(
          endSessionEndpoint(authenticationToken),
          idTokenValue(authenticationToken),
          (sessionEndpoint, idTokenValue) -> Map.of(
            "idToken", idTokenValue,
            "logoutUrl", sessionEndpoint)))
        .flatMap(mapResponse  -> Mono.fromCallable(() -> {
            DataBufferFactory factory = new DefaultDataBufferFactory();
            try {
              return factory.allocateBuffer().write(objectMapper.writeValueAsBytes(mapResponse));
            } catch (JsonProcessingException e) {
              throw new ServerErrorException("Failure in the response serialization", e);
            }
          }
        ))
        .switchIfEmpty(Mono.error(new AuthenticationCredentialsNotFoundException("User is not authenticated")))
    );
  }


  private Mono<String> endSessionEndpoint(OAuth2AuthenticationToken token) {
    return this.clientRegistrationRepository.findByRegistrationId(token.getAuthorizedClientRegistrationId())
      .map(ClientRegistration::getProviderDetails)
      .map(ClientRegistration.ProviderDetails::getConfigurationMetadata)
      .flatMap(configurationMetadata -> Mono.justOrEmpty(configurationMetadata.get("end_session_endpoint")))
      .map(Object::toString)
      .switchIfEmpty(Mono.error(new AuthenticationCredentialsNotFoundException("User is not authenticated")));
  }

  private Mono<String> idTokenValue(OAuth2AuthenticationToken authenticationToken) {
    return Mono.just(authenticationToken)
      .map(OAuth2AuthenticationToken::getPrincipal)
      .filter(OidcUser.class::isInstance)
      .map(OidcUser.class::cast)
      .map(OidcUser::getIdToken)
      .map(OidcIdToken::getTokenValue)
      .switchIfEmpty(Mono.error(new AuthenticationCredentialsNotFoundException("User is not authenticated")));
  }
}
