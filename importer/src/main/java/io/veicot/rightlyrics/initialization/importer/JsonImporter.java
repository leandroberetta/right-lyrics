package io.veicot.rightlyrics.initialization.importer;

import javax.enterprise.context.RequestScoped;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.ToString;

@RequestScoped
@ToString
public class JsonImporter extends JacksonImporter {

    public JsonImporter() {
        super();
    }

    @Override
    public ImportType type() {
        return ImportType.JSON;
    }

    @Override
    protected ObjectMapper getMapper() {
        return new ObjectMapper();
    }

}
