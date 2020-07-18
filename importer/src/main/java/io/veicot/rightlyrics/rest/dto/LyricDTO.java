package io.veicot.rightlyrics.rest.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class LyricDTO {

    @JsonProperty("_id")
    private String _id;
    
    private String name;
    private String lyric;
}