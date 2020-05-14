package io.veicot.rightlyrics.model;

public class Song {
    
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
