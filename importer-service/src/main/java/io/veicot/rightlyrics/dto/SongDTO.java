package io.veicot.rightlyrics.dto;

import lombok.Data;

@Data
public class SongDTO {
    private Long id;
    private String name;
    private String lyric;    
    private Long albumId;
    private String lyricId;
    private String artist;
}