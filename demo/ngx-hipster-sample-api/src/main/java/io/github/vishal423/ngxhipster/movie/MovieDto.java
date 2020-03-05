package io.github.vishal423.ngxhipster.movie;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieDto {

  private String id;
  private String title;
  private String plot;
  private String rated;
  private List<String> genres;
  private String director;
  private String writer;
  private LocalDate releaseDate;
}
