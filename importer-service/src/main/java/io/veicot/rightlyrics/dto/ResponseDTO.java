package io.veicot.rightlyrics.dto;

import lombok.Data;

@Data
public class ResponseDTO<T> {

    private T data;
    private Integer status;

}