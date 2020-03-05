package io.github.vishal423.ngxhipster.account;

import io.github.vishal423.ngxhipster.common.ResourceNotFoundException;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

import java.security.Principal;
import java.util.stream.Collectors;

@Component
public class AccountHandler {

  public Mono<ServerResponse> getLoggedInUsername(ServerRequest request) {
    return ServerResponse.ok()
      .contentType(MediaType.TEXT_PLAIN)
      .body(request.principal()
        .map(Principal::getName), String.class);
  }

  public Mono<ServerResponse> getLoggedInUserDetails(ServerRequest request) {
    return ServerResponse.ok()
      .contentType(MediaType.APPLICATION_JSON)
      .body(ReactiveSecurityContextHolder.getContext()
        .map(SecurityContext::getAuthentication)
        .filter(UsernamePasswordAuthenticationToken.class::isInstance)
        .map(UsernamePasswordAuthenticationToken.class::cast)
        .map(UsernamePasswordAuthenticationToken::getPrincipal)
        .filter(User.class::isInstance)
        .map(User.class::cast)
        .map(user ->
          new UserDto(
            user.getUsername(), user.getUsername(),
            user.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toSet())))
        .switchIfEmpty(Mono.error(new ResourceNotFoundException("User could not be found"))), UserDto.class);
  }
}
