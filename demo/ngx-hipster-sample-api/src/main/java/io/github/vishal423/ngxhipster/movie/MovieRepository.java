package io.github.vishal423.ngxhipster.movie;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;

interface MovieRepository extends ReactiveCrudRepository<Movie, String> {
}
