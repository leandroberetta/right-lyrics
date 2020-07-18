package io.veicot.rightlyrics.rest.dto;

import lombok.Data;

@Data
public class SongDTO {
    private Long id;
    private String name;
    private String lyricFile;    
    private Long albumId;
    private String lyricId;
    private String artist;
}