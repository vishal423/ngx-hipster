package io.github.vishal423.ngxhipster.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.reactive.function.BodyInserters;
import reactor.test.StepVerifier;

@SpringBootTest
@AutoConfigureWebTestClient
public class SecurityConfigTest {
  @Autowired
  private WebTestClient client;

  @Test
  public void authenticateResource_successResponse_unauthenticatedUser() {

    StepVerifier.create(client.get()
      .uri("/api/authenticate")
      .exchange()
      .expectStatus().isOk()
      .returnResult(String.class)
      .getResponseBody()
      .take(1))
      .expectComplete()
      .verify();
  }

  @Test
  public void accountResource_unauthorizedResponse() {

    StepVerifier.create(client.get()
      .uri("/api/account")
      .exchange()
      .expectStatus().isUnauthorized()
      .returnResult(String.class)
      .getResponseBody()
      .take(1))
      .expectComplete()
      .verify();
  }

  @Test
  @WithMockUser(value = "admin", password = "admin")
  public void login_validCredentials_forbiddenResponse_csrfCheck() {

    StepVerifier.create(client.post()
      .uri("/api/authentication")
      .contentType(MediaType.MULTIPART_FORM_DATA)
      .body(BodyInserters.fromFormData("username", "admin").with("password", "admin"))
      .exchange()
      .expectStatus().isForbidden()
      .returnResult(String.class)
      .getResponseBody()
      .take(1))
      .expectNext("CSRF Token has been associated to this client")
      .expectComplete()
      .verify();
  }

  @Test
  @WithMockUser(value = "admin", password = "admin")
  public void login_invalidCredentials() {
    client.get()
      .uri("/api/authenticate")
      .exchange()
      .expectStatus().isOk()
      .returnResult(String.class)
      .consumeWith(result -> {
        String csrfToken = result.getResponseCookies().getFirst("XSRF-TOKEN").getValue();
        StepVerifier.create(client.post()
          .uri("/api/authentication")
          .contentType(MediaType.MULTIPART_FORM_DATA)
          .cookie("XSRF-TOKEN", csrfToken)
          .header("X-XSRF-TOKEN", csrfToken)
          .body(BodyInserters.fromFormData("username", "admin").with("password", "invalid"))
          .exchange()
          .expectStatus().isUnauthorized()
          .returnResult(String.class)
          .getResponseBody()
          .take(1)
        ).expectComplete()
          .verify();
      });
  }

  @Test
  @WithMockUser(value = "admin", password = "admin")
  public void login() {

    client.get()
      .uri("/api/authenticate")
      .exchange()
      .expectStatus().isOk()
      .returnResult(String.class)
      .consumeWith(result -> {
        String csrfToken = result.getResponseCookies().getFirst("XSRF-TOKEN").getValue();
        StepVerifier.create(client.post()
          .uri("/api/authentication")
          .contentType(MediaType.MULTIPART_FORM_DATA)
          .cookie("XSRF-TOKEN", csrfToken)
          .header("X-XSRF-TOKEN", csrfToken)
          .body(BodyInserters.fromFormData("username", "admin").with("password", "admin"))
          .exchange()
          .expectStatus().isOk()
          .returnResult(String.class)
          .getResponseBody().take(1)
        ).expectComplete()
          .verify();
      });
  }

  @Test
  @WithMockUser(value = "admin", password = "admin")
  public void logout() {

    client.get()
      .uri("/api/authenticate")
      .exchange()
      .expectStatus().isOk()
      .returnResult(String.class)
      .consumeWith(result -> {
        String csrfToken = result.getResponseCookies().getFirst("XSRF-TOKEN").getValue();
        client.post()
          .uri("/api/authentication")
          .contentType(MediaType.MULTIPART_FORM_DATA)
          .cookie("XSRF-TOKEN", csrfToken)
          .header("X-XSRF-TOKEN", csrfToken)
          .body(BodyInserters.fromFormData("username", "admin").with("password", "admin"))
          .exchange()
          .expectStatus().isOk()
          .returnResult(String.class)
          .consumeWith(loginResult -> {
//            String loginCsrfToken = loginResult.getResponseCookies().getFirst("XSRF-TOKEN").getValue();
            StepVerifier.create(client.post()
              .uri("/api/logout")
              .cookie("XSRF-TOKEN", csrfToken)
              .header("X-XSRF-TOKEN", csrfToken)
              .body(BodyInserters.empty())
              .exchange()
              .expectStatus().isOk()
              .returnResult(String.class)
              .getResponseBody().take(1)
            ).expectComplete()
              .verify();
          });
      });
  }
}
