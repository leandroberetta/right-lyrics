package io.veicot.rightlyrics.resource.response;

public class Response<T> {

    private T data;
    private Integer status;

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}
