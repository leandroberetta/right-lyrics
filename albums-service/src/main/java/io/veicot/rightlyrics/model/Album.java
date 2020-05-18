package io.veicot.rightlyrics.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import lombok.Data;

import java.util.Set;

@Entity
@Data
public class Album {

    @Id
    @GeneratedValue
    private Long id;

    private String title;
    private String artist;
    private String coverUrl;
    private String year;

    @OneToMany
    private Set<Song> songs;

    public Album() {
    }

    public Album(String title, String artist, String coverUrl, String year) {

        this.title = title;
        this.artist = artist;
        this.coverUrl = coverUrl;
        this.year = year;
    }

}
