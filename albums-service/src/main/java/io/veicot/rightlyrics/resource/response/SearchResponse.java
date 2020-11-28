package io.veicot.rightlyrics.resource.response;

public class SearchResponse<T> extends Response<T> {

    private Integer length;

    public Integer getLength() {
        return length;
    }

    public void setLength(Integer length) {
        this.length = length;
    }
}
