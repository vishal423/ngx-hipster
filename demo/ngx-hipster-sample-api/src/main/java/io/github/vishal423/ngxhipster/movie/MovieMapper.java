package io.github.vishal423.ngxhipster.movie;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
interface MovieMapper {

  MovieDto mapToDto(Movie model);

  Movie mapFromDto(MovieDto movieDto);
}

