package io.github.vishal423.ngxhipster.movie;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Document
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Movie {

  @Id
  private String id;
  private String title;
  private String plot;
  private String rated;
  private List<String> genres;
  private String director;
  private String writer;
  private LocalDate releaseDate;

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    Movie movie = (Movie) o;
    return getTitle().equals(movie.getTitle()) &&
      getReleaseDate().equals(movie.getReleaseDate());
  }

  @Override
  public int hashCode() {
    return Objects.hash(getTitle(), getReleaseDate());
  }
}
