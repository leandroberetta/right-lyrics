package io.veicot.rightlyrics.dto;

import java.util.List;

import lombok.Data;

@Data
public class AlbumDTO {
    private Long id;
    private String title;
    private String artist;
    private String coverUrl;
    private String year;
    private List<SongDTO> songs;
}