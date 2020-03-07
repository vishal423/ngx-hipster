package io.github.vishal423.ngxhipster.movie;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;

@Document
@Data
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

}
