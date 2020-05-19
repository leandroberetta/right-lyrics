package io.veicot.rightlyrics.initialization.importer;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class TestDTO {

    private String name;
    private int height;
    private Date birth;
    private List<TestDTO> siblings;

}
