package io.veicot.rightlyrics.dto;

import lombok.Data;

@Data
public class SongDTO {
    private Long id;
    private String name;
    private String lyrics;
    private Long albumId;
    private String lyricsId;
    private String artist;
    private String youtubeLink;
}