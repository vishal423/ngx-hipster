package io.github.vishal423.ngxhipster.common;

public class ResourceNotFoundException extends RuntimeException {
  public ResourceNotFoundException(String notFoundMessage) {
    super(notFoundMessage);
  }
}
