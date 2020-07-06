package io.veicot.rightlyrics.repository;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.persistence.EntityManager;

import com.google.common.base.Strings;
import com.google.inject.Inject;

import org.hibernate.search.mapper.orm.Search;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import io.veicot.rightlyrics.model.Album;

@ApplicationScoped
public class AlbumRepository implements PanacheRepository<Album> {

    private EntityManager em;

    @Inject
    public AlbumRepository(EntityManager em) {
        this.em = em;
    }

    public List<Album> search(String queryString, int page, int size) {
        return Search.session(this.em).search(Album.class)
                .where(f -> Strings.isNullOrEmpty(queryString) ? f.matchAll()
                        : f.simpleQueryString().fields("title", "artist").matching(queryString))
                .fetchHits(page * size, size);
    }

}