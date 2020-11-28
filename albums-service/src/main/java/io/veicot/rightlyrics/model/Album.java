package io.veicot.rightlyrics.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import lombok.Data;

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

    public Album() {
    }

    public Album(String title, String artist, String coverUrl, String year) {

        this.title = title;
        this.artist = artist;
        this.coverUrl = coverUrl;
        this.year = year;
    }

}
