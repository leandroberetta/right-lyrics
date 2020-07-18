package io.veicot.rightlyrics.rest.dto;

import lombok.Data;

@Data
public class ResponseDTO<T> {

    private T data;
    private Integer status;

}