package io.veicot.rightlyrics.dto;

import io.veicot.rightlyrics.model.Song;

import java.util.Date;
import java.util.List;

public class AlbumDto {

    public Long id;
    public String title;
    public String artist;
    public String coverUrl;
    public String year;

    public AlbumDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
}
