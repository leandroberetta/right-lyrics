package io.veicot.rightlyrics.model;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Song {

    @Id
    public Long id;

    public Song() {}

    public Song(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

}
