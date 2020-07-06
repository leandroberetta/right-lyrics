package io.veicot.rightlyrics.model;

import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import org.hibernate.search.engine.backend.types.Searchable;
import org.hibernate.search.engine.backend.types.Sortable;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.FullTextField;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.Indexed;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.KeywordField;

import lombok.Data;


@Entity
@Indexed
@Data
public class Album {

    @Id
    @GeneratedValue
    private Long id;

    @FullTextField(analyzer = "whitespace")
    private String title;

    @FullTextField(analyzer = "whitespace")
    private String artist;
    private String coverUrl;

    @KeywordField(name = "year_sort", searchable = Searchable.YES, sortable = Sortable.YES, normalizer = "sort")
    private String year;

    public Album() {
    }

    public Album(String title, String artist, String coverUrl, String year) {

        this.title = title;
        this.artist = artist;
        this.coverUrl = coverUrl;
        this.year = year;
    }

}
