package io.veicot.rightlyrics.resource.response;

import lombok.Data;

@Data
public class Response<T> {

    private T data;
    private Integer status;

}
