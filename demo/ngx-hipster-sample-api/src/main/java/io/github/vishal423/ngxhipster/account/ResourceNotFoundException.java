package io.github.vishal423.ngxhipster.account;

public class ResourceNotFoundException extends RuntimeException {
  public ResourceNotFoundException(String notFoundMessage) {
    super(notFoundMessage);
  }
}
