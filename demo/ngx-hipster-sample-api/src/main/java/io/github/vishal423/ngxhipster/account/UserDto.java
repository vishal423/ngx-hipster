package io.github.vishal423.ngxhipster.account;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

  private String login;
  private String firstName;
  private Set<String> authorities;
}
