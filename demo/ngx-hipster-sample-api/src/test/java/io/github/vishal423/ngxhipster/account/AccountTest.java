package io.github.vishal423.ngxhipster.account;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.test.StepVerifier;

import java.util.Set;

@WebFluxTest({AccountRouter.class, AccountHandler.class})
public class AccountTest {

  @Autowired
  private WebTestClient client;

  @Test
  public void getLoggedInUsername_UnauthenticatedUser() {

    StepVerifier.create(client.get()
      .uri("/api/authenticate")
      .exchange()
      .returnResult(String.class)
      .getResponseBody()
      .take(1))
      .expectComplete()
      .verify();
  }

  @Test
  @WithMockUser
  public void getLoggedInUsername_AuthenticatedUser() {

    StepVerifier.create(client.get()
      .uri("/api/authenticate")
      .exchange()
      .returnResult(String.class)
      .getResponseBody()
      .take(1))
      .expectNext("user")
      .verifyComplete();
  }

  @Test
  @WithMockUser(value = "admin", authorities = {"ROLE_ADMIN", "ROLE_USER"})
  public void getLoggedInUserDetails_AuthenticatedUser() {

    UserDto expectedUser = new UserDto("admin", "admin", Set.of("ROLE_ADMIN", "ROLE_USER"));

    StepVerifier.create(client.get()
      .uri("/api/account")
      .exchange()
      .returnResult(UserDto.class)
      .getResponseBody()
      .take(1))
      .expectNext(expectedUser)
      .verifyComplete();
  }
}
