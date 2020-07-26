package io.veicot.rightlyrics.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class LyricsDTO {

    private String _id;
    private String name;
    private String lyrics;
}