package io.veicot.rightlyrics.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import io.veicot.rightlyrics.model.Album;

import javax.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class AlbumRepository implements PanacheRepository<Album> {}