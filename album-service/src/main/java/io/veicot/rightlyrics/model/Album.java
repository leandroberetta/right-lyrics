package io.veicot.rightlyrics.model;

import java.util.Set;

public class Album {
    
    public Long id;
    public String title;
    public String artist;
    public String coverUrl;
    public String year;
    public Set<Song> songs;

    public Album() {}

    public Album(Long id,
                 String title,
                 String artist,
                 String coverUrl,
                 String year) {

        this.id = id;
        this.title = title;
        this.artist = artist;
        this.coverUrl = coverUrl;
        this.year = year;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getArtist() {
        return artist;
    }

    public void setArtist(String artist) {
        this.artist = artist;
    }

    public String getCoverUrl() {
        return coverUrl;
    }

    public void setCoverUrl(String coverUrl) {
        this.coverUrl = coverUrl;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public Set<Song> getSongs() {
        return songs;
    }

    public void setSongs(Set<Song> songs) {
        this.songs = songs;
    }
}
