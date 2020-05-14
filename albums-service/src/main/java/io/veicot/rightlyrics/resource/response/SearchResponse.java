package io.veicot.rightlyrics.resource.response;

import io.veicot.rightlyrics.resource.response.Response;

public class SearchResponse<T> extends Response<T> {

    public Integer length;

    public Integer getLength() {
        return length;
    }

    public void setLength(Integer length) {
        this.length = length;
    }
}
