package io.veicot.rightlyrics.model.dto;

import lombok.Data;

@Data
public class AlbumDto {

    private Long id;
    private String title;
    private String artist;
    private String coverUrl;
    private String year;

}
